<div align="center">

![Hackathon da Transparência - Equipe 4](frontend/public/images/01.png)

# Portal da Transparência do Maranhão

**A próxima geração do portal, redesenhada para o cidadão.
Mobile-first, busca em linguagem natural com IA, em até 3 toques.**

[![Deploy Status](https://api.netlify.com/api/v1/badges/db16b83a-5082-404e-8b9c-57aaadf4468c/deploy-status)](https://app.netlify.com/projects/portaltransparencia/deploys)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ECF8E?style=flat&logo=supabase&logoColor=white)
![Netlify](https://img.shields.io/badge/Deploy-Netlify-00C7B7?style=flat&logo=netlify&logoColor=white)
### [Acessar Demo](https://portaltransparencia.netlify.app)

</div>

---

## Sobre o Projeto

Projeto da **Equipe 4** desenvolvido no **Hackathon da Transparência Maranhense 2026**, organizado por STC, SECTI, EGMA e FAPEMA, em São Luís - MA, entre 24 e 26 de abril.

O **Portal da Transparência** é a proposta de **substituição do atual portal**, mantendo o Selo Diamante e os 320 mil usuários anuais, mas redesenhado a partir do dado real de uso, sem a barreira do burocratiquês e funcionando de verdade no celular.

> *"O nosso compromisso é um pouco menos com o legal e mais com a sociedade."*
> Secretaria da Transparência e Controle do MA, abertura do Hackathon 2026.

---

## A Dor que o Projeto Resolve

| Indicador real (Analytics oficiais cedidos pela STC) | Realidade |
|---|---|
| Usuários únicos por ano | ~320.000 |
| Visualizações por ano | ~4.000.000 |
| Acesso via celular | **56%** |
| Tempo médio mobile | 155 segundos |
| Tempo médio desktop | 325 segundos |
| **72% das visualizações** | concentradas em **Remuneração + Ficha Financeira** |
| Crescimento da busca avançada (2024 a 2025) | **+1.144%** (de 16K para 205K acessos) |
| CPF buscado na busca avançada | **126 vezes** (vetor LGPD ativo) |

**Tradução:** o cidadão maranhense usa o portal para fiscalizar a máquina pública, mas a UX o expulsa antes dele encontrar o que veio buscar. O dado existe, o acesso a ele, não.

---

## A Solução em 4 Pilares

<table>
<tr>
<td width="50%">

### Dados Priorizados

72% do uso real está em folha de servidor e contratos. Gestão Pública entra no topo da home. Páginas de busca abrem com termos mais buscados em tempo real, métricas-chave e atualizações recentes.

</td>
<td width="50%">

### IA com Acesso ao Banco

A AjudaInteligente é uma IA com acesso real ao banco de dados (coisa que a Juçara não tem). RAG estrito sobre os dados oficiais via pgvector, cita fonte em toda resposta, CPF bloqueado por padrão.

</td>
</tr>
<tr>
<td width="50%">

### Mapa Interativo

Mapa do Maranhão com os 217 municípios coloridos por indicadores. Cidadão toca onde mora e vê os contratos ativos, obras em andamento e quanto a cidade dele recebeu.

</td>
<td width="50%">

### Glossário Vivo + 3 Toques

Termo técnico clicável vira explicação cidadã sem tirar do fluxo. Regra dos 3 toques em toda jornada. WCAG 2.1 AA e e-MAG nativos. Compartilhar Zap em todo dado.

</td>
</tr>
</table>

---

## Linha Histórica do Portal

A proposta não é ruptura, é a continuidade técnica do que a STC vinha planejando desde 2010:

| Ano | Foco oficial |
|---|---|
| 2010 | Cumprimento da criação do portal (LRF + LAI) |
| 2015 | Compliance integral, desenvolvimento rápido |
| 2017 | Interface amigável, primeira aproximação da linguagem cidadã |
| 2021 | Inovação na apresentação, acesso com menos clicks, multi-plataforma |
| 2022 | Estratégia de Linguagem Simples, atalho "Mais Buscados" |
| 2023 | Novo Portal (parceria SEATRAN + LabiGov) |
| **2026** | **Usabilidade total, com o cidadão no centro (este hackathon)** |

---

## Componentes Principais

### Eixos Temáticos da Vida do Cidadão

Sete eixos no lugar dos menus contábeis: **Gestão Pública** (priorizado), Saúde, Educação, Programas Sociais, Obras, Habitação e Segurança.

### Dashboard Inicial nas Páginas de Busca

Substitui a tela vazia do portal atual. Primeira dobra com termos mais buscados em tempo real, métricas em destaque e atualizações recentes.

### AjudaInteligente

Toast discreto "Posso ajudar?" aparece quando faz sentido (busca complexa, muitos resultados, zero resultados, hover prolongado). Drawer lateral com gráfico, citação da fonte oficial e link para o dado bruto.

### Mapa do MA

217 municípios clicáveis com indicadores comparados à média estadual. Painel local com contratos ativos, obras e gastos.

### Glossário Vivo

Detector automático de termos técnicos no conteúdo. Toque, e o termo vira explicação em linguagem simples sem tirar o cidadão do fluxo.

### Compartilhar Zap

Botão presente em todo dado relevante. Gera imagem PNG pronta para WhatsApp, Twitter e Instagram, com a marca do portal e a fonte oficial.

### Camada de Acessibilidade Persistente

Alto contraste, controle de fonte, modo simplificado, leitor de tela. WCAG 2.1 AA e e-MAG nativos.

---

## Stack Tecnológica

| Camada | Tecnologia | Por quê |
|---|---|---|
| Framework | React 19 + Vite + TypeScript | Setup rápido, bundle leve |
| Estilização | Tailwind CSS 3 + shadcn/ui + Radix | Mobile-first nativo, acessível por padrão |
| Roteamento | react-router-dom 7 | SPA com rotas amigáveis |
| Banco | Supabase (Postgres + pgvector) | Pronto, seguro, escalável, RAG nativo |
| Mapa | Leaflet + react-leaflet | GeoJSON do MA, leve, customizável |
| Gráficos | Recharts | Acessível e responsivo |
| IA | Claude (Anthropic) via Edge Function | Qualidade em pt-BR, chave protegida |
| Compartilhar | html2canvas-pro + jspdf | PNG e PDF gerados client-side |
| Deploy | Netlify | CDN global, build com cache, redirect SPA |

---

## Critérios da Banca e Como Cada Um é Atacado

| Critério | Peso | Como o projeto atende |
|---|---|---|
| **Usabilidade** | 30% | Regra dos 3 toques, mobile-first, AjudaInteligente, dashboard inicial na busca |
| **Acessibilidade** | 25% | WCAG 2.1 AA + e-MAG, Glossário Vivo, alto contraste, leitor de tela, modo simplificado |
| **Clareza da Informação** | 20% | Linguagem cidadã, cards de resumo, narrativa por seção, gráficos contextualizados |
| **Viabilidade Técnica** | 15% | Stack pronta para produção, arquitetura modular, deploy ativo, banco curado |
| **Impacto e Inovação** | 10% | IA com acesso ao banco real, dashboard de busca, mapa por município |

> Usabilidade + Acessibilidade somam 55% do peso. O foco do produto é nesses dois critérios.

---

## Estrutura do Repositório

```
hackaton-da-transparencia/
├── README.md                  ← este arquivo
├── netlify.toml               ← config de deploy (base, publish, redirect SPA)
│
├── frontend/                  ← aplicação React + Vite
│   ├── src/
│   │   ├── components/        ← layout, home, dashboard, mapa, ia, ui
│   │   ├── pages/             ← Busca, Detalhe, Eixo, Mapa, Cargos, Servidor, Sobre
│   │   ├── hooks/             ← acessibilidade, busca, ia
│   │   ├── lib/               ← supabase, gerarPDFEixo, utils
│   │   ├── data/              ← datasets curados dos eixos
│   │   ├── services/          ← integrações
│   │   ├── types/             ← tipagem (database, domínio)
│   │   └── styles/
│   └── public/                ← assets estáticos (favicon, imagens, geojson)
│
└── supabase/                  ← migrations e edge functions
```

---

## Como Rodar Localmente

### Requisitos

- Node.js 18 ou superior
- NPM

### Passos

```bash
# Clonar
git clone https://github.com/agenciadigitalslz/hackaton-da-transparencia.git
cd hackaton-da-transparencia/frontend

# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev
# Acesse http://localhost:5173
```

### Build de produção

```bash
npm run build       # gera frontend/dist
npm run preview     # serve localmente o build
```

---

## Equipe

| Nome | Papel |
|---|---|
| **André Lopes** | Desenvolvedor Fullstack, Analista de Sistemas e Data Science |
| **Alexandre Oliveira** | Dev Backend, Especialista em IA e Análise de Dados |
| **Alexsander Oliveira** | Dev Backend e Analista de Sistemas |

---

## Agradecimentos

Aos organizadores do Hackathon da Transparência Maranhense 2026:

- **STC - Secretaria da Transparência e Controle do Estado do Maranhão**
- **SECTI - Secretaria de Estado da Ciência, Tecnologia e Inovação**
- **EGMA - Escola de Governo do Maranhão**
- **FAPEMA - Fundação de Amparo à Pesquisa e ao Desenvolvimento Científico e Tecnológico do Maranhão**

E às equipes históricas do portal (2021 e 2023), citadas em `DADOS_REAIS.md`, que abriram o caminho que esta proposta tenta concluir.

---

## Premiação Oficial

| Posição | Valor (FAPEMA) |
|---|---|
| 1º lugar | R$ 6.000 |
| 2º lugar | R$ 3.000 |
| 3º lugar | R$ 1.800 |

---

<div align="center">

**Hackathon da Transparência Maranhense 2026** · 24 a 26 de abril · São Luís, MA

[Demo](https://portaltransparencia.netlify.app) · [Repositório](https://github.com/agenciadigitalslz/hackaton-da-transparencia)

</div>

---
Criado por André Lopes
Desenvolvedor Fullstack
