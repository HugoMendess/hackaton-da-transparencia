# 📊 DADOS REAIS - Fonte de Verdade

> Documento consolidador dos dados extraídos das planilhas e apresentações oficiais cedidas durante o hackathon. Esta é a base factual para todos os argumentos de pitch, memorial e produto.

**Fontes:**
- `Planilhas/Termos_Buscados_Consolidado.xlsx` (232.782 buscas brutas, 895.741 buscas acumuladas)
- `Planilhas/Analytics_GA4_2024_2025_2026_v2.xlsx` (eventos, tecnologia, páginas)
- `Apresentações/Hackathon_Desafios_Modern.pptx` (desafio oficial 2026)
- `Apresentações/2021 - portal_inovacao.pptx` (histórico)
- `Apresentações/2022 - Estrategia de Linguagem Simples.pptx` (estratégia anterior)
- `Apresentações/2023 - novo_portal.pptx` (relançamento)

---

## 1. Números Oficiais (Apresentação do Hackathon 2026)

| Indicador | Dado oficial |
|---|---|
| Usuários no portal | 320K |
| Visualizações por ano | ~4M |
| Tipos de informação pública | 115 |
| Selo Diamante consecutivo | 2x |
| Acesso via celular | **56%** (não 60%) |
| Duração da imersão | 20h |
| Premiação total | R$ 10.800 (FAPEMA) |
| Equipe permitida | 3 a 6 integrantes |

**⚠️ Correção importante:** estávamos usando "60% celular" em todos os docs. O número oficial é **56%**.

---

## 2. Critérios de Avaliação Oficiais (Slide 13 do desafio)

| Critério | Peso |
|---|---|
| **Usabilidade** | **30%** |
| **Acessibilidade** | **25%** |
| **Clareza da Informação** | **20%** |
| Viabilidade Técnica | 15% |
| Impacto e Inovação | 10% |

> *"A banca não premia o mais bonito. Premia quem funcionou melhor pra quem mais precisa."*

**Implicação estratégica:** Usabilidade + Acessibilidade somam **55%** do peso. Foco do produto e da demo deve estar nesses dois critérios. Inovação (onde a IA mora) vale apenas 10%, mas é onde o pitch impressiona.

---

## 3. Framework Oficial das 4 Etapas (Slide 6)

| # | Etapa | O que envolve |
|---|---|---|
| 1 | **Descobrir** | Pesquisa, dados, persona, perfil de quem acessa |
| 2 | **Navegar** | IA, arquitetura, UX, rotas temáticas, filtros |
| 3 | **Compreender** | Linguagem simples, dataviz, narrativas |
| 4 | **Compartilhar & Controlar** | Métricas, feedback, evolução |

**O Portal da Transparência precisa cobrir as 4 etapas, com profundidade nas 2 primeiras (peso 55% da banca).**

---

## 4. Perguntas-Âncora Oficiais (Slide 10)

A entrega exige responder pelo menos uma dessas perguntas:

- *"Quanto o governo gastou com saúde esse ano?"*
- *"As obras de educação estão sendo executadas?"*
- *"Quanto custa a folha de servidores por mês?"*
- *"Quais contratos estão ativos no meu município?"*

**Plano:** o MVP deve responder pelo menos 3 das 4 com o Assistente IA. Demo focada nas perguntas oficiais (impacto de pitch decisivo).

---

## 5. Comportamento Real (Google Analytics)

### Dispositivo (média 2024-2026)

| Plataforma | Usuários | Tempo médio engajamento |
|---|---|---|
| Mobile | 56% | **155 segundos** |
| Desktop | 43% | **325 segundos** |
| Tablet | 1% | 222 segundos |

**Insight crítico:** mobile usa **menos da metade do tempo** de desktop. Não é só "60% acessa pelo celular", é "56% acessa pelo celular e desiste em metade do tempo de desktop". A experiência mobile expulsa o cidadão.

### Eventos por ano

| Evento | 2024 | 2025 | 2026 (parcial) |
|---|---|---|---|
| Page views | 5,1M | 3,8M | (em curso) |
| view_search_results | **173K** | **204K** | (cresce) |
| Form starts | 1,22M | 1,25M | - |
| Form submits | 1,34M | 1,42M | - |

