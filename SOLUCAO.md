# 💡 SOLUÇÃO - TransparaMA, o Novo Portal da Transparência do MA

## Visão

O **TransparaMA** é o futuro Portal da Transparência do Maranhão. Substitui o portal atual mantendo o compliance Diamante e elevando o portal a um patamar de utilidade social: navegação por temas do cotidiano, mobile-first nativo, glossário vivo, busca em linguagem natural e ajuda inteligente contextual com acesso real ao banco de dados.

> *"Transparência de verdade é aquela que o cidadão entende, encontra e compartilha."*

---

## Posicionamento

O TransparaMA não é uma camada sobre o portal existente. É a **próxima geração do portal**, projetada como produto. A STC continua como gestora oficial. Os dados continuam sendo os mesmos dados públicos. O que muda é a experiência, a arquitetura de informação e o motor que conecta o cidadão ao dado.

| | Portal Atual | TransparaMA (Novo Portal) |
|---|---|---|
| Arquitetura de informação | Lógica contábil do Estado | Eixos de vida do cidadão (com Gestão Pública promovida) |
| Passos para encontrar | 5 a 10 cliques | Máximo 3 |
| Linguagem | Técnica e jurídica | Cidadã, com glossário vivo |
| Visualização | Tabelas brutas | Cards de resumo, gráficos contextualizados |
| Mobile | Quebra (155s mobile vs 325s desktop) | Mobile-first nativo, PWA |
| Acessibilidade | Básica | WCAG 2.1 AA + e-MAG |
| Glossário | Não existe | Integrado e automático |
| IA com acesso ao banco | **Não existe** | **Sim, via AjudaInteligente** |
| Página de busca | Lista vazia até clicar | Dashboard inicial com termos mais buscados, métricas, novidades |
| Compliance | Selo Diamante 98,5 | Mantém e amplia |
| Cobertura | 115 categorias | 115 categorias no roadmap, 2 a 3 no MVP |

---

## Princípios de Design

| Princípio | Tradução prática |
|---|---|
| Regra dos 3 Passos | Qualquer informação acessível em até 3 interações |
| Mobile First | Construído para celular, expandido para desktop |
| Zero Jargão no Caminho | Nenhum termo técnico no fluxo principal de navegação |
| Contexto Sempre | Todo dado vem com narrativa que o explica |
| Ajuda Discreta | A IA aparece quando faz sentido, não interrompe |
| Acessibilidade Não-Negociável | WCAG 2.1 AA e e-MAG desde o primeiro pixel |

---

## Arquitetura de Informação

### Eixos de Vida (substituem os menus contábeis)

```
👥 Gestão Pública  ← em destaque (72% do uso real do portal está aqui)
   → Servidores, salários, fornecedores, contratos, licitações, diárias

🏥 Saúde e Bem-Estar
   → Hospitais, medicamentos, programas, escalas

📚 Educação e Futuro
   → Vagas, gastos por escola, merenda, transporte, bolsas

🛡️ Segurança Pública
   → Polícia, bombeiros, defesa civil, viaturas

🏘️ Habitação e Cidade
   → Programas habitacionais, regularização

🤝 Programas Sociais
   → Maranhão Livre da Fome, auxílios, benefícios

🛣️ Obras e Infraestrutura
   → Mapa de obras, status, fotos, valores, prazos
```

> **Decisão crítica baseada em dados reais (DADOS_REAIS.md):** Gestão Pública (servidores + fornecedores + contratos) é o eixo dominante por uso real. 72% das visualizações do portal atual estão em Remuneração + Ficha Financeira. Ele entra no topo da home, não no fim.

### Atalhos da Home (entradas rápidas)

A home traz, além dos 7 eixos, atalhos para as buscas mais frequentes:

```
🔍 Buscas frequentes
   - Remuneração de servidor X
   - Fornecedor Y
   - Contrato Z
   - Diárias do mês
```

