# ⏱️ PLANO DE EXECUÇÃO - 48h do Hackathon

> **Hoje é 25/04/2026.** Estamos no **dia 2 de 3** do hackathon. O dia 1 (24/04) foi de planejamento e definição estratégica. A documentação base está concluída e o posicionamento (Portal da Transparência como substituto oficial) está fechado. Materiais cedidos pela STC durante o hackathon (apresentações + planilhas de uso real) foram absorvidos em DADOS_REAIS.md. A partir de agora, o foco é desenvolvimento e demo.

**Repositório:** https://github.com/agenciadigitalslz/Portal da Transparência

---

## Time

| Pessoa | Perfil | Foco principal |
|---|---|---|
| **André Lopes** | Desenvolvedor Fullstack, Analista de Sistemas e Data Science | Frontend, integração, coordenação geral |
| **Alexandre Oliveira** | Dev Backend, Especialista em IA e Análise de Dados | AjudaInteligente, RAG, salvaguardas LGPD, telemetria |
| **Alexsander Oliveira** | Dev Backend e Analista de Sistemas | Supabase, ingestão de dados, schemas, pgvector |

---

## Visão Geral

| Dia | Período | Foco | Meta |
|---|---|---|---|
| 24/04 (concluído) | Dia inteiro | Setup + análise + documentação base | Documentação reformulada + materiais STC absorvidos |
| 25/04 (hoje) | Dia inteiro | Desenvolvimento intenso | MVP funcional rodando com 2 eixos completos + AjudaInteligente |
| 26/04 | Manhã | Refinamento + IA + Deploy | Produto no ar + pitch ensaiado |
| 26/04 | Tarde | Pitch (3 min) | 🏆 |

---

## 24/04 - Dia 1 (CONCLUÍDO)

- [x] Participação na abertura institucional (EGMA)
- [x] Análise do desafio oficial e transcrição do áudio
- [x] Definição da solução (Portal da Transparência como substituto)
- [x] Documentação base completa (README, CONTEXTO, SOLUCAO, PERSONAS, ARQUITETURA, PITCH, MEMORIAL, ANALISE_COMPLETA)
- [x] Curadoria do glossário inicial (30 termos)
- [x] Mapeamento de eixos -> categorias da API oficial
- [x] Repositório criado em https://github.com/agenciadigitalslz/Portal da Transparência

---

## 25/04 - Dia 2 (HOJE) - Desenvolvimento

### Pré-requisitos antes de começar a codar

- [ ] André prepara `.env` com tokens (Supabase, Anthropic, Vercel)
- [ ] Alexsander valida acesso à API do Portal MA e endpoints disponíveis
- [ ] Alexandre define system prompt da AjudaInteligente e lista de bloqueio (CPF, RG)

### Manhã (até 12h) - Fundação Técnica

| Quem | O que fazer |
|---|---|
| **André** | Iniciar projeto: `npm create vite@latest portal-transparencia -- --template react-ts`. Configurar Tailwind, shadcn/ui, estrutura de pastas conforme ARQUITETURA.md. Conectar repositório GitHub |
| **Alexsander** | Setup Supabase: criar projeto, aplicar schema (eixos, glossario, termos_buscados, ia_cache, conteudos_cidadaos). Importar termos da planilha cedida (top 100). RLS configurada |
| **Alexandre** | Setup Edge Function `/ask`: esqueleto, sanitização, rate limiting, lista de bloqueio LGPD. Configuração da chave da Anthropic |

### Tarde (13h às 18h) - Componentes Centrais

| Quem | O que fazer |
|---|---|
| **André** | Tela Home: grid de 7 eixos com Gestão Pública em destaque, header, BottomNav mobile. Página de busca com dashboard inicial (top termos buscados, métricas, novidades) |
| **Alexsander** | Integração frontend com Supabase: hooks `useEixos`, `useTermosBuscados`, `useGlossario`. Cache de chamadas à API oficial |
| **Alexandre** | Componente `AjudaInteligente`: drawer lateral, toast discreto, hook `useTriggers` com a lógica dos triggers (busca, explorer). System prompt com contexto |

