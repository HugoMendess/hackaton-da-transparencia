# 📄 MEMORIAL DESCRITIVO - Portal da Transparência

**Hackathon da Transparência Maranhense 2026**
Equipe: André Lopes, Alexandre Oliveira, Alexsander Oliveira
Data: 26 de abril de 2026
Repositório: https://github.com/agenciadigitalslz/Portal da Transparência

---

## 1. Identificação do Problema

O Portal da Transparência do Maranhão é tecnicamente sólido e legalmente exemplar: 320 mil usuários por ano, 4 milhões de visualizações, Selo Diamante por dois anos consecutivos, score de 98,5/100 e o site mais acessado do Governo do Maranhão.

No entanto, **56% dos acessos vêm de dispositivos móveis** e o portal não foi construído para essa realidade. O cidadão mobile fica em média 155 segundos no site, **menos da metade do tempo do desktop (325 segundos)**. A UX expulsa quem chega pelo celular.

Mais grave: a análise dos dados de uso real (Google Analytics 2024 a 2026 cedidos pela STC durante o hackathon) mostra que **72% das visualizações estão concentradas nas páginas de Remuneração e Ficha Financeira** (3,68 milhões só em 2024). O portal é usado como ferramenta de fiscalização da máquina pública, mas a UX não está pensada para esse uso.

A análise da planilha de termos buscados (232.782 buscas brutas, 895.741 acumuladas) confirma: o cidadão maranhense busca por "Remuneração", "Folha de pagamento", "Servidores", "Contratos", nomes de pessoas e empresas. Não busca por "saúde" ou "educação" abstratos. **O uso real é fiscalizatório**.

E mesmo nesse uso, a barreira é real: termos como *empenho* e *dotação orçamentária* funcionam como muros, a busca avançada cresceu 1.144% em um ano (sinal de que o cidadão está usando mais, mas levou 116 segundos em média para encontrar o que queria - quase 2 minutos sofrendo com a interface). Quando ele desiste, a transparência deixa de existir na prática.

A própria STC reconheceu o ponto, citado na apresentação oficial do desafio: *"A informação existe, o direito existe, mas a experiência pode afastar o cidadão antes dele chegar lá."* E completa: *"O nosso compromisso é um pouco menos com o legal e mais com a sociedade."*

A linha histórica oficial do portal (extraída das apresentações cedidas pela STC) já anunciava esse passo:

| Ano | Foco oficial |
|---|---|
| 2010 | Cumprimento da criação do portal (LRF + LAI) |
| 2015 | Compliance integral, desenvolvimento rápido |
| 2017 | Interface amigável, primeira aproximação da linguagem cidadã |
| 2021 | Inovação, acesso com menos clicks, multi-plataforma |
| 2022 | Estratégia de Linguagem Simples, atalho "Mais Buscados", "Medir-Analisar-Ajustar" |
| 2023 | Novo Portal (parceria SEATRAN + LabiGov) |
| **2026** | **Usabilidade total, com o cidadão no centro (este hackathon)** |

O Portal da Transparência é a materialização desse passo, na continuidade técnica do que a STC vinha planejando desde 2021.

---

## 2. A Proposta - Portal da Transparência como Substituto Oficial

O **Portal da Transparência** é a proposta de **substituição do atual Portal da Transparência do Maranhão**. Não é uma camada complementar sobre o portal existente. É o **novo portal**, redesenhado do zero a partir do cidadão maranhense.

A escolha por substituir, em vez de complementar, é deliberada. Adicionar uma camada de UX por cima do portal atual resolveria a aparência mas não o problema estrutural: a arquitetura de informação herdada da lógica contábil do Estado. O Portal da Transparência reconstrói essa arquitetura a partir dos eixos de vida do cidadão, com **Gestão Pública priorizada** porque é onde o uso real está concentrado.

A STC continua como gestora oficial. Os órgãos continuam como publicadores. Os dados continuam oficiais. O que muda é a experiência, a arquitetura interna e o motor que conecta o cidadão ao dado.

**Importante:** o Portal da Transparência **não substitui a Juçara**, o chatbot de atendimento usado em vários portais do governo. A Juçara continua atendendo dúvidas gerais. O Portal da Transparência traz algo que a Juçara não tem: acesso real ao banco de dados, embutido nos pontos onde o cidadão precisa.