A apresentação oficial da STC de 2022 já previa esse atalho ("Mais Buscados"). O TransparaMA materializa com dados reais em tempo real.

---

## Componentes-Chave do Sistema

### 1. 🤖 AjudaInteligente (a IA do TransparaMA)

A IA do TransparaMA não é um produto à parte com persona própria. É uma **camada inteligente embutida na jornada do cidadão**, que aparece quando faz sentido. Inspirada no padrão da Alura (assistente lateral discreto).

**Posicionamento estratégico:** a Juçara (chatbot oficial usado em vários portais do governo) continua existindo e funcionando como atendente virtual. O TransparaMA não substitui a Juçara, complementa: traz acesso real ao banco de dados, coisa que a Juçara não tem hoje.

**Como aparece:**
- Toast discreto "Posso ajudar?" no canto inferior direito
- Cidadão clica no toast -> abre drawer lateral à direita (estilo Alura)
- Drawer fecha facilmente, não invade

**Quando aparece (entry points):**

#### Entry point 1 - Na Busca Avançada (principal)

```
Cidadão digita "merenda escolar Imperatriz"
     ↓
Resultados aparecem normalmente
     ↓
Toast aparece: "Posso ajudar a refinar essa busca?"
     ↓
Cidadão clica -> drawer abre com contexto da busca
     ↓
IA conversa: "Você quer ver valores totais? Por escola?
            Por período? Posso te ajudar a chegar lá."
```

**Triggers do toast na busca:**
- Busca retornou muitos resultados (>20)
- Busca retornou zero resultados
- Cidadão fica >10s olhando os resultados
- Busca em linguagem natural complexa (>4 palavras)

#### Entry point 2 - Nos Dashboards (Explorer)

```
Cidadão está vendo "R$ 2,3 bi em Saúde"
     ↓
Ícone discreto 💡 no canto do card
     ↓
Cidadão clica -> drawer abre
     ↓
IA explica: "Este valor representa 28% do orçamento
            estadual, 12% acima de 2025. A maior parte
            (R$ 800 mi) foi para hospitais públicos.
            Quer ver o detalhamento?"
```

**Triggers do explorer:**
- Botão 💡 em todo card e gráfico significativo
- Toast proativo após 15s no mesmo dado
- Aparece ao clicar em termo do glossário (continuação da conversa)

**Comportamento NÃO desejado:**
- Sem barra fixa no topo
- Sem FAB redondo de chat
- Sem persona explícita ("Assistente Cidadão", "Juçara IA", etc.)
- Sem sobreposição de função com a Juçara

**Salvaguardas (responsabilidade do Alexandre):**
- RAG estrito sobre dados oficiais via pgvector
- Toda resposta cita fonte
- Rate limiting por IP/sessão
- Anti prompt injection
- LGPD: pergunta não vinculada a IP nos logs
- Bloqueio de busca por CPF/RG/dados sensíveis (a planilha de buscas mostra que o portal atual permite isso)

### 2. 📊 Dashboard Inicial nas Páginas de Busca

**Problema atual:** as páginas de busca do Portal MA hoje não trazem nada visual. Lista vazia até o cidadão digitar e clicar buscar.

**Solução TransparaMA:** primeira dobra das páginas de busca traz contexto visual imediato.

```
┌────────────────────────────────────────────────────┐
│ 🔍 Pesquise em linguagem natural ou por termo      │
│ [_____________________________________________]   │
└────────────────────────────────────────────────────┘

┌─ Termos mais buscados (últimos 30 dias) ──────────┐
│ Remuneração (10.948)  Folha de pagamento (4.449)  │
│ Servidores (2.792)    Contratos (2.365)           │
│ Diárias (1.019)       Licitação (1.264)           │
└───────────────────────────────────────────────────┘

┌─ Métricas em destaque ────────────────────────────┐
│ R$ X bi gastos em 2026                            │
│ Y mil servidores ativos                           │
│ Z mil contratos vigentes                          │
│ W obras em andamento                              │
└───────────────────────────────────────────────────┘

┌─ Atualizações recentes ───────────────────────────┐
│ Última atualização da Remuneração: hoje 03h       │
│ 12 novos contratos publicados esta semana         │
│ 47 atualizações na Saúde nos últimos 7 dias       │
└───────────────────────────────────────────────────┘
```

