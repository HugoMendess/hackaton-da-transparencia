# PITCH - TransparaMA

> **Tempo total: 3 minutos** (180 segundos exatos, definido pela organização do hackathon).
> O protótipo deve estar aberto na TELA 1 antes da equipe subir no palco.
> A banca avalia: Usabilidade 30%, Acessibilidade 25%, Clareza 20%, Viabilidade 15%, Inovação 10%.

---

## Mapa Visual de Tempo

| Tempo | Bloco | Suporte visual |
|---|---|---|
| 00:00 - 00:30 | 1. Problema (dados que abrem os olhos) | **SLIDE 1** - 3 dados na tela |
| 00:30 - 00:45 | 2. Solução (o que é o TransparaMA) | **SLIDE 2** - capa do produto |
| 00:45 - 01:00 | 3. De/Para (antes vs depois) | **SLIDE 3** - tabela visual |
| 01:00 - 02:30 | 4. DEMO ao vivo (90s) | **TELAS 1 a 4** do protótipo |
| 02:30 - 02:50 | 5. Diferenciais + Próximos Passos | **SLIDE 4** - 4 selos |
| 02:50 - 03:00 | 6. FINAL + Slogan | **SLIDE 5** - QR code |

---

## Bloco 1 - Problema (00:00 - 00:30) | SLIDE 1

**[SLIDE 1]** Tela com 3 cards grandes em destaque:
- `56%` mobile, fica 155s (vs 325s no desktop)
- `72%` da atenção em Remuneração + Ficha Financeira
- `+1.144%` de uso da busca em 1 ano

**Texto falado (30 segundos):**

> "320 mil cidadãos por ano, 4 milhões de visualizações, Selo Diamante por dois anos seguidos. No papel, o Portal da Transparência do Maranhão é referência nacional."

> "Mas três dados do uso real mudam a conversa: 56% acessa pelo celular e fica metade do tempo de quem usa desktop. 72% de toda a atenção do portal está concentrada em duas páginas, Remuneração e Ficha Financeira. E a busca cresceu 1.144% em um ano, sem que a busca evoluísse junto."

> "Os dados existem. O acesso a eles, não."

---

## Bloco 2 - Solução (00:30 - 00:45) | SLIDE 2

**[SLIDE 2]** Logo TransparaMA + tagline:

> *"A próxima geração do Portal da Transparência do Maranhão."*

**Texto falado (15 segundos):**

> "Apresentamos o TransparaMA. Não é uma camada sobre o portal atual. É a próxima geração do portal, redesenhada a partir do dado real de uso, sem perder o Selo Diamante."

---

## Bloco 3 - De/Para (00:45 - 01:00) | SLIDE 3

**[SLIDE 3]** Tabela visual lado a lado, ANTES (esquerda, em cinza) e DEPOIS (direita, em verde-MA):

| Antes | Depois |
|---|---|
| Lógica contábil | Eixos da vida do cidadão |
| 5 a 10 cliques | 3 toques |
| Tabela bruta | Cards, gráficos e narrativa |
| Busca por termo exato | Busca em linguagem natural com IA |
| Tela vazia até clicar | Dashboard com dados em tempo real |
| Termo técnico isolado | Glossário vivo |

**Texto falado (15 segundos):**

> "O que muda é a forma como o cidadão chega no dado: linguagem dele, jornada curta, busca que entende pergunta, e o dado vivo já na primeira dobra. Vou mostrar."

---

## Bloco 4 - DEMO ao vivo (01:00 - 02:30) | 90s, 4 telas

> Antes do palco: deixar o protótipo aberto na **TELA 1** (Home), no celular real conectado ao projetor.

### TELA 1 - HOME (01:00 - 01:15) | 15 segundos

> Componentes: `Hero` + `MetricasDestaque` + `EixoGrid` (em `App.tsx`).

**Mostrar:**
- Hero com busca em destaque
- Métricas em destaque (R$ X bi gastos, Y mil servidores, Z mil contratos)
- Grid de eixos com **Gestão Pública em primeiro**, porque é onde mora 72% do uso real

**Texto falado (15 segundos):**

> "Tela inicial. Já vê os números do estado e os eixos da vida do cidadão, com Gestão Pública em destaque, é onde mora 72% do uso real. Vamos atacar uma das perguntas-âncora da banca: 'quanto custa a folha de servidores por mês?'"

> Tocar na barra de busca, digitar a pergunta.

---

### TELA 2 - BUSCA + IA (01:15 - 01:45) | 30 segundos

> Página: `pages/Busca.tsx`.

**Mostrar em sequência:**
1. Dashboard inicial da busca: termos mais buscados em tempo real, métricas, atualizações recentes (primeira dobra)
2. Resultados aparecem
3. Toast discreto: "Posso ajudar?"
4. Drawer lateral abre, IA responde com gráfico + citação da fonte oficial