**Insight crítico:** uso da busca **cresceu 18%** de 2024 para 2025. O cidadão está usando cada vez mais a busca, mas a UX da busca não evoluiu na mesma proporção.

---

## 6. Top 25 Páginas Mais Acessadas (2024)

| # | Página | Views | Tempo médio |
|---|---|---|---|
| 1 | **Remuneração** | **2.384.754** | 254s |
| 2 | **Ficha financeira** | **1.299.451** | 226s |
| 3 | Portal da Transparência - Início | 307.576 | 35s |
| 4 | **Despesas** | **281.564** | 256s |
| 5 | Portal da transparência (variação) | 182.052 | 85s |
| 6 | Portal da Transparência do GE-MA | 153.975 | 34s |
| 7 | **Pessoal + Diárias** | **150.522** | 141s |
| 8 | **Servidores** | **71.659** | 191s |
| 9 | Nota de empenho | 65.254 | 81s |
| 10 | Tabela de Cargos e Funções | 30.411 | 33s |
| 11 | Licitações e Contratos | 25.273 | 166s |
| 12 | **Busca Avançada** | **16.527** | 116s |
| 13 | Acesso a Serviços | 13.895 | 37s |
| 14 | Gestão Fiscal | 11.543 | 38s |
| 15 | Receitas | 11.491 | 41s |
| 16 | Emendas Parlamentares | 11.383 | 131s |
| 17 | Transferências | 10.282 | 49s |
| 18 | Informações Institucionais | 9.321 | 66s |
| 19 | Contratos | 9.085 | 143s |
| 20 | **Obras** | **7.235** | 249s |
| 21 | Licitações e Compras | 6.474 | 168s |
| 22 | Detalhes do contrato | 5.781 | 140s |
| 23 | Unidades Gestoras | 5.543 | 122s |
| 24 | Cidadão Informado | 5.125 | 39s |
| 25 | Notas de empenho | 4.252 | 50s |

**O dado mais importante de todo o projeto:**

> **Remuneração + Ficha Financeira = 3.684.205 visualizações (≈72% do total).**
>
> O portal não é usado para conhecer programas sociais ou descobrir vagas em escolas. É usado **massivamente para fiscalizar a máquina pública**: quanto ganha cada servidor, qual o contracheque, qual o salário.

### Tendência 2025 (Busca Avançada explode)

- 2024: Busca Avançada = 16.527 views
- 2025: Busca Avançada = **205.569 views** (+1.144%)
- 2026 (parcial): 60.272 views, ritmo sustentado

**O cidadão está descobrindo a busca. É o ponto exato onde a AjudaInteligente entra e brilha.**

---

## 7. Top 100 Termos Buscados (planilha de buscas)

### Os 30 mais buscados

| # | Termo | Buscas |
|---|---|---|
| 1 | **Remuneração** | **10.948** |
| 2 | Norcia vigilância patrimonial *(empresa)* | 4.646 |
| 3 | Folha de pagamento | 4.449 |
| 4 | Fast Ambiental *(empresa)* | 3.148 |
| 5 | Servidores | 2.792 |
| 6 | NILMA *(pessoa)* | 2.408 |
| 7 | Contratos | 2.365 |
| 8 | Uemasul *(universidade)* | 2.321 |
| 9 | EJATEC | 2.097 |
| 10 | Salário | 1.920 |
| 11 | Funac | 1.814 |
| 12 | Servidor | 1.611 |
| 13 | Emserh | 1.599 |
| 14 | Procon | 1.472 |
| 15 | HSLZ *(hospital)* | 1.377 |
| 16 | Licitação | 1.264 |
| 17 | Por- *(termo cortado)* | 1.248 |
| 18 | Martins e reis *(empresa)* | 1.199 |
| 19 | Orlando Barbosa Filho *(pessoa)* | 1.147 |
| 20 | Contra cheque | 1.138 |
| 21 | salario *(variante)* | 1.100 |
| 22 | Diárias | 1.019 |
| 23 | 2025 | 1.018 |
| 24 | diarias *(variante)* | 1.000 |
| 25 | Professor | 979 |
| 26 | Casa de Saúde e Maternidade de Caxias | 924 |
| 27 | Alexsandro da Silva Sousa *(pessoa)* | 913 |
| 28 | Despesas | 860 |
| 29 | 2026 | 815 |
| 30 | Iema | 808 |

