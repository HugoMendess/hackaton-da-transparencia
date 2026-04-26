# 🏗️ ARQUITETURA TÉCNICA - Portal da Transparência

> Este documento descreve duas arquiteturas: a **arquitetura de produto** (Portal da Transparência como portal oficial em produção, substituindo o atual) e a **arquitetura do MVP do hackathon** (subset funcional para demonstração em 48h).

---

## Sumário

1. [Visão Geral do Produto](#1-visão-geral-do-produto)
2. [Arquitetura de Produção](#2-arquitetura-de-produção)
3. [Arquitetura do MVP](#3-arquitetura-do-mvp-do-hackathon)
4. [Stack Detalhada](#4-stack-detalhada)
5. [Estrutura de Pastas (Frontend)](#5-estrutura-de-pastas-frontend)
6. [Modelo de Dados](#6-modelo-de-dados)
7. [APIs e Fontes Oficiais](#7-apis-e-fontes-oficiais)
8. [Mapeamento Eixos -> Categorias](#8-mapeamento-eixos--categorias)
9. [Compliance, Segurança e Auditoria](#9-compliance-segurança-e-auditoria)
10. [Performance e Escalabilidade](#10-performance-e-escalabilidade)
11. [Roadmap Técnico de Substituição](#11-roadmap-técnico-de-substituição)
12. [Decisões Técnicas](#12-decisões-técnicas)

---

## 1. Visão Geral do Produto

```
┌─────────────────────────────────────────────────────────┐
│              CIDADÃO MARANHENSE                          │
│      Celular (56%) | Desktop (43%) | Tablet (1%)         │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS / PWA
┌────────────────────────▼────────────────────────────────┐
│              FRONTEND - Next.js + Tailwind               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐ │
│  │ Eixos    │ │ Dashboard│ │ Mapa     │ │ Assistente │ │
│  │ Temáticos│ │ Cidadão  │ │ MA       │ │ IA         │ │
│  └──────────┘ └──────────┘ └──────────┘ └────────────┘ │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐ │
│  │Glossário │ │ Cards de │ │Compart.  │ │Acessibilid.│ │
│  │ Vivo     │ │ Resumo   │ │ Zap      │ │ WCAG AA    │ │
│  └──────────┘ └──────────┘ └──────────┘ └────────────┘ │
└────────────────────────┬────────────────────────────────┘
                         │
              ┌──────────┴──────────┐
              │                     │
   ┌──────────▼─────────┐ ┌─────────▼──────────┐
   │  API Portal da Transparência   │ │ Edge Functions     │
   │  (Node + Postgres) │ │ IA (Claude/Anthr.) │
   └──────────┬─────────┘ └─────────┬──────────┘
              │                     │
   ┌──────────▼─────────────────────▼─────────────┐
   │       Camada de Ingestão de Dados             │
   │  (ETL/CDC dos sistemas oficiais do Estado)    │
   └──────────┬───────────────────────────────────┘
              │
   ┌──────────▼─────────┐ ┌─────────────────────┐
   │ Sistemas Oficiais  │ │ Painel Admin        │
   │ SIAFEM, SIPRO, etc.│ │ (Órgãos + STC)      │
   └────────────────────┘ └─────────────────────┘
```

---

## 2. Arquitetura de Produção

### 2.1 Camadas

| Camada | Responsabilidade |
|---|---|
| **Frontend** | Interface cidadã, PWA, mobile-first, acessibilidade, glossário vivo, cards de resumo |
| **API Portal da Transparência** | Servir dados consolidados ao frontend, aplicar regras de exibição cidadã, cache |
| **Edge Functions** | Processar perguntas do Assistente IA, gerar imagens do Compartilhar Zap, autenticar sessões admin |
| **Camada de Ingestão** | ETL/CDC dos sistemas oficiais do Estado (SIAFEM, SIPRO, sistemas de RH, sistemas escolares) |
| **Banco de Dados** | PostgreSQL com schemas versionados, auditoria, replicação geográfica |
| **Painel Admin** | Interface para órgãos publicadores e equipe da STC |
| **Observabilidade** | Logs, métricas, alertas, painel de saúde |

### 2.2 Frontend (Produção)

```
Next.js 14 (App Router) + React 18 + TypeScript
├── Tailwind CSS + shadcn/ui          → Design system
├── Recharts                           → Gráficos
├── react-simple-maps                  → Mapa do MA
├── lucide-react                       → Ícones acessíveis
├── next-pwa                           → Service Worker / offline
├── @vercel/og                         → Geração de cards (Compartilhar Zap)
├── react-aria                         → Acessibilidade avançada
├── @anthropic-ai/sdk                  → Cliente do Assistente IA
└── @supabase/supabase-js              → Auth e dados (admin)
```

**Por que Next.js (e não Vite puro):**
- Server Components reduzem o JS no celular
- App Router habilita streaming de UI (TTI mais rápido em 3G)
- Edge Functions nativas para IA e geração de imagem
- SEO de portal público é crítico, Next entrega SSR/ISR de fábrica
- ISR permite cacheamento por tema com revalidação automática quando órgão publica

### 2.3 Backend (Produção)

| Serviço | Stack |
|---|---|
| API principal | Node.js (Fastify ou Hono) + TypeScript |
| ORM/Query | Drizzle ou pg puro com queries versionadas |
| Banco | PostgreSQL 16 (Supabase ou autohospedado) |
| Cache | Redis para dados quentes + ISR no frontend |
| Filas | BullMQ ou pg-boss para ingestão assíncrona |
| Storage | Supabase Storage / S3 para imagens de obras |
| Auth | Supabase Auth (gestores) com SSO institucional |

### 2.4 Camada de Ingestão

**Estratégia híbrida:**

| Fonte | Modo | Frequência |
|---|---|---|
| SIAFEM (despesas, empenhos) | CDC ou ETL via export oficial | Diário |
| SIPRO (licitações) | API ou import | Diário |
| Sistemas de RH | API quando disponível, import em CSV | Semanal |
| Dados de obras | Painel admin + import de planilhas | Tempo real (publicação manual) |
| Programas sociais | Integração com sistemas das secretarias | Conforme disponibilidade |

Toda ingestão registra:
- Origem (sistema, arquivo, usuário)
- Timestamp
- Hash do conjunto de dados antes/depois
- Validações executadas

### 2.5 Painel Admin

- Login institucional (SSO ou Supabase Auth)
- Perfis: STC (admin global), Órgão (admin do próprio domínio), Auditor (somente leitura)
- Operações: upload de dados, edição de conteúdos cidadãos (descrição em linguagem simples), curadoria de glossário
- Auditoria imutável: toda operação é registrada e exportável
- Workflow opcional de aprovação (publicação por dois pares para dados críticos)

### 2.6 Assistente IA (Produção)

```
Cidadão -> Frontend -> Edge Function (POST /api/ask)
                          │
                          ▼
                  1. Sanitização do input
                  2. Classificação de intenção (LLM)
                  3. Mapeamento para query estruturada
                  4. Execução no Postgres
                  5. Geração da resposta cidadã (LLM)
                  6. Anexação de fontes oficiais
                          │
                          ▼
                  Resposta + gráfico + fontes
```

**Salvaguardas:**
- LLM nunca retorna dado que não veio do banco (RAG estrito sobre dados oficiais)
- Toda resposta tem citação da fonte (link para o dado oficial)
- Perguntas fora do escopo recebem fallback: *"Essa pergunta não tem resposta no nosso conjunto de dados. Tente reformular ou consulte..."*
- Rate limiting por IP (anti-abuso)
- Logs de perguntas para evolução do produto (sem PII)

---

## 3. Arquitetura do MVP do Hackathon

### 3.1 Escopo Otimizado (48h)

| Camada | Decisão para o MVP |
|---|---|
| Frontend | React + Vite + TypeScript (decisão fechada) |
| Backend | **Supabase (Postgres + Edge Functions + pgvector)** |
| API IA | Claude API via **Edge Function do Supabase** (chave protegida) |
| Banco | **Supabase Postgres** com dados estruturados |
| Cache de IA | Supabase (cache semântico) |
| Logs anônimos | Supabase com TTL e sem PII |
| Admin | Não aplicável (fica em Fase 2) |
| Auth | Não aplicável no MVP cidadão |
| Deploy | Vercel |

### 3.2 Diagrama do MVP

```
┌────────────────────────────────────┐
│   Cidadão (Celular)                │
│   Mobile (56%) + Desktop (43%)     │
└──────────────┬─────────────────────┘
               │
┌──────────────▼─────────────────────┐
│  React + Vite + Tailwind (PWA)     │
│  ┌────────┐ ┌──────────┐ ┌───────┐ │
│  │ Eixos  │ │ Busca +  │ │ Mapa  │ │
│  │ (7)    │ │ Dashboard│ │ MA    │ │
│  └────────┘ └──────────┘ └───────┘ │
│  ┌────────┐ ┌──────────┐ ┌───────┐ │
│  │Glossár.│ │AjudaInte-│ │Compar-│ │
│  │ Vivo   │ │ ligente  │ │ tilhar│ │
│  │        │ │ (drawer) │ │ Zap   │ │
│  └────────┘ └──────────┘ └───────┘ │
└────┬───────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│  Supabase                           │
│  ┌───────────┐ ┌─────────────────┐  │
│  │ Postgres  │ │ Edge Function   │  │
│  │ - Eixos   │ │  /ask           │  │
│  │ - Glossár │ │ - Sanit. input  │  │
│  │ - Conteúd │ │ - Anti injection│  │
│  │ - Cache   │ │ - Rate limit    │  │
│  │ - Logs    │ │ - Bloqueio CPF  │  │
│  │ - pgvect. │ │ - Chama Claude  │  │
│  └───────────┘ └─────────┬───────┘  │
└────────────────────────┬─┴──────────┘
                         │
            ┌────────────┴────────────┐
            ▼                         ▼
   ┌──────────────────┐    ┌──────────────────┐
   │ Claude API       │    │ API Oficial do   │
   │ (Anthropic)      │    │ Portal MA        │
   │ - haiku-4-5 p/   │    │ (dados em        │
   │   classificação  │    │  tempo real)     │
   │ - sonnet-4-6 p/  │    │                  │
   │   geração final  │    │                  │
   └──────────────────┘    └──────────────────┘
```

### 3.3 Estratégia de Dados no MVP

Estratégia híbrida: dados reais via API oficial + Supabase como banco curado.

| Dado | Fonte | Onde mora |
|---|---|---|
| Eixos temáticos | Curado pelo time | Supabase (fixo) |
| Glossário (30 termos) | Curado pelo time | Supabase (fixo) |
| Conteúdos cidadãos (descrições simples) | Curado pelo time | Supabase (fixo) |
| Despesas, contratos, servidores | API oficial do Portal MA | Cache curto no Supabase (1h TTL) |
| Termos mais buscados (dashboard busca) | Planilha do hackathon + telemetria | Supabase (fixo + atualização) |
| Embeddings para RAG | Gerado on-demand | Supabase pgvector |
| Cache de respostas IA | Edge Function | Supabase (TTL 24h) |
| Logs de perguntas anônimos | Edge Function | Supabase (TTL 7 dias, sem PII) |

**Vantagens dessa abordagem:**
- Dados reais e funcionais durante a demo (não mock)
- Resiliente: se a API oficial cair, o cache do Supabase mantém o portal vivo
- Economiza chamadas à Claude API (cache semântico)
- Pronta para escalar: Fase 1 do roadmap apenas substitui a fonte da API oficial pelo SIAFEM direto

### 3.4 Componente AjudaInteligente (UX)

```
┌──────────────────────────────────────────┐
│ Cidadão na página de Busca               │
│  ┌────────────────────────────────────┐  │
│  │ 🔍 [merenda escolar Imperatriz]    │  │
│  │ Resultados: 24 itens               │  │
│  └────────────────────────────────────┘  │
│                                          │
│  Após 10 segundos:                       │
│                                          │
│              ┌──────────────────────┐    │
│              │ 💡 Posso te ajudar?  │ ← toast discreto
│              │ Vejo 24 resultados.  │    │
│              │ [Sim, ajude] [Fechar]│    │
│              └──────────────────────┘    │
└──────────────────────────────────────────┘
              ↓ (cidadão clica)
┌──────────────────────────────────────────┐
│ Cidadão na página de Busca               │
│  Conteúdo principal              ┌─────┐ │
│                                  │ AJU-│ │
│                                  │ DA  │ │
│                                  │ INT.│ │
│                                  │     │ │
│                                  │ chat│ │
│                                  │ side│ │
│                                  │     │ │
│                                  │     │ │
│                                  └─────┘ │
└──────────────────────────────────────────┘
              drawer lateral à direita
```

**Triggers do toast (definir em `data/ai-triggers.ts`):**

```typescript
const TRIGGERS = {
  SEARCH: {
    manyResults: { threshold: 20, delayMs: 5000 },
    zeroResults: { delayMs: 0 },
    longComplexQuery: { wordsMin: 4, delayMs: 3000 },
    timeOnPage: { ms: 10000 },
  },
  EXPLORER: {
    timeOnCard: { ms: 15000 },
    explicitClick: { delayMs: 0 },
  },
  GLOSSARY: {
    afterTooltip: { delayMs: 2000 },
  },
}
```

**Telemetria:**
- Eventos: `ai_toast_shown`, `ai_drawer_opened`, `ai_question_asked`, `ai_response_helpful`, `ai_drawer_closed`
- Campos: trigger_type, page_context, response_time_ms, tokens_used, helpful_rating
- Sem PII, agregação por dia
- Painel de saúde acompanha conversion rate de toasts

### 3.5 Schema Inicial do Supabase (MVP)

```sql
-- Eixos temáticos
CREATE TABLE eixos (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  descricao_cidada TEXT,
  icone TEXT,
  ordem INTEGER DEFAULT 0,
  destaque BOOLEAN DEFAULT FALSE
);

-- Glossário
CREATE TABLE glossario (
  id SERIAL PRIMARY KEY,
  termo TEXT UNIQUE NOT NULL,
  termo_normalizado TEXT NOT NULL,
  explicacao_cidada TEXT NOT NULL,
  exemplo TEXT,
  embedding VECTOR(1024)
);

-- Termos mais buscados (alimentação inicial via planilha + telemetria)
CREATE TABLE termos_buscados (
  id SERIAL PRIMARY KEY,
  termo TEXT NOT NULL,
  termo_normalizado TEXT NOT NULL,
  total_buscas INTEGER DEFAULT 0,
  ultima_busca TIMESTAMPTZ DEFAULT NOW(),
  bloqueado BOOLEAN DEFAULT FALSE,  -- termos sensíveis (CPF, etc.)
  motivo_bloqueio TEXT
);

-- Cache de respostas IA
CREATE TABLE ia_cache (
  id SERIAL PRIMARY KEY,
  pergunta_hash TEXT UNIQUE NOT NULL,
  pergunta_embedding VECTOR(1024),
  resposta JSONB NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL
);

-- Logs anônimos (TTL 7 dias)
CREATE TABLE ia_logs (
  id SERIAL PRIMARY KEY,
  pergunta_hash TEXT NOT NULL,
  trigger_type TEXT,
  helpful BOOLEAN,
  tokens_used INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conteúdos cidadãos (descrições em linguagem simples por eixo)
CREATE TABLE conteudos_cidadaos (
  id SERIAL PRIMARY KEY,
  eixo_id INTEGER REFERENCES eixos(id),
  topico TEXT NOT NULL,
  texto TEXT NOT NULL,
  embedding VECTOR(1024),
  fonte_oficial_url TEXT
);

-- Cache de chamadas à API oficial
CREATE TABLE api_cache (
  id SERIAL PRIMARY KEY,
  endpoint TEXT NOT NULL,
  params_hash TEXT NOT NULL,
  response JSONB NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  UNIQUE (endpoint, params_hash)
);

CREATE INDEX idx_termos_norm ON termos_buscados(termo_normalizado);
CREATE INDEX idx_glossario_norm ON glossario(termo_normalizado);
CREATE INDEX idx_ia_cache_expires ON ia_cache(expires_at);
CREATE INDEX idx_api_cache_expires ON api_cache(expires_at);
```

**RLS (Row Level Security):**
- Tabelas de leitura pública (eixos, glossário, termos_buscados, conteudos_cidadaos): SELECT permitido para anônimos
- Tabelas de escrita (ia_cache, ia_logs, api_cache): apenas via Edge Function (service_role)
- Anon key não consegue escrever em nenhuma tabela

### 3.6 Edge Function `/ask` (núcleo da AjudaInteligente)

```typescript
// supabase/functions/ask/index.ts (esqueleto)
import { Anthropic } from "npm:@anthropic-ai/sdk"
import { createClient } from "npm:@supabase/supabase-js"

Deno.serve(async (req) => {
  // 1. Sanitização
  const { question, context } = await req.json()
  if (containsSensitiveData(question)) return forbidden()

  // 2. Rate limiting (por IP, no Supabase)
  if (await isRateLimited(req)) return tooManyRequests()

  // 3. Cache semântico (similar question?)
  const cached = await findCachedResponse(question)
  if (cached) return ok(cached)

  // 4. RAG - busca conteúdo relevante
  const embedding = await embed(question)
  const docs = await searchSimilarDocs(embedding, 5)

  // 5. Function calling - mapear para query estruturada se aplicável
  const intent = await classifyIntent(question, anthropic)

  // 6. Executa query estruturada (Supabase + API oficial)
  const data = await fetchStructuredData(intent)

  // 7. Geração da resposta cidadã com citações
  const response = await generateCitizenResponse({
    question, context, docs, data
  }, anthropic)

  // 8. Cacheia e loga (anônimo)
  await cacheResponse(question, response)
  await logAnonymous(question, intent, response.tokens)

  return ok(response)
})
```

### 3.7 Lista de Bloqueio de Buscas Sensíveis

A planilha de buscas mostrou que o portal atual permite buscar por CPF (126 buscas para um CPF específico). O Portal da Transparência bloqueia:

```typescript
const BLOCKED_PATTERNS = [
  /\d{11}/,                      // CPF (11 dígitos)
  /\d{3}\.\d{3}\.\d{3}-\d{2}/,   // CPF formatado
  /\d{14}/,                      // CNPJ (14 dígitos)
  /\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/, // CNPJ formatado (apenas se isolado)
  /\d{7,9}/,                     // RG aproximado
]
```

Termos bloqueados retornam mensagem genérica: *"Por proteção de dados pessoais (LGPD), não realizamos buscas por CPF, RG ou documentos. Tente buscar pelo nome completo ou cargo."*

---

## 4. Stack Detalhada

### Frontend (MVP e Produção)

```
Core:
├── React 18 + TypeScript
├── Vite (MVP) ou Next.js 14 App Router (Produção)
├── Tailwind CSS                       → Mobile-first
├── shadcn/ui + Radix                  → Componentes base
└── lucide-react                       → Ícones

Visualização:
├── Recharts                           → Gráficos
├── react-simple-maps                  → Mapa do MA
└── @vercel/og                         → Geração de cards Compartilhar Zap

Acessibilidade:
├── react-aria                         → Componentes acessíveis
├── ARIA labels nativas
└── Focus visible + skip-links

PWA:
├── vite-plugin-pwa (MVP) / next-pwa (Produção)
└── Workbox para cache strategies

IA:
└── @anthropic-ai/sdk
```

### Backend (Produção apenas)

```
API:
├── Node.js 20 + TypeScript
├── Fastify ou Hono                    → Framework leve
├── Drizzle ORM ou pg                  → Acesso ao banco
├── Zod                                → Validação de schemas
└── Pino                                → Logs estruturados

Banco:
├── PostgreSQL 16
├── Schemas versionados (migrations)
├── Triggers de auditoria
└── pgaudit para logs de acesso

Cache e Filas:
├── Redis                              → Cache quente
└── BullMQ ou pg-boss                  → Filas de ingestão

Auth (admin):
└── Supabase Auth com SSO institucional

Observabilidade:
├── OpenTelemetry
├── Grafana ou Datadog
└── Sentry para erros do frontend
```

---

## 5. Estrutura de Pastas (Frontend)

```
hackaton/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Header/             → Cabeçalho com IA, busca, acessibilidade
│   │   │   │   ├── Footer/
│   │   │   │   └── BottomNav/          → Navegação fixa mobile
│   │   │   ├── eixos/
│   │   │   │   ├── EixoGrid/           → Grid de eixos temáticos na home
│   │   │   │   └── EixoCard/
│   │   │   ├── dashboard/
│   │   │   │   ├── ResumoCards/        → Cards de resumo
│   │   │   │   ├── GraficoBarra/
│   │   │   │   ├── GraficoPizza/
│   │   │   │   ├── SerieHistorica/
│   │   │   │   └── ListaContratos/
│   │   │   ├── ia/
│   │   │   │   ├── AssistenteBar/      → Barra fixa do Assistente IA
│   │   │   │   └── RespostaCidada/     → Render da resposta da IA
│   │   │   ├── mapa/
│   │   │   │   ├── MapaMaranhao/
│   │   │   │   └── PainelMunicipio/
│   │   │   ├── glossario/
│   │   │   │   ├── TermoTooltip/
│   │   │   │   └── DetectorTermos/
│   │   │   ├── compartilhar/
│   │   │   │   └── BotaoZap/           → Geração de imagem para WhatsApp
│   │   │   └── acessibilidade/
│   │   │       ├── ToggleContraste/
│   │   │       ├── ControleFonte/
│   │   │       └── ModoSimples/
│   │   ├── pages/ (ou app/)
│   │   │   ├── index.tsx               → Home
│   │   │   ├── eixo/[slug].tsx         → Página do eixo
│   │   │   ├── municipio/[id].tsx      → Página do município
│   │   │   └── pergunta/[id].tsx       → Resposta detalhada da IA
│   │   ├── services/
│   │   │   ├── api.ts                  → Cliente da API (ou mock loader)
│   │   │   ├── ia.ts                   → Cliente do Assistente IA
│   │   │   └── compartilhar.ts         → Geração de imagem
│   │   ├── data/
│   │   │   ├── glossario.json
│   │   │   ├── eixos.json              → Estrutura dos eixos temáticos
│   │   │   └── mock/                   → Datasets do MVP
│   │   ├── hooks/
│   │   │   ├── useGlossario.ts
│   │   │   ├── useAssistente.ts
│   │   │   └── useCompartilhar.ts
│   │   ├── styles/
│   │   │   ├── tokens.css              → Design tokens (cores, tipografia)
│   │   │   └── globals.css
│   │   └── utils/
│   │       ├── formatters.ts           → Moeda, data, percentual em pt-BR
│   │       ├── slugify.ts
│   │       └── analytics.ts            → Eventos de uso (sem PII)
│   └── public/
│       ├── icons/                      → Ícones dos eixos (SVG)
│       ├── geojson/maranhao.json
│       └── manifest.json               → PWA manifest
└── design/
    └── prototipos/                     → Figma exports
```

---

## 6. Modelo de Dados

### 6.1 Entidades Principais (Produção)

| Tabela | Função |
|---|---|
| `eixos` | Eixos temáticos (Saúde, Educação, etc.) |
| `categorias_oficiais` | Mapeamento das 115 categorias do portal antigo |
| `eixo_categoria` | Tabela N:M entre eixos cidadãos e categorias oficiais |
| `orgaos` | Órgãos publicadores (SES, SEDUC, etc.) |
| `municipios` | 217 municípios do MA |
| `programas` | Programas sociais e suas regras de participação |
| `escolas`, `hospitais`, `obras` | Entidades concretas com geo, status, fotos |
| `despesas` | Despesas consolidadas por dia, órgão, categoria, município |
| `contratos`, `licitacoes` | Detalhamento jurídico-financeiro |
| `fornecedores` | CNPJs cadastrados |
| `pagamentos` | Empenho, liquidação, pagamento por nota |
| `glossario` | Termos técnicos com explicação cidadã |
| `conteudos_cidadaos` | Textos de descrição em linguagem simples (curados pela STC) |
| `usuarios_admin` | Usuários do painel administrativo |
| `auditoria` | Log imutável de operações administrativas |

### 6.2 Princípios de Modelagem

- **Append-only para auditoria:** mudanças são versionadas, não sobrescritas
- **Tenant lógico:** cada órgão tem domínio próprio, mas dados são públicos por natureza
- **Geocodificação:** todo dado relevante tem município, latitude e longitude quando possível
- **Internacionalização preparada:** mesmo que MVP seja só pt-BR, schema permite traduções

---

## 7. APIs e Fontes Oficiais

### 🔵 Prioridade 1 - API REST do Portal da Transparência MA

```
Base URL: https://www.transparencia.ma.gov.br
Autenticação: Nenhuma (API pública)
Formato: JSON
```

| Endpoint | Descrição |
|---|---|
| `GET /api/consulta-despesas` | Despesas por órgão e categoria |
| `GET /api/consulta-notas` | Detalhamento das notas de empenho |
| `GET /api/consulta-unidades` | Lista de unidades gestoras |

### 🟢 Prioridade 2 - Portal de Dados Abertos do MA

```
URL: https://dados.ma.gov.br
Autenticação: Nenhuma
Formato: CSV e JSON
```

Datasets:
- LOA (2012 a 2026)
- Finanças públicas globais do Poder Executivo

### 🟡 Prioridade 3 - Sistemas Oficiais (Produção)

- **SIAFEM** - Sistema Integrado de Administração Financeira (despesas, empenhos)
- **SIPRO** - Sistema de Protocolo (licitações, contratos)
- **Sistemas das secretarias** - Educação (vagas, matrículas), Saúde (atendimentos, escalas)

### 🔴 Fallback - JSONs Mock (apenas MVP)

Garante que a demo do hackathon funciona offline ou com API instável.

---

## 8. Mapeamento Eixos -> Categorias

| Eixo Cidadão | Categorias / Órgãos da Base Oficial |
|---|---|
| 🏥 Saúde e Bem-Estar | Secretaria de Saúde, SUS, programas, hospitais, farmácia popular |
| 📚 Educação e Futuro | SEDUC, merenda, transporte escolar, bolsas, IEMA |
| 🛡️ Segurança Pública | SSP, Polícia Civil, Polícia Militar, Corpo de Bombeiros, Defesa Civil |
| 🏘️ Habitação e Cidade | SEDES, programas habitacionais, regularização fundiária |
| 🤝 Programas Sociais | SEINC, Maranhão Livre da Fome, benefícios, transferência de renda |
| 🛣️ Obras e Infraestrutura | SINFRA, DER-MA, obras viárias, saneamento |
| 👥 Gestão Pública | Folha de pagamento, concursos, organograma, fornecedores, licitações |

> **Tarefa do analista de dados:** validar este mapeamento contra a estrutura real da API e ajustar o JSON `data/eixos.json`.

---

## 9. Compliance, Segurança e Auditoria

### 9.1 Conformidade Legal

| Norma | Cobertura |
|---|---|
| Lei de Acesso à Informação (LAI - 12.527/2011) | Todos os dados obrigatórios continuam acessíveis e exportáveis |
| Lei de Transparência (LC 131/2009) | Receitas e despesas em tempo real (D+1 mínimo) |
| LGPD (13.709/2018) | Sem dados pessoais expostos. PII anonimizada quando necessária |
| e-MAG (Modelo de Acessibilidade em Governo Eletrônico) | Conformidade nível AA |
| WCAG 2.1 | Conformidade nível AA |
| Decreto 10.540/2020 (SIAFIC) | Padrão de controle interno preservado |
| Selo Diamante TCE | Manter ou superar 98,5/100 |

### 9.2 Segurança Aplicada

> Aderente aos 8 Princípios de Segurança por Design do CLAUDE.md global.

- **Defesa em profundidade:** validação no frontend, revalidação no backend, constraints no banco
- **Sem confiança no frontend:** toda regra de negócio enforced no backend
- **Mensagens genéricas:** anti-enumeração em fluxos administrativos
- **Criptografia forte:** Argon2id para senhas admin, TLS 1.3 obrigatório
- **Rate limiting:** em todos os endpoints públicos e admin
- **Uploads do admin:** validação tripla (extensão, MIME, magic bytes), renomeação UUID
- **Operações atômicas:** publicações usam transações com lock
- **Whitelist de URLs externas:** somente domínios oficiais para imagens de obras

### 9.3 Auditoria

- Log imutável de toda operação no admin (quem, quando, o quê, hash antes/depois)
- Exportação periódica para storage frio (S3 Glacier ou equivalente)
- Painel de auditoria acessível a STC e órgãos de controle
- Retenção mínima conforme exigência da TCE-MA

### 9.4 Privacidade

- Sem cookies de terceiros
- Sem trackers comerciais
- Analytics próprio, sem PII (Plausible self-hosted ou similar)
- Logs de IA não armazenam pergunta vinculada a IP por padrão

---

## 10. Performance e Escalabilidade

| Frente | Estratégia |
|---|---|
| **TTI no celular** | Server Components, streaming, code splitting agressivo |
| **3G e 4G** | Bundle inicial < 100KB gzip, imagens em AVIF/WebP, lazy loading |
| **Picos (matérias na imprensa)** | ISR + Edge cache global (Vercel) + Redis no backend |
| **Mapa pesado** | Tile-based rendering, simplificação por zoom level |
| **IA** | Cache semântico de perguntas similares, batching de chamadas |
| **PWA offline** | Cache das últimas 10 páginas visitadas + glossário completo |
| **Múltiplas regiões** | CDN global com origem em São Paulo |

Meta de Lighthouse:
- Performance: 90+ no celular
- Acessibilidade: 100
- Best Practices: 95+
- SEO: 100

---

## 11. Roadmap Técnico de Substituição

| Fase | Prazo | Marco Técnico |
|---|---|---|
| **Fase 0 - MVP Hackathon** | 48h | Protótipo Vercel, 2-3 eixos, IA básica |
| **Fase 1 - Piloto STC** | 1 mês | Refino UX, integração com 1 sistema oficial (SIAFEM via export), 6 eixos |
| **Fase 2 - Backend e Admin** | +3 meses | API própria, ingestão CDC, painel admin com perfis |
| **Fase 3 - Cobertura Plena** | +6 meses | 115 categorias migradas, IA com RAG estrito, auditoria completa |
| **Fase 4 - Coexistência** | +3 meses | Portal antigo redireciona para o novo, comunicação aos cidadãos |
| **Fase 5 - Substituição Completa** | +1 mês | Portal da Transparência como portal oficial único, antigo arquivado |

**Ponto crítico de transição:** durante Fases 4 e 5, ambos os portais coexistem com URLs preservadas. URLs antigas redirecionam para os equivalentes no novo. Lighthouse e auditoria automatizada rodam diariamente comparando os dois.

---

## 12. Decisões Técnicas

| Decisão | Escolha | Justificativa |
|---|---|---|
| Framework Frontend (MVP) | React + Vite | Velocidade de setup em 48h |
| Framework Frontend (Produção) | Next.js 14 App Router | SSR, ISR, Edge Functions, SEO |
| CSS | Tailwind + shadcn/ui | Mobile-first nativo, produtividade |
| Gráficos | Recharts | Acessível, responsivo, leve |
| Mapa | react-simple-maps | GeoJSON do MA, leve |
| Geração de cards | @vercel/og | Edge runtime, PNG fora do navegador |
| Backend (Produção) | Node.js + Fastify | Time familiar, ecossistema, baixa latência |
| Banco | PostgreSQL | Padrão setor público, robusto, auditoria nativa |
| Cache | Redis | Latência baixa, padrão de mercado |
| Auth (admin) | Supabase Auth | Pronto, com SSO se necessário |
| Deploy MVP | Vercel | Zero config, CDN global, Edge Functions |
| Deploy Produção | Vercel + servidor próprio do Estado para banco | Frontend escala, dados ficam no Estado |
| LLM | Claude (Anthropic) | Qualidade em pt-BR, citações, baixa alucinação com RAG |

### Decisões em Aberto (precisam de definição)

- [ ] Domínio definitivo (manter `transparencia.ma.gov.br` ou novo)
- [ ] Hospedagem do banco em produção (interno do Estado vs. Supabase Cloud)
- [ ] LLM final (Claude vs. modelo aberto self-hosted)
- [ ] Estratégia de SSO institucional para órgãos

---
Criado por André Lopes
Desenvolvedor Fullstack