---

## 3. Processo de Ideação

A partir da análise do desafio proposto pela STC, identificamos três verbos centrais que estruturam a dor:

1. **Encontrar** - o cidadão não encontra o que procura
2. **Entender** - mesmo quando encontra, não entende
3. **Usar** - mesmo entendendo, não consegue aplicar no cotidiano

A apresentação oficial do hackathon definiu um framework de 4 etapas (Slide 6) que o Portal da Transparência cobre integralmente:

| # | Etapa Oficial | Como o Portal da Transparência cobre |
|---|---|---|
| 1 | **Descobrir** | Personas reais (Joana, Ana, Maria, Carlos), uso analisado pelos dados |
| 2 | **Navegar** | Eixos de vida, AjudaInteligente, busca em linguagem natural |
| 3 | **Compreender** | Glossário Vivo, narrativa contextual, cards de resumo |
| 4 | **Compartilhar & Controlar** | Compartilhar Zap, telemetria, métricas de evolução |

A resposta certa não foi escolher uma única direção, foi compor todas em um único produto.

---

## 4. A Solução

### 4.1 Princípios de Design

| Princípio | O que significa na prática |
|---|---|
| Regra dos 3 Passos | Qualquer informação acessível em até 3 interações |
| Mobile First | Construído para celular, expandido para desktop |
| Zero Jargão no Caminho | Nenhum termo técnico no fluxo principal de navegação |
| Contexto Sempre | Todo dado vem com narrativa que o explica |
| Ajuda Discreta | A IA aparece quando faz sentido, não interrompe |
| Compartilhamento Nativo | Toda informação pode virar imagem para WhatsApp |
| Acessibilidade Não-Negociável | WCAG 2.1 AA e e-MAG desde o primeiro pixel |

### 4.2 Componentes Principais

**Eixos Temáticos (substituem os menus contábeis).** Sete eixos organizam o portal pela vida do cidadão. Diferente do que parece intuitivo, **Gestão Pública (servidores, salários, fornecedores, contratos) está no topo** porque concentra 72% do uso real do portal atual. Os demais eixos (Saúde, Educação, Programas Sociais, Obras, Habitação, Segurança) representam o uso aspiracional que a STC quer ampliar.

**AjudaInteligente.** A IA do Portal da Transparência não tem persona explícita. É uma camada inteligente embutida na jornada, que aparece como toast discreto ("Posso ajudar?") quando o cidadão precisa, abre como drawer lateral à direita (padrão Alura) e fecha facilmente. Tem acesso real ao banco de dados, coisa que a Juçara não tem hoje. Aparece em dois entry points:
- **Busca avançada:** quando a busca retorna muitos resultados, zero, ou é complexa
- **Explorer dos dashboards:** ícone 💡 nos cards e gráficos, sugestão proativa após 15 segundos

**Dashboard inicial nas páginas de busca.** Resolve o problema das páginas de busca atuais que não trazem nada visual. Primeira dobra com termos mais buscados em tempo real (extraídos dos dados reais cedidos pela STC), métricas em destaque e atualizações recentes. A apresentação da STC de 2022 já mencionava essa direção ("Mais Buscados").

**Glossário Vivo.** Detector automático de termos técnicos no conteúdo. Ao toque ou hover, exibe explicação em linguagem simples e exemplo prático. Botão "Quer saber mais?" abre o drawer da AjudaInteligente.

**Cards de Resumo.** Cada eixo abre com cards visuais que comunicam o essencial em 3 segundos. Números grandes, ícones, comparativos e narrativa.

**Mapa do Maranhão.** Mapa interativo dos 217 municípios coloridos por indicadores de gasto. O cidadão clica no município dele e vê os números do lugar onde mora.

**Compartilhar Zap.** Botão que gera imagem (não PDF) pronta para WhatsApp e redes sociais. Substitui a exportação tradicional, fomenta controle social orgânico.

**Camada de Acessibilidade Persistente.** Alto contraste, controle de fonte, modo simplificado, leitor de tela com narrativa otimizada.

**Painel Admin (Fase 2 do roadmap).** Para órgãos publicadores e equipe da STC, com perfis, auditoria imutável e workflow opcional de aprovação.

