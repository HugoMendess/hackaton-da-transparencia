# 👥 PERSONAS E JORNADAS

> Quem é o cidadão maranhense que o TransparaMA precisa servir, e o que ele precisa fazer no portal.

O TransparaMA não é desenhado para "o cidadão" abstrato. É desenhado para 5 personas concretas que cobrem o espectro real de quem usa, ou tenta usar, o portal hoje.

**Insight crítico baseado em dados reais (DADOS_REAIS.md):** 72% das visualizações do portal atual estão nas páginas de Remuneração e Ficha Financeira. Os top 30 termos mais buscados são dominados por salários, nomes de servidores e fornecedores. **O uso real do portal é fiscalizatório, não descobertivo.** Por isso, as personas Joana (fornecedora) e Ana (jornalista) representam o **uso dominante atual**. Dona Maria e Carlos representam o **uso aspiracional** que a STC quer ampliar.

---

## As 5 Personas

### 1. 👵 Dona Maria, Cidadã em Vulnerabilidade Social

| | |
|---|---|
| Idade | 58 anos |
| Onde | Periferia de São Luís |
| Acesso | Apenas celular, plano de dados limitado |
| Escolaridade | Ensino fundamental incompleto |
| Necessidade | Acessar programas sociais |

**Pergunta típica:** *"Como me inscrevo no Maranhão Livre da Fome?"*

**Dores no portal atual:**
- Não acha o programa pelo nome
- Quando acha, encontra documento jurídico em PDF
- Sem instrução clara de como participar
- Letra pequena, layout quebrado no celular

**O que o TransparaMA entrega:**
- Eixo "Programas Sociais" visível na home, ícone grande
- Página do programa com critérios em linguagem simples
- Botão "Como Participar" com passo a passo
- Tudo otimizado para tela pequena e plano de dados limitado

---

### 2. 👨‍👩‍👧 Carlos, Pai de Aluno da Rede Estadual

| | |
|---|---|
| Idade | 38 anos |
| Onde | Imperatriz |
| Acesso | Celular (uso intenso), notebook eventual |
| Escolaridade | Ensino médio completo |
| Necessidade | Saber como anda a escola do filho |

**Pergunta típica:** *"Como sei se tem vaga na escola perto da minha casa?"*

**Dores no portal atual:**
- Dados de educação espalhados em múltiplos cliques
- Sem busca por bairro ou município
- Tabelas brutas sem contexto comparativo
- Sem informação sobre matrícula e vagas

**O que o TransparaMA entrega:**
- Eixo "Educação e Futuro" com sub-itens claros
- Mapa de escolas por município
- Comparativo de gastos por escola
- Status de obras escolares com fotos e prazo

---

### 3. 🏪 Joana, Fornecedora de Pequeno Porte

| | |
|---|---|
| Idade | 45 anos |
| Onde | Caxias |
| Acesso | Celular (rotina) e notebook (controle) |
| Escolaridade | Ensino superior (administração) |
| Necessidade | Acompanhar pagamentos e licitações |

**Pergunta típica:** *"Quando vou receber o recurso da última nota?"*

**Dores no portal atual:**
- Termos como "empenho" e "liquidação" sem explicação
- Status de pagamento difícil de localizar
- Sem visão consolidada por fornecedor
- Editais de licitação em formato pouco amigável

**O que o TransparaMA entrega:**
- Eixo "Gestão Pública" com seção de fornecedores e pagamentos
- Glossário vivo explicando empenho, liquidação, pagamento
- Notificações opt-in: "novo edital relevante para o seu CNPJ"
- Cronograma de pagamento com previsão e status

---

### 4. 📰 Ana, Jornalista de Controle Social

| | |
|---|---|
| Idade | 32 anos |
| Onde | São Luís |
| Acesso | Notebook (trabalho) e celular |
| Escolaridade | Pós-graduação em jornalismo de dados |
| Necessidade | Investigar gastos, cruzar dados, produzir matérias |

**Pergunta típica:** *"Quanto foi gasto com merenda escolar em São Luís este mês?"*

**Dores no portal atual:**
- Dados disponíveis mas em formato difícil de cruzar
- Exportação inadequada para análise (PDF e tabelas paginadas)
- Sem download em CSV/JSON consolidado
- Sem API documentada para uso jornalístico

**O que o TransparaMA entrega:**
- Filtros avançados em todos os dashboards
- Exportação em CSV e JSON com 1 clique
- API pública documentada e versionada
- Permalink em qualquer recorte (compartilhável e citável)
- Botão "Compartilhar Zap" para divulgar achados

---

### 5. 🏛️ Equipe da STC e Órgãos Publicadores (persona institucional)

| | |
|---|---|
| Quem | STC, SES, SEDUC, SEINC, SINFRA, demais órgãos |
| Acesso | Notebook, ambiente administrativo |
| Necessidade | Publicar dados de forma rápida e auditável |

**Dor atual:**
- Processos manuais de atualização
- Sem rastreabilidade clara de quem publicou o quê
- Receio de impactar a navegação do cidadão a cada publicação

**O que o TransparaMA entrega (Fase 2 do roadmap):**
- Painel admin por órgão, com perfis e permissões
- Auditoria completa: quem mudou, quando, o que era antes
- Validação automática de qualidade dos dados
- Preview antes de publicar
- Histórico de versões com possibilidade de rollback

> Esta persona não é foco do MVP do hackathon, mas é central para a viabilidade do TransparaMA como substituto oficial. O respeito ao trabalho da STC e dos órgãos é parte do design.

---

