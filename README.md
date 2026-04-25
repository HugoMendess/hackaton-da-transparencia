# 🏛️ TransparaMA

> **O futuro Portal da Transparência do Maranhão. Construído para o cidadão, do celular para o desktop, sem jargão e em até 3 passos.**

Projeto desenvolvido no **Hackathon da Transparência Maranhense 2026**
organizado por STC + SECTI + EGMA + FAPEMA | 24 a 26 de abril | São Luís, MA

**Repositório:** https://github.com/agenciadigitalslz/TransparaMA

---

## A Proposta

O **TransparaMA** é a proposta de **substituição do atual Portal da Transparência do Maranhão**. Não é uma camada sobre o portal existente, é a próxima geração do portal, redesenhada do zero a partir de quem ele deve servir: o cidadão maranhense.

A linha histórica oficial do portal já apontava para esse caminho:

| Ano | Foco |
|---|---|
| 2010 | Cumprir a obrigação legal (LRF + LAI) |
| 2015 | Compliance integral, desenvolvimento rápido |
| 2017 | Interface amigável, primeira aproximação da linguagem cidadã |
| 2021 | Inovação na apresentação, acesso com menos clicks, multi-plataforma |
| 2022 | Estratégia de Linguagem Simples + atalho "Mais Buscados" |
| 2023 | Novo Portal (parceria SEATRAN + LabiGov) |
| **2026** | **Usabilidade total, o cidadão no centro** |

O TransparaMA é o passo de 2026 entregue como produto, na continuidade técnica do que a STC vinha construindo desde 2021.

---

## A Dor que o TransparaMA Resolve

| Indicador | Realidade (dado oficial) |
|---|---|
| Usuários únicos por ano | ~320.000 |
| Visualizações por ano | ~4.000.000 |
| Acesso via celular | **56%** |
| Tempo médio de engajamento mobile | 155 segundos |
| Tempo médio de engajamento desktop | 325 segundos |
| Tipos de informação | 115 categorias |
| **72% das visualizações** | Páginas de **Remuneração** e **Ficha Financeira** |
| Crescimento da busca avançada (2024-2025) | **+1.144%** (16K -> 205K views) |

**O cidadão usa o portal massivamente para fiscalizar a máquina pública** (salários, fornecedores, contratos). Mas a UX expulsa quem chega pelo celular: 56% acessa por mobile e fica menos da metade do tempo de desktop.

---

## A Solução em Uma Frase

**Um portal de transparência mobile-first, com busca em linguagem natural, ajuda inteligente contextual com acesso ao banco de dados real, glossário vivo e visualizações que respondem perguntas reais do cidadão, em até 3 passos.**

---

## As 4 Frentes do Desafio Oficial

| Frente | Como o TransparaMA responde | Peso na banca |
|---|---|---|
| 🧭 Navegação | Eixos de vida (Saúde, Educação, Gestão Pública, etc.), regra dos 3 passos, sem jargão no caminho | 30% (Usabilidade) |
| 📱 Mobile First | Interface touch-friendly, PWA, jornadas curtas, otimizado para celular | 30% (Usabilidade) |
| ♿ Acessibilidade | WCAG 2.1 AA + e-MAG, leitor de tela, alto contraste, navegação por teclado | 25% |
| 📊 Visualização | Cards de resumo, gráficos contextualizados, narrativa por seção, dashboard inicial em páginas de busca | 20% (Clareza) |

> Critérios da banca somam: Usabilidade 30% + Acessibilidade 25% + Clareza 20% + Viabilidade Técnica 15% + Impacto e Inovação 10%.

---

## Diferenciais Centrais

1. **AjudaInteligente.** Painel lateral estilo Alura que aparece de forma inteligente quando o cidadão precisa: ao tentar uma busca complexa, ao explorar um dashboard, ao clicar em um termo. Toast discreto "Posso ajudar?". Acesso real ao banco de dados, coisa que a Juçara não tem hoje.

2. **Dashboard inicial em páginas de busca.** Primeira dobra com termos mais buscados em tempo real (Remuneração, Folha de pagamento, Contratos), métricas em destaque, novidades. Substitui a lista vazia atual da busca avançada.

3. **Glossário Vivo** que detecta termos técnicos no conteúdo e os explica em linguagem simples ao toque, sem tirar o cidadão do fluxo.

4. **Eixos de vida temáticos** com **Gestão Pública promovido** ao topo (porque é onde 72% do uso real acontece). No lugar de menus contábeis, jornadas que respondem perguntas como *"quanto custa a folha de servidores?"*.

5. **Mapa do MA por município** com indicadores de gasto comparados à média estadual.

6. **Compatibilidade total com a Juçara.** A Juçara existe e funciona como atendente virtual em vários portais do governo. O TransparaMA não substitui a Juçara, complementa: traz acesso ao banco de dados real onde a Juçara não tem.

---

## Time

| Nome | Perfil |
|------|--------|
| **André Lopes** | Dev Fullstack & Tech Lead |
| **Alexandre** | Especialista em IA, Cibersegurança e Análise de Dados |
| **Alexsander** | Dev Backend e Data Science |

---

## Stack Tecnológica

| Camada | Produto Final | MVP do Hackathon |
|---|---|---|
| Frontend | React 18 + Vite + Tailwind + shadcn/ui | Mesma stack |
| Banco | PostgreSQL com versionamento | Supabase (Postgres + Auth + Edge Functions) |
| IA | Claude API via Edge Function | Claude API via Edge Function (Supabase) |
| RAG | pgvector | pgvector |
| Visualização | Recharts + react-simple-maps | Mesma stack |
| PWA | Service Worker, cache offline | Configuração básica |
| Deploy | Vercel + região Brasil | Vercel |

---

## Entregáveis do Hackathon

| Entregável | Status |
|---|---|
| Protótipo funcional online | A executar |
| Memorial descritivo (PDF) | Em revisão final |
| Pitch de 3 minutos | A ensaiar |
| Comparativo Atual vs TransparaMA | Em construção |
| Roadmap de transição | Documentado em ARQUITETURA.md |

---

## Estrutura do Repositório

```
TransparaMA/
├── README.md                  ← este arquivo
├── CONTEXTO.md                ← problema e diagnóstico do portal atual
├── SOLUCAO.md                 ← especificação completa do TransparaMA
├── PERSONAS.md                ← personas e jornadas de valor
├── ARQUITETURA.md             ← arquitetura de produto + arquitetura do MVP
├── PITCH.md                   ← roteiro dos 3 minutos
├── PLANO_EXECUCAO.md          ← cronograma das 48h
├── MEMORIAL.md                ← memorial descritivo (entregável oficial)
├── GLOSSARIO.md               ← glossário de termos técnicos
├── ANALISE_COMPLETA.md        ← análise estratégica do desafio
├── DADOS_REAIS.md             ← consolidador de dados oficiais (planilhas e apresentações)
└── frontend/                  ← código (a iniciar)
```

---

## Premiação (via FAPEMA)

🥇 1º lugar R$ 6.000 | 🥈 2º lugar R$ 3.000 | 🥉 3º lugar R$ 1.800

---
Criado por André Lopes
Desenvolvedor Fullstack
