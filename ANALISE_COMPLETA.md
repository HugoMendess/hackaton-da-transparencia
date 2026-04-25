# 🏛️ Hackathon da Transparência Maranhense - Análise Completa do Desafio

**STC + SECTI + EGMA + FAPEMA | 24 a 26 de abril de 2026 | São Luís, MA**

> Documento de uso interno da equipe. Atualizado com base na apresentação oficial do desafio.
> Posicionamento: o TransparaMA é a proposta de **substituto oficial** do Portal da Transparência atual, não uma camada complementar.

---

## Sumário

1. [Contexto Real do Portal](#1-contexto-real-do-portal)
2. [O Desafio Oficial (Detalhado)](#2-o-desafio-oficial-detalhado)
3. [As 4 Frentes de Atuação](#3-as-4-frentes-de-atuação)
4. [Entregáveis Obrigatórios](#4-entregáveis-obrigatórios)
5. [Mapeamento de Soluções](#5-mapeamento-de-soluções)
6. [Matriz de Decisão](#6-matriz-de-decisão)
7. [Checklist de Preparação](#7-checklist-de-preparação)
8. [Benchmarks e Referências](#8-benchmarks-e-referências)
9. [Citações-Chave para o Pitch](#9-citações-chave-para-o-pitch)

---

## 1. Contexto Real do Portal

### Números que provam a relevância

| Indicador | Dado |
|---|---|
| Usuários/ano | ~320.000 |
| Visualizações/ano | ~4.000.000 |
| Ranking | Portal mais acessado do Governo do MA |
| Tipos de informações | 115 categorias diferentes |
| Acesso via celular | **56% dos acessos** |
| Avaliação Tribunais de Contas | **Selo Diamante** (2x consecutivo) |
| Score de transparência | **98,5 / 100** |

### A Evolução Histórica do Portal

| Ano | Foco |
|---|---|
| 2010 | Cumprimento da obrigação legal |
| 2015 | Melhorias de interface e criação de informações |
| 2017 | Nova interface e linguagem cidadã |
| 2023 | Inovação e navegação simples |
| **2026** | **Usabilidade - foco total no cidadão** |

### O que isso significa para o desafio

> ⚠️ **Insight crítico:** O portal já é excelente em compliance legal (98,5/100). O desafio NÃO é fazer o portal cumprir a lei, é fazer o cidadão conseguir usar o que já está lá.

A STC está dizendo explicitamente: *"O nosso compromisso nesses próximos dois dias é um pouco menos com o legal e mais com a sociedade."*

> ⚠️ **Decisão de produto:** o TransparaMA assume a posição de **substituto oficial do portal**, não de camada complementar. A linha histórica (2010 legal, 2017 cidadã, 2023 simples, 2026 usabilidade total) é o argumento estrutural para essa decisão. A substituição é responsável: 5 fases de transição, compliance preservado, STC como gestora oficial, redirecionamentos preservados.

---

## 2. O Desafio Oficial (Detalhado)

### A Dor Principal

Os dados existem. O direito existe. **Mas a experiência afasta o cidadão antes dele chegar lá.**

Termos que são barreiras reais, citados na apresentação:

- Empenho
- Dotação orçamentária
- Unidade / Subação
- Natureza da despesa
- Subelemento

> *"Quando você não consegue achar depois de 5, 10 cliques... 'Ah, deixa pra lá, não vou buscar.'"*

### Perguntas reais que o cidadão quer responder

Citadas diretamente na apresentação como exemplos do que o cidadão precisa:

- *"Como me inscrevo no programa Maranhão Livre da Fome?"*
- *"Como eu sei quando vou receber o meu recurso?"*
- *"Como cidadão sabe se tem vaga na escola perto da minha casa?"*

> 💡 **Essas perguntas são ouro para o pitch.** Demonstrar que a solução responde a pelo menos uma delas em 3 passos é um diferencial decisivo.

### A Definição de UX usada pela STC

- **Utilidade** - serve para algo real na vida do cidadão
- **Usabilidade** - a pessoa consegue usar sem travar ou pedir ajuda
- **Desejabilidade** - convida: *"Isso é tão legal, deixa eu fuçar mais"*

> *"UX não é beleza. É questão de utilidade, usabilidade e desejabilidade."*

### O que está superado (segundo a STC)

- Menus organizados pela lógica contábil do Estado
- Termos técnicos sem explicação
- Vários caminhos diferentes para o mesmo dado
- Interface que quebra no celular
- Jornadas longas para tarefas simples
- Exportação em formatos que não funcionam no celular

---

## 3. As 4 Frentes de Atuação

Frentes **oficiais** definidas pela STC. A solução deve atacar ao menos uma com profundidade - idealmente combinar frentes.

### 🧭 Frente 1 - Navegação
- Rotas temáticas (não contábeis)
- Filtros intuitivos
- **Regra de ouro: máximo 3 passos para encontrar qualquer informação**
- Sem jargão técnico no caminho
- Acessibilidade de ponta a ponta

### 📱 Frente 2 - Mobile First
- 56% dos acessos são via celular (e crescendo)
- Tela não pode quebrar no celular
- Filtros que funcionam com touchscreen
- Jornadas curtas para tarefas simples
- Exportação em formatos compatíveis com celular

### ♿ Frente 3 - Acessibilidade
- Leitor de voz
- Alto contraste
- Navegação pelo teclado
- Linguagem simples
- Narrativa explicativa para cada seção

### 📊 Frente 4 - Visualização
- Gráficos e infográficos que substituem tabelas brutas
- Linguagem cidadã (não burocratiquês)
- Conteúdo fácil de compartilhar
- Contexto para os dados (não só números isolados)

---

## 4. Entregáveis Obrigatórios

> ⚠️ Atenção - isso define exatamente o que precisa ser entregue no pitch.

| Entregável | Formatos aceitos |
|---|---|
| **Protótipo funcional** | HTML interativo, ambiente de desenvolvimento, Figma, Adobe XD |
| **Memorial descritivo** | Documento explicando como chegaram na solução |

### Apresentação final
- **Tempo:** 3 minutos
- **Foco:** Mostrar o protótipo funcionando + explicar o raciocínio

### O que NÃO é exigido
- Portal completo implementado e em produção
- Backend com dados reais em produção
- Integração real com a API (mock é aceito)
- Cobertura de todos os 115 tipos de informação

---

## 5. Mapeamento de Soluções

Soluções revisadas e priorizadas com base nas 4 frentes oficiais.

---

### 📊 Solução 01 - Dashboard Cidadão por Tema
*O cidadão escolhe o que quer saber, não o que o governo quer mostrar*

**Descrição**
Em vez de menus contábeis, o portal é reorganizado por temas do cotidiano: Saúde, Educação, Segurança, Habitação, Assistência Social. O cidadão clica no tema e chega à informação em no máximo 3 passos, com linguagem simples e gráficos.

- **Frentes atendidas:** Navegação ✅ | Visualização ✅ | Mobile First ✅
- **Tecnologia:** React + Recharts + Tailwind (mobile-first)
- **Dados:** API `/api/consulta-despesas` por categoria

**✅ Pontos fortes**
- Ataca diretamente a dor mais citada: menus por lógica contábil estão superados
- A regra dos 3 passos é demonstrável ao vivo no pitch
- Altamente viável em 48h com o perfil do time
- Demo visual impactante

**⚠️ Desafios**
- Mapeamento dos 115 tipos de informação em temas cidadãos requer decisão rápida
- Pode ser a ideia mais comum entre os times

| Complexidade técnica | Impacto cidadão | Frentes cobertas |
|---|---|---|
| ⭐⭐⭐ Moderada | ⭐⭐⭐⭐⭐ Muito alto | 3 de 4 |

---

### 📱 Solução 02 - Portal Mobile-First Redesenhado
*Construído do celular para o desktop, não o contrário*

**Descrição**
Redesenho completo da experiência mobile. Interface touch-friendly, filtros que funcionam com o dedo, jornadas curtas, exportação em PDF/imagem pelo celular. Responde à dor mais concreta do desafio: 56% acessa pelo celular e a experiência atual não está preparada.

- **Frentes atendidas:** Mobile First ✅ | Navegação ✅ | Acessibilidade ✅
- **Tecnologia:** React PWA + Tailwind mobile-first
- **Destaque:** Pode funcionar offline com dados em cache

**✅ Pontos fortes**
- Ataca o dado mais concreto citado na apresentação: 56% via celular
- PWA é impressionante de demonstrar no próprio celular durante o pitch
- A STC mencionou que o portal atual não está preparado para mobile

**⚠️ Desafios**
- Testes reais em dispositivos de entrada são difíceis em 48h
- Visualmente menos impactante num notebook durante o pitch

| Complexidade técnica | Impacto cidadão | Frentes cobertas |
|---|---|---|
| ⭐⭐⭐ Moderada | ⭐⭐⭐⭐⭐ Muito alto | 3 de 4 |

---

### 🤖 Solução 03 - Assistente em Linguagem Natural (IA)
*O cidadão pergunta em português, o portal responde em português*

**Descrição**
Campo de busca conversacional: o cidadão digita *"Tem vaga na escola perto da minha casa?"* ou *"Quanto foi gasto com merenda escolar em São Luís?"*. A IA interpreta, consulta a API e responde com linguagem simples + visualização. Elimina completamente a barreira do jargão técnico.

- **Frentes atendidas:** Navegação ✅ | Visualização ✅ | Acessibilidade ✅
- **Tecnologia:** Claude API + React + API do portal
- **Diferencial:** Responde exatamente às perguntas citadas na apresentação da STC

**✅ Pontos fortes**
- Responde literalmente às perguntas-exemplo da STC - argumento poderoso no pitch
- Inovador: nenhum portal de transparência do Brasil tem isso
- Demo ao vivo extremamente impactante
- A Claude API pode ser usada diretamente no frontend

**⚠️ Desafios**
- Risco de alucinação se a IA não tiver dados precisos
- Dependência de API externa
- Requer mais tempo de integração e teste

| Complexidade técnica | Impacto cidadão | Frentes cobertas |
|---|---|---|
| ⭐⭐⭐⭐ Alta | ⭐⭐⭐⭐⭐ Muito alto | 3 de 4 |

---

### ♿ Solução 04 - Glossário Vivo + Acessibilidade Total
*Traduz o "burocratiquês" automaticamente, palavra por palavra*

**Descrição**
Cada termo técnico que aparece no portal (empenho, dotação, subelemento) é automaticamente destacado e explicado em linguagem simples ao passar o mouse ou tocar na tela. Mais: leitor de voz, alto contraste, navegação por teclado. A cada dado, uma narrativa contextualiza: *"Este valor representa X% do orçamento total de saúde."*

- **Frentes atendidas:** Acessibilidade ✅ | Visualização ✅ | Navegação ✅
- **Tecnologia:** React + ARIA + CSS de alto contraste + glossário JSON

**✅ Pontos fortes**
- Cobre a frente menos explorada pelos outros times (vantagem competitiva)
- Resolve diretamente o "burocratiquês" que a STC citou como barreira
- Relativamente simples de implementar de forma polida
- Impacto social imenso e reconhecível pelos juízes

**⚠️ Desafios**
- Menos visualmente impressionante no pitch
- Exige testes reais com leitores de tela

| Complexidade técnica | Impacto cidadão | Frentes cobertas |
|---|---|---|
| ⭐⭐⭐ Moderada | ⭐⭐⭐⭐ Alto | 3 de 4 |

---

### 🗺️ Solução 05 - Mapa da Transparência Municipal
*O cidadão vê o seu município no mapa*

**Descrição**
Mapa interativo do Maranhão com os 217 municípios coloridos por indicadores de gasto. O cidadão clica no seu município e vê: *"São Luís gastou X com saúde - acima ou abaixo da média estadual?"*

- **Frentes atendidas:** Visualização ✅ | Navegação ✅
- **Tecnologia:** react-simple-maps + GeoJSON do MA + API do portal

**✅ Pontos fortes**
- Forte apelo emocional: o cidadão vê seu próprio município
- Diferencial visual forte para o pitch
- GeoJSON do MA é público e disponível

**⚠️ Desafios**
- Cobre apenas 2 das 4 frentes oficiais
- Dados municipais podem estar incompletos na API estadual
- Mais complexo tecnicamente

| Complexidade técnica | Impacto cidadão | Frentes cobertas |
|---|---|---|
| ⭐⭐⭐⭐ Alta | ⭐⭐⭐⭐ Alto | 2 de 4 |

---

## 6. Matriz de Decisão

| Solução | Inovação | Impacto | Viabilidade 48h | Demo | Frentes | **TOTAL** |
|---|---|---|---|---|---|---|
| 📊 Dashboard por Tema | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 3/4 | **23/25** |
| 🤖 Assistente IA | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | 3/4 | **22/25** |
| 📱 Mobile First | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 3/4 | **21/25** |
| ♿ Glossário + Acessibilidade | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | 3/4 | **18/25** |
| 🗺️ Mapa Municipal | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | 2/4 | **17/25** |

> 💡 **Recomendação estratégica:**
>
> **TransparaMA como substituto oficial = Dashboard Temático + Mobile First + Glossário Vivo + Assistente IA + Compartilhar Zap**
>
> - **Dashboard por Tema** resolve a dor mais citada: menus por lógica contábil estão superados
> - **Mobile First** garante que funciona para os 56% que acessam pelo celular
> - **Glossário Vivo** elimina o "burocratiquês" sem tirar o cidadão do contexto
> - **Assistente IA** responde diretamente às perguntas-exemplo da STC ("vagas em escola", "Maranhão Livre da Fome")
> - **Compartilhar Zap** transforma controle social em distribuição orgânica de informação pública
>
> A combinação cobre as **4 frentes oficiais** e posiciona o produto como o **futuro Portal da Transparência do MA**, não como adicional ao portal atual. O MVP do hackathon é a prova de viabilidade dessa visão.

---

## 7. Checklist de Preparação

### 7.1 Artefatos Técnicos

| | Item | Status | Prioridade |
|---|---|---|---|
| ✅ | Repositório GitHub criado | Feito | Alta |
| ✅ | README.md com visão do projeto | Feito | Alta |
| ✅ | Documentação de contexto e solução | Feito | Alta |
| ✅ | Arquitetura técnica documentada | Feito | Alta |
| ✅ | APIs do portal mapeadas e documentadas | Feito | Alta |
| ⬜ | Boilerplate React + Vite configurado | Pendente | Alta |
| ⬜ | Testar endpoints da API ao vivo | Pendente | **Urgente** |
| ⬜ | Dados mock em JSON preparados (fallback) | Pendente | Alta |
| ⬜ | GeoJSON do Maranhão baixado | Pendente | Média |
| ⬜ | Ambiente de deploy configurado (Vercel) | Pendente | Média |
| ⬜ | **Memorial descritivo** (entregável obrigatório) | Pendente | Alta |

### 7.2 Artefatos de Negócio / Estratégia

| | Item | Status | Prioridade |
|---|---|---|---|
| ✅ | Análise do desafio (versão atualizada com áudio) | Feito | Alta |
| ✅ | Múltiplas ideias de solução | Feito | Alta |
| ✅ | Plano de execução das 48h | Feito | Alta |
| ✅ | Roteiro do pitch (3 minutos) | Feito | Alta |
| ⬜ | Decisão final sobre a solução | Pendente | **Urgente** |
| ⬜ | Divisão de tarefas entre o time | Pendente | **Urgente** |
| ⬜ | Protótipo de telas (Figma ou papel) | Pendente | Alta |
| ⬜ | Mapeamento: categorias do portal → temas cidadãos | Pendente | Alta |
| ⬜ | Glossário: termos técnicos → linguagem simples | Pendente | Média |

### 7.3 Itens Logísticos

| | Item | Responsável |
|---|---|---|
| ⬜ | Todos com notebook carregado e carregador | Todos |
| ⬜ | Node.js + npm instalado nas máquinas | Devs |
| ⬜ | Git configurado e acesso ao repositório | Devs |
| ⬜ | Figma / ferramenta de design aberta | Designer |
| ⬜ | Canal de comunicação do time | Todos |
| ⬜ | Hotspot mobile como backup de internet | 1 pessoa |
| ⬜ | **Celular para testar a versão mobile ao vivo** | Todos |

---

## 8. Benchmarks e Referências

| Projeto | País | Por que é relevante aqui |
|---|---|---|
| Open Spending | Global | Navegação por tema, não por classificação contábil |
| Serenata de Amor | Brasil | IA para traduzir dados públicos para o cidadão |
| Brasil.io | Brasil | Dados públicos em linguagem acessível |
| USASpending.gov | EUA | Exemplo de como organizar dados federais por tema |
| GOV.UK Design System | Reino Unido | Referência mundial de UX em portais de governo |

---

## 9. Citações-Chave para o Pitch

Frases ditas pela STC que podem ser usadas no pitch da equipe:

> *"O portal não pode falar burocratiquês."*

> *"Menus organizados pela lógica contábil do Estado estão superados."*

> *"A informação existe, o direito existe, mas a experiência pode afastar o cidadão antes dele chegar lá."*

> *"A pessoa deve encontrar a informação em no máximo 3 passos, sem precisar saber nenhum jargão técnico."*

> *"UX não é ser bonito. É questão de utilidade, usabilidade e desejabilidade."*

> *"56% dos acessos ao Portal da Transparência são feitos pelo celular."*

> *"Hoje a Inteligência Artificial está no bolso de todo mundo."*

---

*Documento atualizado em 25 de abril de 2026, com base na transcrição da apresentação oficial do desafio e na decisão de posicionamento do TransparaMA como substituto oficial.*

---
Criado por André Lopes
Desenvolvedor Fullstack