### Noite (19h às 22h) - Fluxos End-to-End

| Quem | O que fazer |
|---|---|
| **André** | Página de Eixo (Educação completa): cards + gráficos + integração com glossário e AjudaInteligente |
| **Alexsander** | Embeddings do glossário e dos conteúdos cidadãos via pgvector. Função RAG `searchSimilarDocs` |
| **Alexandre** | Function calling do Claude: classificação de intenção, geração de resposta cidadã com fontes. Cache semântico de respostas |
| **Todos juntos (1h)** | Integração: cidadão faz busca -> toast aparece -> drawer abre -> IA responde com dado real do banco. Validar end-to-end |

**Meta do dia 2:** Home + Eixo Educação + Eixo Gestão Pública + Página de Busca com dashboard + AjudaInteligente respondendo perguntas-âncora oficiais. Tudo rodando local em mobile real.

---

## 26/04 - Dia 3 - Entrega

### Madrugada/Manhã (até 09h) - Fechamento Técnico

- [ ] **André:** Mapa do MA com 1 indicador (gastos por município) + Compartilhar Zap (geração de imagem)
- [ ] **Alexsander:** Cache da API oficial estabilizado, validação de dados em tempo real
- [ ] **Alexandre:** Telemetria da AjudaInteligente (eventos, conversion rate dos toasts), modo de alto contraste
- [ ] **Todos:** Lighthouse e teste em celular real

### 09h às 10h - Deploy e Validação

- [ ] Push final no repositório
- [ ] `vercel --prod`
- [ ] Configurar variáveis de ambiente no Vercel
- [ ] Testar URL pública em 3 celulares diferentes
- [ ] Gerar QR code da URL e imprimir/salvar no celular
- [ ] Lighthouse: validar Performance, Acessibilidade

### 10h às 11h - Material de Apresentação

- [ ] Memorial descritivo: revisão final e exportação para PDF
- [ ] Slides de apoio: 3 slides (problema, solução, impacto)
- [ ] Demo coreografada: cada toque cronometrado
- [ ] Designar quem fala cada bloco do pitch
- [ ] Backup: vídeo gravado da demo + Figma aberto

### 11h às 12h - Ensaio

- [ ] Ensaiar pitch 5x cronometrando
- [ ] Ajustar onde passar de 3 min
- [ ] Treinar respostas às perguntas esperadas dos juízes (ver PITCH.md)

### Tarde - Pitch e Premiação 🏆

---

## Divisão de Responsabilidades por Especialidade

| Domínio | Responsável Principal | Backup |
|---|---|---|
| Frontend (React, Tailwind, shadcn) | André | Alexsander |
| Backend (Supabase, schemas, RLS) | Alexsander | Alexandre |
| IA (Claude, RAG, Edge Function) | Alexandre | André |
| Segurança (LGPD, anti-injection, rate limit) | Alexandre | André |
| Análise de dados (planilhas, métricas) | Alexandre | Alexsander |
| Integração (frontend + backend + IA) | André (lead) | Todos |
| Demo e pitch | Todos (definir falas no dia 3) | - |
| Memorial descritivo | André | Alexandre |

---

## Prioridades (MoSCoW Atualizada com base nos critérios da banca)

> **Banca pontua:** Usabilidade 30% + Acessibilidade 25% + Clareza 20% + Viabilidade 15% + Inovação 10%. Ordem das prioridades segue isso.

### Must Have - sem isso o MVP não existe
- [x] Documentação base como substituto oficial
- [ ] Tela inicial com 7 eixos (Gestão Pública em destaque) - **Usabilidade**
- [ ] Dashboard completo de Educação + Gestão Pública - **Clareza**
- [ ] Página de busca com dashboard inicial (termos top, métricas) - **Clareza + Inovação**
- [ ] Glossário Vivo em pelo menos 10 termos - **Acessibilidade**
- [ ] AjudaInteligente com toast + drawer respondendo as 4 perguntas-âncora - **Inovação + Usabilidade**
- [ ] Interface mobile-first responsiva - **Usabilidade**
- [ ] Bloqueio de busca por CPF/RG (LGPD) - **Viabilidade**
- [ ] Deploy online funcionando - **Viabilidade**
- [ ] Memorial descritivo entregue (PDF) - **Viabilidade**