---

## 5. Critérios de Avaliação Oficiais

A banca pontua (Slide 13 do desafio):

| Critério | Peso | Como o Portal da Transparência atende |
|---|---|---|
| **Usabilidade** | 30% | 3 toques, mobile-first, AjudaInteligente, dashboard de busca |
| **Acessibilidade** | 25% | WCAG 2.1 AA, e-MAG, glossário, alto contraste, leitor de tela |
| **Clareza da Informação** | 20% | Linguagem cidadã, cards de resumo, narrativa contextual |
| **Viabilidade Técnica** | 15% | Stack pronta (React + Vite + Supabase), arquitetura modular |
| **Impacto e Inovação** | 10% | AjudaInteligente com acesso ao banco, dashboard de busca |

55% da pontuação está em Usabilidade + Acessibilidade. O foco do produto está nesses dois critérios. Inovação (onde a IA mora) vale 10%, mas é onde a demo impressiona.

---

## 6. Perguntas-Âncora Oficiais

A entrega exige resposta a pelo menos 1 das 4 perguntas oficiais (Slide 10). O Portal da Transparência responde as 4:

| Pergunta-âncora | Como respondemos |
|---|---|
| *"Quanto o governo gastou com saúde esse ano?"* | Eixo Saúde, card de resumo, AjudaInteligente detalha |
| *"As obras de educação estão sendo executadas?"* | Eixo Educação, lista de obras com status, mapa |
| *"Quanto custa a folha de servidores por mês?"* | Eixo Gestão Pública, card "Folha do mês", AjudaInteligente compara |
| *"Quais contratos estão ativos no meu município?"* | Mapa, município, lista de contratos vigentes |

---

## 7. Personas Atendidas

O Portal da Transparência serve 5 personas concretas (detalhe em PERSONAS.md):

1. **Joana** (fornecedora) e **Ana** (jornalista) - representam o **uso dominante atual** (fiscalização)
2. **Dona Maria** (vulnerabilidade) e **Carlos** (família) - representam o **uso aspiracional** (programas sociais, educação)
3. **STC e órgãos publicadores** - persona institucional, foco da Fase 2 do roadmap

Cada decisão de produto serve a pelo menos uma das 5.

---

## 8. Dados Utilizados

| Fonte | Tipo | Uso |
|---|---|---|
| API Portal Transparência MA | REST/JSON público | Despesas, contratos, servidores em tempo real |
| Planilha Termos Buscados (cedida pela STC) | XLSX | Top termos para o dashboard de busca |
| Planilha Analytics GA4 2024-2026 | XLSX | Comportamento real para validação de UX |
| Apresentações históricas da STC | PPTX | Continuidade histórica e linguagem oficial |
| Portal de Dados Abertos MA | CSV/JSON | LOA e finanças públicas |
| GeoJSON do Maranhão (IBGE) | GeoJSON | Mapa dos 217 municípios |
| Supabase (Postgres + pgvector) | DB próprio | Eixos curados, glossário, cache, embeddings |

Todos os dados são públicos e oficiais. O Portal da Transparência não cria, modifica ou armazena dados, apenas os apresenta de forma acessível e cita a fonte oficial.

---

## 9. Tecnologias Utilizadas

### MVP do Hackathon

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Framework | React 18 + Vite + TypeScript | Velocidade de setup |
| Estilização | Tailwind CSS | Mobile-first nativo |
| Componentes | shadcn/ui + Radix | Acessibilidade pronta |
| Gráficos | Recharts | Acessível e responsivo |
| Mapa | react-simple-maps | GeoJSON do MA, leve |
| Banco | Supabase Postgres | Pronto, seguro, escalável |
| RAG | pgvector | Vetorização de glossário e conteúdos |
| IA | Claude API via Edge Function | Qualidade em pt-BR, chave protegida |
| Geração de cards | @vercel/og | Edge runtime, PNG real |
| PWA | vite-plugin-pwa | Cache offline |
| Deploy | Vercel | CDN global |

### Produção (Pós-Hackathon)

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 14 App Router (SSR + ISR + Edge) |
| Backend | Node.js + Fastify + PostgreSQL |
| Cache | Redis |
| Filas | BullMQ ou pg-boss |
| Auth admin | Supabase Auth com SSO institucional |
| Observabilidade | OpenTelemetry + Grafana + Sentry |