A apresentação oficial da STC de 2022 já mencionou *"atalhos: Mais Buscados, Presença do Estado"* como direção desejada. O TransparaMA materializa.

### 3. 📖 Glossário Vivo

Detector automático de termos técnicos no conteúdo. Ao toque ou hover, exibe explicação em linguagem simples, exemplo prático e link para aprofundamento.

- Base inicial: 30 termos curados (ver `GLOSSARIO.md`)
- Atualização contínua: novos termos detectados podem ser explicados via IA e revisados pela STC
- Acessível: anunciado por leitores de tela, navegável por teclado
- Botão "Quer saber mais?" abre o drawer da AjudaInteligente

### 4. 📊 Cards de Resumo (Data Storytelling)

Toda página de tema abre com cards visuais que comunicam o essencial em 3 segundos.

```
┌──────────────────────┐  ┌──────────────────────┐
│ R$ 2,3 bi            │  │ 412 hospitais        │
│ Investido em saúde   │  │ Atendendo no Estado  │
│ em 2026              │  │ +12 vs. 2025         │
│ 28% do orçamento     │  │                      │
│ 💡 Entender este     │  │ 💡 Ver no mapa       │
└──────────────────────┘  └──────────────────────┘
```

Cada card pode disparar a AjudaInteligente para aprofundar contextualmente.

### 5. 📲 Compartilhar Zap

Botão presente em todo dado relevante. Gera uma imagem (card visual) pronta para WhatsApp, Instagram e Twitter, com a marca do TransparaMA, o dado e a fonte oficial.

### 6. 🗺️ Mapa do Maranhão

Mapa interativo dos 217 municípios coloridos por indicadores de gasto público.

### 7. ♿ Camada de Acessibilidade Persistente

- Alto contraste (toggle)
- Aumento de fonte
- Leitor de tela com narrativa otimizada
- Modo de navegação simplificada (apenas texto, sem imagens)
- Atalhos de teclado documentados

### 8. 👤 Área Administrativa (Produção)

Painel para órgãos publicadores e equipe da STC. Não faz parte do MVP do hackathon, está descrita em `ARQUITETURA.md`.

---

## Jornada do Cidadão

### Fluxo padrão

```
1. Cidadão abre o TransparaMA no celular
   → PWA carrega instantaneamente, mesmo em 3G

2. Vê:
   - Barra de busca em destaque (CTA principal)
   - 7 eixos com Gestão Pública no topo
   - Atalhos: Buscas frequentes, Métricas em destaque

3. Caminho A (Busca): digita "salário do governador"
   → Resultados + Toast "Posso ajudar?" aparece após 10s
   → Cidadão clica -> AjudaInteligente refina e responde

4. Caminho B (Eixo): toca em "Educação"
   → Dashboard com cards, gráficos, lista de programas
   → Pode tocar em 💡 para entender qualquer card

5. Caminho C (Mapa): toca no município
   → Painel local com gastos, obras e contratos

6. Em qualquer caminho:
   → Termo técnico é clicável (glossário vivo)
   → Botão "Compartilhar Zap" gera imagem
   → Acessibilidade ativa
```

**Sempre 3 passos. Sempre sem jargão. Sempre no celular.**

---

## MVP do Hackathon (48h)

> O MVP é um protótipo de prova de viabilidade. Demonstra como o portal final será.