**Texto falado (30 segundos):**

> "Olha o que o portal atual não faz: a página de busca abre com dado vivo. Termos mais buscados, métricas-chave, últimas atualizações, antes do cidadão digitar qualquer coisa."

> "Resultados. Pergunta complexa, então aparece o toast 'Posso ajudar?'. Cidadão clica."

> "Drawer lateral abre. A AjudaInteligente, nossa IA, tem acesso real ao banco de dados, coisa que a Juçara não tem. Responde, mostra o gráfico, cita a fonte oficial. RAG estrito sobre os dados públicos, zero invenção, CPF bloqueado por LGPD."

> Apontar para um termo técnico no resultado, tipo "dotação orçamentária".

---

### TELA 3 - MAPA INTERATIVO (01:45 - 02:10) | 25 segundos

> Página: `pages/Mapa.tsx`.

**Mostrar:**
1. Mapa do MA com 217 municípios coloridos por indicador
2. Tocar num município
3. Painel local: quanto recebeu, contratos ativos, obras em andamento
4. Botão "Compartilhar Zap"

**Texto falado (25 segundos):**

> "Outra pergunta-âncora: 'quais contratos estão ativos no meu município?'. Volta na home, abre o mapa."

> "Mapa do Maranhão, 217 municípios coloridos pelos dados de execução. Cidadão toca onde mora."

> "Vê quanto a cidade dele recebeu, quais obras estão andando, quais contratos estão ativos. Quer mandar pros vizinhos no zap? Um toque, imagem pronta."

---

### TELA 4 - DETALHE + GLOSSÁRIO (02:10 - 02:30) | 20 segundos

> Página: `pages/Detalhe.tsx` (ou `pages/Eixo.tsx` se mais visual).

**Mostrar:**
1. Detalhe de um contrato ou despesa
2. Termo técnico sublinhado, tocar, Glossário Vivo abre explicação cidadã
3. Camada de acessibilidade visível (alto contraste / aumento de fonte)

**Texto falado (20 segundos):**

> "Em qualquer dado, o termo técnico é clicável. Empenho, dotação, subelemento, cidadão toca, glossário explica em linguagem dele. Acessibilidade WCAG AA nativa, alto contraste, leitor de tela. Tudo isso em 3 toques. Em 30 segundos."

---

## Bloco 5 - Diferenciais + Próximos Passos (02:30 - 02:50) | SLIDE 4

**[SLIDE 4]** 4 selos grandes na tela:
- **DADOS** - 72% do uso real priorizado, dashboard vivo na busca
- **IA** - acesso ao banco, RAG estrito, fonte citada, LGPD por padrão
- **MAPA** - 217 municípios, contratos e obras georreferenciados
- **ROADMAP** - 5 fases, Selo Diamante mantido, 115 categorias cobertas em 12 meses

**Texto falado (20 segundos):**

> "O que vocês viram: dados que o cidadão busca priorizados, IA com acesso real ao banco e LGPD nativo, mapa interativo dos 217 municípios. Tudo mobile-first."

> "Roadmap em 5 fases pós-piloto: refino com a STC, backend próprio, cobertura das 115 categorias, coexistência com o portal atual e substituição. Selo Diamante mantido. Juçara continua atendendo. STC continua gestora."

---

## Bloco 6 - FINAL + Slogan (02:50 - 03:00) | SLIDE 5

**[SLIDE 5]** Logo grande + slogan + QR code + URL pública.

**Texto falado (10 segundos):**

> "**TransparaMA. O dado finalmente fala a língua de quem precisa dele.**"

> Mostrar o QR e a URL.

---

## Checklist Pré-Palco

- [ ] Protótipo aberto na TELA 1 antes de subir
- [ ] Celular real conectado ao projetor (reforça 56% acessa por mobile)
- [ ] Wifi/4G testado, fallback offline com print das telas no SLIDE 4 caso caia
- [ ] 5 slides preparados (1 Problema, 2 Capa, 3 De/Para, 4 Diferenciais, 5 Final)
- [ ] Banca pontua Usabilidade 30% + Acessibilidade 25% + Clareza 20% = 75% nas telas, ensaiar 4x
- [ ] Cronômetro no chão, target 2:55 para deixar margem
- [ ] Demo das 2 perguntas-âncora (folha de servidores + contratos do município) é obrigatória
- [ ] Não apologizar pelo MVP, é prova de viabilidade, não o produto final
- [ ] Banca pontua Inovação só 10%, então a IA é cereja, não o bolo. Foco em utilidade.

---

## Telas que Precisam Estar Prontas para a Demo