### Categorização do Top 100

| Categoria | % das buscas top 100 |
|---|---|
| Salários/Remuneração/Folha | ~35% |
| Nomes de pessoas (servidores, fornecedores) | ~25% |
| Empresas e fornecedores | ~15% |
| Órgãos e secretarias | ~10% |
| Conceitos jurídicos (contratos, licitação, despesas) | ~8% |
| Outros (cargos, instituições) | ~7% |

### Inconsistências importantes (planilha aba "Resumo")

- 21.915 grupos de variantes de capitalização (REMUNERAÇÃO / Remuneração / remuneracao tratados como termos diferentes)
- 28.514 linhas duplicadas
- 82.619 termos com apenas 1 busca (cauda longa)
- **CPF exposto** na busca (dado pessoal sensibilíssimo): "62637398353" foi buscado 126 vezes

**Implicação para o produto:** o portal atual:
1. Não normaliza variantes (busca discrimina maiúsculas/minúsculas e acentos)
2. Não previne busca por CPF/dados sensíveis
3. Não consolida sinônimos ("salário" vs "salario" vs "remuneração")

A AjudaInteligente do Portal da Transparência precisa fazer isso por padrão (normalização + LGPD enforcement).

---

## 8. Linha Histórica Oficial do Portal

Baseada nas apresentações cedidas:

| Ano | Foco oficial | Documento fonte |
|---|---|---|
| 2010 | Cumprimento da criação do portal (LRF + LAI) | 2021 - portal_inovacao.pptx |
| 2015 | Desenvolvimento rápido, foco em compliance integral | 2021 - portal_inovacao.pptx |
| 2017 | Interface amigável, **linguagem cidadã**, otimização de organização | 2021 - portal_inovacao.pptx |
| 2021 | Inovação na apresentação, **menos clicks**, multi-plataforma, ampliação de público | 2021 - portal_inovacao.pptx |
| 2022 | Estratégia de **linguagem simples**, "Mais Buscados" como atalho, glossário, FAQ, "Medir-Analisar-Ajustar" | 2022 - Estrategia de Linguagem Simples.pptx |
| 2023 | Novo Portal: parceria SEATRAN + LabiGov + SECOM, tecnologias abertas | 2023 - novo_portal.pptx |
| **2026** | **Usabilidade total, cidadão no centro (este hackathon)** | Hackathon_Desafios_Modern.pptx |

### Continuidade que o Portal da Transparência estende

A apresentação de 2022 já mencionou:
- **Atalhos: "Mais Buscados", "Presença do Estado"** (nossa proposta de dashboard de busca valida isso)
- **De x Para** (tradução de termos técnicos = nosso Glossário Vivo)
- **Medir, Analisar, Ajustar** (nossa proposta de telemetria do AjudaInteligente)
- **Ciência de Dados & Inteligência** (nossa proposta de IA com RAG)

> **O Portal da Transparência não é uma ruptura, é a continuidade técnica do plano que a STC vinha construindo desde 2021. A 2026 entrega o que 2022 anunciou.**

---

## 9. Equipes Anteriores da STC (citáveis no agradecimento)

### Equipe original (2021)
- Lilian Guimarães (Secretária de Estado)
- Steferson Ferreira (Secretário Adjunto de Transparência)
- Ronald Campos (Coordenador do Desenvolvimento)
- Fernando Moreira (Auditor de Estado, Líder do Projeto)
- Bruno Araújo (Desenvolvedor)
- Gabriel Sales (Desenvolvedor)
- Carlos Oliveira (Auditor de Estado)