### Must Have
- [ ] Tela inicial com 7 eixos temáticos (Gestão Pública em destaque)
- [ ] Dashboard funcional de pelo menos 2 eixos (Educação + Gestão Pública)
- [ ] Cards de resumo em cada dashboard
- [ ] Pelo menos 2 gráficos por dashboard
- [ ] Glossário vivo funcionando em 10+ termos
- [ ] **Página de busca com dashboard inicial** (termos mais buscados + métricas + novidades)
- [ ] **AjudaInteligente** com toast discreto + drawer lateral funcionando na busca
- [ ] **AjudaInteligente** respondendo as 4 perguntas-âncora oficiais da banca
- [ ] Interface mobile-first responsiva e touch-friendly
- [ ] Deploy online (Vercel) com URL pública
- [ ] Memorial descritivo entregue (PDF)

### Should Have
- [ ] AjudaInteligente também no Explorer (botão 💡 nos cards)
- [ ] Botão Compartilhar Zap gerando imagem
- [ ] Mapa do Maranhão com pelo menos 3 indicadores por município
- [ ] Modo de alto contraste
- [ ] Dashboard de mais 1 ou 2 eixos
- [ ] Cache de respostas da IA no Supabase (perguntas similares)

### Could Have
- [ ] AjudaInteligente aberto (qualquer pergunta dentro do dataset)
- [ ] Série histórica comparativa
- [ ] Detalhamento de contratos por município
- [ ] Modo navegação simplificada (acessibilidade)
- [ ] PWA básica (instalável)

### Won't Have
- [ ] Backend em produção com dados em tempo real (usaremos Supabase + API oficial)
- [ ] Painel administrativo para órgãos
- [ ] Cobertura das 115 categorias (focamos em 2 a 3)
- [ ] Autenticação de gestores

---

## Perguntas-Âncora Oficiais (Entrega Obrigatória)

A banca exige resposta a pelo menos 1. Vamos responder as 4 com a AjudaInteligente:

| Pergunta-âncora | Como o TransparaMA responde |
|---|---|
| *"Quanto o governo gastou com saúde esse ano?"* | Eixo Saúde → Card de resumo → AjudaInteligente detalha |
| *"As obras de educação estão sendo executadas?"* | Eixo Educação → Lista de obras com status → Mapa |
| *"Quanto custa a folha de servidores por mês?"* | Eixo Gestão Pública → Card "Folha do mês" → AjudaInteligente compara |
| *"Quais contratos estão ativos no meu município?"* | Mapa → Município → Lista de contratos vigentes |

---

## Roadmap Pós-Hackathon (Visão de Produto)

| Fase | Duração | Entregáveis |
|---|---|---|
| **Fase 0 - MVP Hackathon** | 48h | Protótipo funcional com 2 a 3 eixos, AjudaInteligente, deploy público |
| **Fase 1 - Piloto STC** | 1 mês | Refino com a STC, ampliação para 7 eixos, integração com 1 sistema oficial |
| **Fase 2 - Backend e Admin** | 3 meses | API própria, ingestão automatizada, painel admin para órgãos |
| **Fase 3 - Cobertura Plena** | 6 meses | Todas as 115 categorias, IA com dados em tempo real, auditoria completa |
| **Fase 4 - Substituição** | 9 meses | Coexistência com o portal antigo, redirecionamentos, comunicação com cidadãos |
| **Fase 5 - Portal Único** | 12 meses | TransparaMA como único portal oficial, portal antigo arquivado |

---

## KPIs de Sucesso

| KPI | Meta | Linha de base atual |
|---|---|---|
| Tempo médio para encontrar info | Máximo 3 toques | 5 a 10 cliques |
| Tempo de engajamento mobile | +60% | 155s (atual) |
| Taxa de uso do AjudaInteligente | 30% das buscas | N/A (não existe) |
| Score WCAG | AA em 100% das páginas | Básico |
| Score Selo Diamante | 100/100 | 98,5 |
| Perguntas respondidas pela IA | 80% sem fallback humano | N/A |
| Compartilhamentos em redes sociais | 10.000/mês | Quase zero (PDF não viraliza) |

---
Criado por André Lopes
Desenvolvedor Fullstack