### Should Have - fortalece a proposta
- [ ] AjudaInteligente também no Explorer (botão 💡 nos cards) - **Inovação**
- [ ] Modo de alto contraste - **Acessibilidade**
- [ ] Botão Compartilhar Zap - **Inovação**
- [ ] Mapa do Maranhão com 1 indicador - **Clareza**
- [ ] Telemetria da AjudaInteligente (eventos, conversion) - **Viabilidade**
- [ ] Dashboard de mais 1 eixo - **Clareza**

### Could Have - diferencial competitivo
- [ ] AjudaInteligente aberto (qualquer pergunta sobre o dataset)
- [ ] Série histórica comparativa
- [ ] Detalhamento de contratos por município
- [ ] Modo navegação simplificada
- [ ] PWA básica (instalável)
- [ ] Lighthouse 95+ em performance

### Won't Have - fora do escopo do hackathon
- [ ] Backend customizado (usaremos Supabase)
- [ ] Painel administrativo para órgãos (Fase 2 do roadmap)
- [ ] Cobertura das 115 categorias
- [ ] Integração real-time com SIAFEM/SIPRO

---

## Riscos e Plano B

| Risco | Probabilidade | Plano B |
|---|---|---|
| API do portal indisponível | Alta | Cache no Supabase mantém o portal vivo |
| Internet instável no evento | Média | Build local funciona com cache do Supabase |
| Claude API falhar | Média | AjudaInteligente cai para "perguntas pré-definidas" com respostas fixas no Supabase |
| Falta de tempo | Alta | Cortar para 1 eixo (Gestão Pública) com profundidade total |
| Bug crítico antes do pitch | Média | Vídeo gravado da demo |
| Deploy com problema | Baixa | Demonstração local (notebook conectado ao projetor) |
| Geração de imagem (Compartilhar Zap) falhar | Média | Mostrar a interface, dizer que está em refino |
| Embeddings demorarem demais para gerar | Média | Pré-computar antes do dia 3 |
| Time travar em decisão técnica | Média | André é tech lead, decide e segue |

---

## Checklist Final (30 min antes do pitch)

- [ ] URL do deploy funcionando no celular conectado ao projetor
- [ ] QR code gerado, salvo no celular e impresso
- [ ] Memorial descritivo em PDF (entregar via formulário oficial)
- [ ] Slides abertos
- [ ] Protótipo aberto e pronto para demo
- [ ] Pitch ensaiado e cronometrado (≤3 minutos)
- [ ] Quem fala cada bloco definido
- [ ] Backup: Figma aberto, vídeo da demo no celular
- [ ] Testar áudio do projetor (se houver)
- [ ] Cabo HDMI/adaptador no bolso
- [ ] As 4 perguntas-âncora oficiais memorizadas

---

## Critérios de Avaliação (Foco dos Juízes)

A banca avalia (Slide 13 do desafio oficial):

| Critério | Peso | Foco do Portal da Transparência |
|---|---|---|
| Usabilidade | 30% | 3 toques, mobile-first, AjudaInteligente, dashboard busca |
| Acessibilidade | 25% | WCAG 2.1 AA, glossário, contraste, leitor de tela |
| Clareza da Informação | 20% | Cards, gráficos, narrativa, perguntas-âncora respondidas |
| Viabilidade Técnica | 15% | Stack pronta, arquitetura modular, deploy real |
| Impacto e Inovação | 10% | AjudaInteligente com banco real, dashboard busca, Compartilhar Zap |

> *"A banca não premia o mais bonito. Premia quem funcionou melhor pra quem mais precisa."* (STC, apresentação oficial)

---
Criado por André Lopes
Desenvolvedor Fullstack