### Equipe do Novo Portal (2023)
- Carlos Silva
- Fernando Moreira
- Gabriel Sales
- Ismael Coelho Filho
- Leandro Araújo
- Piétro Aquino
- Rafael Viana
- Ronald Campos
- Victor Alves

---

## 10. Implicações Diretas no Produto

### A) Dashboard inicial da página de busca (insight do André)

A apresentação de 2022 (Slide 7) já previa essa estratégia: *"Esses são os temas mais procurados no nosso Portal"*. O Portal da Transparência materializa isso usando dados reais de uso. Primeira dobra da página de busca:

```
┌─────────────────────────────────────────────────────┐
│ 🔍 [Pergunta em linguagem natural ou termo de busca] │
└─────────────────────────────────────────────────────┘

┌─ Termos mais buscados nos últimos 30 dias ─────────┐
│ Remuneração (10.948)  Folha de pagamento (4.449)   │
│ Servidores (2.792)    Contratos (2.365)            │
│ Diárias (1.019)       Licitação (1.264)            │
└────────────────────────────────────────────────────┘

┌─ Métricas em destaque ─────────────────────────────┐
│ R$ X bi gastos em 2026  | Y mil servidores ativos  │
│ Z mil contratos vigentes | W obras em andamento     │
└────────────────────────────────────────────────────┘

┌─ Acessos recentes ──────────────────────────────────┐
│ Última atualização da Remuneração: hoje 03h        │
│ Novos contratos publicados: 12 esta semana         │
└────────────────────────────────────────────────────┘
```

### B) Reposicionamento dos eixos temáticos

Os eixos Saúde/Educação/Programas Sociais existem para a aspiração da STC (uso ideal do portal pelo cidadão). Mas o uso REAL está em **Gestão Pública** (servidores, fornecedores, contratos). Solução:

- Manter os 7 eixos
- **Promover "Gestão Pública" para posição visual destacada** (é onde o cidadão real mora)
- Criar entradas rápidas na home: "Ver salário de servidor", "Ver fornecedor", "Ver contrato"

### C) AjudaInteligente prioriza busca antes de explorer

Como busca é o ponto de dor explosivo (+18% em 2025), o trigger principal da AjudaInteligente é na busca, não no explorer. O explorer fica como secundário.

### D) Anti-enumeração e LGPD são obrigatórios

A planilha mostra CPFs sendo buscados. O Portal da Transparência precisa:
- Bloquear busca por CPFs/RGs/dados sensíveis
- Normalizar variantes de capitalização e acentuação
- Não logar pergunta vinculada a IP

### E) Pitch incorpora estatísticas reais

- "56%" no lugar de "60%"
- "Tempo médio mobile (155s) é metade do desktop (325s)"
- "Busca avançada cresceu 12x em 2025"
- "72% das visualizações estão em páginas de salários e ficha financeira"
- "10.948 buscas por 'Remuneração' no top do ranking"
- "CPF exposto sendo buscado 126 vezes"

### F) Memorial cita evolução histórica oficial

Não é só "linha histórica que apontava para 2026". É: 2010 -> 2015 -> 2017 -> 2021 -> 2022 -> 2023 -> 2026. Com nomes de equipes, projetos e marcos.

---

## 11. Próximos Passos (uso destes dados)

1. ✅ Atualizar `README.md` com números oficiais (56%, time real, repositório)
2. ✅ Atualizar `CONTEXTO.md` com dados reais de uso e histórico oficial
3. ✅ Atualizar `SOLUCAO.md` com dashboard da busca, AjudaInteligente, eixo de Gestão Pública promovido
4. ✅ Atualizar `ARQUITETURA.md` com componentes baseados em dados reais
5. ✅ Atualizar `PERSONAS.md` com persona dominante (fiscalização) destacada
6. ✅ Atualizar `PITCH.md` com narrativa baseada em dados reais
7. ✅ Atualizar `MEMORIAL.md` com critérios de banca, framework oficial e perguntas-âncora
8. ✅ Atualizar `PLANO_EXECUCAO.md` com time real e foco nos 55% (Usabilidade + Acessibilidade)

---
Criado por André Lopes
Desenvolvedor Fullstack