---

## 10. Compliance e Conformidade

| Norma | Cobertura no Portal da Transparência |
|---|---|
| Lei de Acesso à Informação (12.527/2011) | Todos os dados obrigatórios continuam acessíveis |
| Lei de Transparência (LC 131/2009) | Receitas e despesas com atualização mínima D+1 |
| LGPD (13.709/2018) | Sem PII exposta, **buscas por CPF/RG bloqueadas** (vulnerabilidade detectada na planilha cedida) |
| e-MAG | Conformidade nível AA |
| WCAG 2.1 | Conformidade nível AA |
| Decreto 10.540/2020 (SIAFIC) | Padrão de controle interno preservado |
| Selo Diamante TCE-MA | Manter ou superar 98,5/100 |

**Achado de segurança importante:** a análise da planilha de buscas mostrou que o portal atual permite que cidadãos busquem por CPF (um CPF específico foi buscado 126 vezes). O Portal da Transparência bloqueia buscas por dados pessoais sensíveis por padrão.

---

## 11. Roadmap de Substituição

| Fase | Prazo | Marco |
|---|---|---|
| Fase 0 - MVP Hackathon | 48h | Protótipo público com 2 a 3 eixos, AjudaInteligente, dashboard de busca |
| Fase 1 - Piloto STC | 1 mês | Refino UX, integração com 1 sistema oficial |
| Fase 2 - Backend e Admin | +3 meses | API própria, ingestão CDC, painel admin |
| Fase 3 - Cobertura Plena | +6 meses | 115 categorias migradas, IA com RAG |
| Fase 4 - Coexistência | +3 meses | Portal antigo redireciona, comunicação ao cidadão, Juçara integrada |
| Fase 5 - Substituição Completa | +1 mês | Portal da Transparência como portal único oficial |

Total estimado: 12 a 14 meses do MVP até substituição completa. Durante a coexistência (Fase 4), URLs do portal antigo redirecionam para os equivalentes no novo, e auditoria automatizada compara os dois portais diariamente.

---

## 12. Impacto Esperado

- **Curto prazo:** redução imediata da barreira para os 320 mil usuários anuais. Tempo médio mobile sai dos 155 segundos atuais para próximo dos 325 segundos do desktop.
- **Médio prazo:** aumento mensurável do engajamento mobile e do compartilhamento social dos dados. Conversão da busca avançada (que cresceu 1.144% em 2025) em respostas efetivas via AjudaInteligente.
- **Longo prazo:** referência nacional de portal de transparência, modelo replicável para outros estados e municípios.

KPIs de sucesso:
- Tempo médio para encontrar uma informação: máximo 3 toques
- Taxa de abandono no celular: redução de 50% vs. portal atual
- Score Lighthouse: 90+ em performance, 100 em acessibilidade
- Score Selo Diamante: 100/100
- Perguntas respondidas pela AjudaInteligente sem fallback humano: 80%+
- Conversion rate do toast da AjudaInteligente: 30% (cidadão aceita ajuda quando oferecida)

---

## 13. Próximos Passos Pós-Hackathon

1. Reunião com a STC para validação da proposta e início do piloto (Fase 1)
2. Cessão de credenciais para integração com sistemas oficiais (SIAFEM, SIPRO)
3. Definição de domínio definitivo (manter `transparencia.ma.gov.br` ou novo)
4. Estruturação jurídica do contrato de manutenção e SLA
5. Plano de comunicação para a transição (Fase 4) e integração com a Juçara
6. Internacionalização futura (acessibilidade para migrantes)

---

## 14. Equipe

| Nome | Perfil |
|---|---|
| **André Lopes** | Desenvolvedor Fullstack, Analista de Sistemas e Data Science |
| **Alexandre Oliveira** | Dev Backend, Especialista em IA e Análise de Dados |
| **Alexsander Oliveira** | Dev Backend e Analista de Sistemas |

---

## 15. Repositório e Demo

- **Repositório:** https://github.com/agenciadigitalslz/Portal da Transparência
- **Demo online:** [a publicar no Vercel]
- **QR Code:** [inserir antes da apresentação]

---
Criado por André Lopes
Desenvolvedor Fullstack