| Tela | Arquivo | Estado mínimo para o palco |
|---|---|---|
| **Home** | `App.tsx` (Hero + MetricasDestaque + EixoGrid) | Métricas reais, Gestão Pública no topo do grid |
| **Busca** | `pages/Busca.tsx` | Dashboard inicial + toast IA + drawer com gráfico e citação |
| **Mapa** | `pages/Mapa.tsx` | 217 municípios clicáveis + painel local + Compartilhar Zap |
| **Detalhe** | `pages/Detalhe.tsx` | Glossário Vivo em pelo menos 5 termos + alto contraste |

---

## Perguntas Esperadas dos Juízes

### "Vocês estão propondo substituir o portal atual?"

> Sim. O TransparaMA é a próxima geração do portal, não uma camada sobre o atual. A linha histórica oficial já apontava para isso: 2010 cumpriu a lei, 2017 trouxe linguagem cidadã, 2022 trouxe Linguagem Simples e o atalho 'Mais Buscados', 2023 redesenhou. 2026 é o ano da usabilidade total. Estamos entregando esse passo como produto.

### "Como vocês fariam a transição de forma segura?"

> Em 5 fases, totalizando aproximadamente 12 a 14 meses pós-piloto: refino com a STC, backend e painel admin, cobertura das 115 categorias, coexistência com o portal antigo (com redirecionamentos preservando todas as URLs públicas) e finalmente substituição. Auditoria automatizada compara os dois portais diariamente durante a coexistência.

### "O Selo Diamante é mantido?"

> Sim, e o objetivo é elevar para 100. Toda categoria obrigatória do portal atual entra no roadmap. O TransparaMA não reduz compliance, ele soma utilidade ao compliance.

### "E a Juçara, como fica?"

> A Juçara continua existindo e funcionando como atendente virtual em vários portais do governo. O TransparaMA não substitui a Juçara, complementa: ela responde dúvidas gerais, o TransparaMA traz acesso ao banco de dados real e ajuda inteligente embutida na jornada. São produtos diferentes que coexistem.

### "Como vocês obtiveram os dados?"

> Para o MVP, usamos dados reais via API pública do Portal MA, planilhas oficiais cedidas pela STC durante o hackathon e Supabase como banco curado. Em produção, ingestão direta dos sistemas oficiais (SIAFEM, SIPRO).

### "E se a IA der uma resposta errada?"

> A AjudaInteligente usa RAG estrito sobre os dados oficiais via pgvector. Não inventa. Toda resposta tem citação da fonte. Perguntas fora do dataset recebem fallback honesto. Logs anônimos (sem PII) ajudam a evoluir a base. Buscas por CPF, RG e dados sensíveis são bloqueadas por LGPD.

### "Pode escalar para outros estados?"

> Sim. A arquitetura é modular: o motor cidadão (eixos temáticos, glossário, AjudaInteligente, Compartilhar Zap) é independente da fonte de dados. Adaptar para outro estado significa apontar a camada de ingestão para os sistemas dele.

### "Como o portal lida com órgãos publicadores?"

> Painel admin com perfis: STC (admin global), órgão (admin do próprio domínio), auditor (somente leitura). Toda operação é registrada em log imutável. Workflow opcional de dois pares para dados críticos. Está em ARQUITETURA.md, é parte da Fase 2 do roadmap.

### "E acessibilidade?"

> WCAG 2.1 AA e e-MAG nativos desde o primeiro pixel. Alto contraste, controle de fonte, modo simplificado, leitor de tela. Acessibilidade vale 25% da pontuação da banca, é prioridade no nosso desenvolvimento.

### "Por que não usar a Juçara como interface da IA?"

> A Juçara é um chatbot de atendimento, não tem acesso ao banco de dados do portal nem é especializada em busca contextual. O TransparaMA traz uma IA com acesso aos dados, embutida nos pontos onde o cidadão precisa (busca avançada, exploração de dashboard). São camadas diferentes e complementares.

---

## Frases Oficiais da STC para Citar (validadas em apresentações cedidas)

- *"O nosso compromisso é um pouco menos com o legal e mais com a sociedade."* (STC, hackathon)
- *"O portal não pode falar burocratiquês."* (STC, hackathon)
- *"UX não é beleza. É questão de utilidade, usabilidade e desejabilidade."* (STC, hackathon)
- *"A pessoa deve encontrar a informação em no máximo 3 passos, sem precisar saber nenhum jargão técnico."* (STC, hackathon)
- *"Mais Buscados, Presença do Estado"* (STC, apresentação 2022, validando nosso dashboard de busca)
- *"De x Para"* (STC, apresentação 2022, validando nosso Glossário Vivo)
- *"Medir, Analisar, Ajustar"* (STC, apresentação 2022, validando nossa telemetria)
- *"Ciência de Dados & Inteligência"* (STC, apresentação 2022, validando nossa AjudaInteligente)

---
Criado por André Lopes
Desenvolvedor Fullstack