## Jornadas de Valor (Regra dos 3 Passos)

> Em todas as jornadas, a AjudaInteligente aparece como toast discreto ("Posso ajudar?") quando o trigger inteligente é ativado. O cidadão decide se aceita.

### Jornada 1 - Investigação de Salário (Joana, persona dominante)

```
1. Abre o TransparaMA, vê home com Gestão Pública em destaque
2. Toca na busca, digita "remuneração servidor educação"
   → Página de busca abre com:
     - Dashboard inicial (top termos buscados, métricas)
     - Resultados do termo
3. Após 10s, toast aparece: "Posso ajudar a refinar?"
   → Aceita, drawer abre lateral
   → IA: "Quer ver por cargo? Por órgão? Acima de R$ X?"
   → Joana refina, vê o salário do servidor procurado
   → Glossário explica "Subsídio" no caminho
   → Joana clica "Compartilhar Zap" e manda no grupo
```

### Jornada 2 - Pagamento de Fornecedor (Joana, fornecedora)

```
1. Toca em "Gestão Pública"
2. Toca em "Pagamentos a Fornecedores"
3. Digita o CNPJ da empresa
   → Vê status de cada nota (empenho, liquidação, pagamento)
   → Glossário Vivo explica cada termo
   → Toast aparece: "Posso te avisar quando o próximo pagamento sair?"
   → (no MVP, mostra apenas a interface; em produção, alerta opt-in)
```

### Jornada 3 - Investigação Jornalística (Ana)

```
1. Abre o TransparaMA, digita na busca:
   "quanto foi gasto com merenda em São Luís nos últimos 6 meses?"
2. Resultados aparecem, mas a query é complexa
   → Toast aparece imediatamente: "Posso te ajudar com essa pergunta?"
3. Drawer abre, IA responde com:
   → Gráfico, valor consolidado, fontes oficiais linkadas
   → Botão "Exportar CSV" + "Compartilhar Zap"
   → Sugestão: "Quer comparar com Imperatriz?"
```

### Jornada 4 - Programa Social (Dona Maria, persona aspiracional)

```
1. Abre o TransparaMA no celular
2. Toca no card "Programas Sociais"
3. Toca em "Maranhão Livre da Fome"
   → Vê resumo + critérios + botão "Como Participar"
   → Termo técnico clicável (Glossário Vivo) se aparecer
   → Toast da AjudaInteligente: "Tem dúvida sobre como participar?"
```

### Jornada 5 - Vagas em Escolas (Carlos, persona aspiracional)

```
1. Abre o TransparaMA, digita na busca:
   "tem vaga na escola perto de casa?"
2. Resultado vazio (busca complexa, mobile)
   → Toast aparece: "Posso te ajudar?" (trigger: zero results)
3. Drawer abre, IA pergunta o município
   → Mostra escolas próximas, vagas, status de obras
   → Carlos compartilha no Zap dos pais da escola
```

### Jornada 6 - Publicação de Dados (STC, Fase 2 do roadmap)

```
1. Servidor da SEDUC entra no painel admin
2. Faz upload da planilha de gastos do mês
3. Sistema valida, mostra preview e publica
   → Auditoria registra a operação completa
```

---

## Por que essas 5 personas

A escolha cobre 4 perfis cidadãos com necessidades distintas (vulnerabilidade, família, atividade econômica, controle social) mais a persona institucional (publicadores). Juntas, representam o uso real do portal e justificam cada decisão de produto:

- O **eixo Gestão Pública em destaque** existe por causa da Joana e da Ana (uso dominante)
- A **AjudaInteligente em busca** existe por causa de Joana e Ana (busca complexa fiscalizatória)
- A **arquitetura temática** existe por causa da Dona Maria e do Carlos (uso aspiracional)
- O **glossário vivo** existe por causa da Joana (termos como empenho, liquidação)
- O **filtro avançado e a API** existem por causa da Ana
- O **painel admin e a auditoria** existem por causa da STC

Se uma decisão de produto não serve a nenhuma das 5, ela está errada.

---

## Mapa Persona x Funcionalidade

| Funcionalidade | Joana | Ana | Maria | Carlos | STC |
|---|---|---|---|---|---|
| Eixo Gestão Pública | ⭐⭐⭐ | ⭐⭐⭐ | - | - | ⭐ |
| Eixos Saúde/Educação | - | ⭐⭐ | - | ⭐⭐⭐ | ⭐⭐ |
| Eixo Programas Sociais | - | ⭐ | ⭐⭐⭐ | - | ⭐⭐ |
| Busca em linguagem natural | ⭐⭐⭐ | ⭐⭐⭐ | ⭐ | ⭐⭐ | - |
| Dashboard inicial da busca | ⭐⭐⭐ | ⭐⭐ | ⭐ | ⭐ | - |
| AjudaInteligente (busca) | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | - |
| AjudaInteligente (explorer) | ⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ | - |
| Glossário Vivo | ⭐⭐⭐ | ⭐ | ⭐⭐⭐ | ⭐⭐ | - |
| Mapa do MA | ⭐ | ⭐⭐ | ⭐ | ⭐⭐⭐ | - |
| Compartilhar Zap | ⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | - |
| Exportar CSV/JSON | ⭐ | ⭐⭐⭐ | - | - | - |
| Painel Admin (Fase 2) | - | - | - | - | ⭐⭐⭐ |

**Insight:** a AjudaInteligente serve a TODAS as 4 personas cidadãs. É o componente com maior abrangência do produto. Justifica a priorização como must-have.

---
Criado por André Lopes
Desenvolvedor Fullstack
