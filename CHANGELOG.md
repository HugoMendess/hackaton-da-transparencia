# Changelog

Todas as mudanças relevantes do Portal da Transparência (hackathon 2026)
serão documentadas aqui.

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/),
seguindo versionamento semântico [SemVer](https://semver.org/lang/pt-BR/).

---

## [0.7.0] - 2026-04-26

### Added

#### Catálogo de cargos diversificado (`/cargos`)
- **Nova rota `/cargos`** com catálogo completo dos 28 cargos da rede estadual,
  organizados por eixo da vida do cidadão. Resolve o problema do atalho
  "Por Cargo" da `/busca` que levava direto a "Professor" sem diversificação.
- **`data/cargos-catalog.ts`**: dataset com 28 cargos cobrindo os 9 eixos
  (Educação, Saúde, Segurança, Obras, Habitação, Programas Sociais,
  Cultura/Esporte, Meio Ambiente, Gestão Pública). Cada cargo tem nome,
  descrição cidadã, total de folha mensal, número de servidores, salário
  médio e flag `destaque` (Professor, Médico, Soldado PM).
- **`pages/Cargos.tsx`**: grid responsivo (1/2/3/4 colunas), filtro por
  texto e por eixo, header agregando 3 stats (cargos exibidos, folha total,
  servidores). Cards clicáveis levam para `/detalhe?tipo=cargo&q=<cargo>&eixo=<slug>`.

#### Extrato individual do servidor (`/servidor`)
- **Nova rota `/servidor`** com extrato completo do servidor, acessada via
  botão "Ver completo" em cada breakdown da `/detalhe`.
- **`pages/Servidor.tsx`** com layout em 4 camadas:
  - Header com avatar grande + nome + cargo (nível) + 4 cards de
    identificação (Órgão, Lotação, Admissão, CPF mascarado).
  - Panorama 2026 em 4 cards de resumo (Líquido mensal, Proventos no
    ano, Descontos no ano, Líquido no ano).
  - **Dashboard de gráficos no topo**: linha de evolução mensal com 3
    séries (Proventos, Descontos, Líquido), pizza de composição dos
    proventos, barras agrupadas Proventos vs Descontos.
  - **Tabela mensal completa**: 10 rubricas × 12 meses (Jan a Dez), com
    coluna sticky, linhas-totais coloridas (Total Proventos verde, Total
    Descontos vermelho, Líquido azul) e zeros renderizados como `—`.
- **Histórico mensal realista**: junho recebe terço de férias (+33%),
  dezembro recebe 13º (+85%), demais meses estáveis. Implementado em
  `gerarHistoricoMensal` (data/servidores.ts).

#### Lista de servidores no `/detalhe` (tipo=cargo)
- **`ListaServidoresCargo`** substitui a tabela genérica de transações
  quando o cidadão pesquisa por cargo. Mostra 8-12 servidores em cards
  clicáveis com nome, cargo+nível, órgão, lotação e líquido mensal.
- **`BreakdownServidor` expansível inline**: ao clicar no card, abre
  identificação (Lotação, Órgão, Admissão, CPF mascarado) + 2 colunas
  (Proventos verde, Descontos vermelho) + card destaque com Líquido
  azul + **botão "Ver completo"** levando para `/servidor`.

#### Chips de cargos populares no `ConsultaEspecifica`
- Quando o cidadão clica na aba "Por cargo", aparecem chips clicáveis
  pré-filtrados pelo eixo:
  - Educação: Professor, Diretor Escolar, Coordenador Pedagógico, Bibliotecário
  - Saúde: Médico, Enfermeiro, Técnico de Enfermagem, Farmacêutico
  - Segurança: Soldado, Sargento, Delegado, Bombeiro, Agente Penitenciário
  - Obras: Engenheiro Civil, Arquiteto, Topógrafo, Técnico em Obras
  - (mais 5 eixos com cargos contextuais)
- Click no chip preenche o input e dispara a busca automaticamente.

#### Sugestões contextuais por eixo
- **`SUGESTOES_POR_EIXO`** no `ConsultaEspecifica` reescreve placeholder
  e texto de ajuda dos campos conforme o eixo onde o cidadão está.
  Em `/eixo/obras`, o campo "Por cargo" agora sugere "Engenheiro Civil,
  Técnico em Obras, Topógrafo" no lugar do genérico "professor, médico,
  soldado". Resolve o problema do cidadão pesquisar "Professor em Obras".

#### Página `/sobre` reescrita do zero com foco no Selo Diamante
- **Hero épico do Diamante**: gradient azul + pattern de pontos + 2 glows
  (white + secondary), `DiamanteVisual` custom (anel circular SVG com
  score 98,5% animado em mostarda + ícone Gem grande dourado com glow +
  badge flutuante "98,5/100"). Inclui 3 mini-selos de credibilidade
  (Top 1 Estado MA, Selo Diamante CGU, Score 98,5).
- **Timeline da evolução dos selos** (5 marcos: Ouro 2020, Prata 2021,
  Bronze 2022, Diamante 2023+2024) com linha conectora horizontal em
  gradient amber→orange→primary e badge "atual" no Diamante consecutivo.
- **Dashboard de critérios da CGU**: 8 critérios com progress bars
  individuais somando 98,5/100. Inclui card de compromisso da nova
  versão (manter Diamante, elevar para 100/100, preservar 115 categorias,
  redirecionar URLs, auditoria diária).
- **Significado pro cidadão** em 4 cards (Tempo real, Completo, Visível,
  Auditado) com explicação cidadã + nota técnica.
- **Métricas reais** em 4 cards coloridos (320 mil usuários, 4 milhões
  de visualizações, +1.144% busca, 56% mobile).
- **Problema vs Solução** lado a lado, **6 Diferenciais**, **Stack
  tecnológica em 3 blocos** (Frontend, Backend, IA/DevOps), **Equipe**
  com 3 cards (André, Alexandre, Alexsander), **Compliance** com 6 leis,
  **CTA final** com mesmo gradient do hero.

### Changed

#### Schema cromático rotativo nos cards de `/sobre`
- **`TEMAS_CARD`** com 4 cores institucionais (azul, vermelho, verde,
  laranja) aplicadas como faixa inferior nos cards repetidos
  (CardCriterio, CardSignificado, Diferencial, BlocoStack, CardEquipe).
- Mesmo padrão usado nos cards de eixo da home (faixa colorida no
  bottom + animação `group-hover:h-1.5`).
- `CardMetrica` ganhou prop `cor: "primary" | "success" | "orange" |
  "destructive"` substituindo o anterior `secondary` por `orange` para
  alinhar ao schema.

#### Atalho "Por Cargo" da `/busca` agora navega para `/cargos`
- Antes: clicar no card "Por Cargo" disparava `aplicarTermo("Professor",
  "cargo")` indo direto para resultados de Professor.
- Depois: clicar navega para `/cargos` (catálogo diversificado).

#### Resultados de "Professor" na `/busca` diversificados
- **`gerarResultados`** detecta o caso especial cargo=Professor e gera
  8-19 cards distintos com formato "Nome - Professor (Nível)" no lugar
  de "Professor - X" repetido em todos os eixos. Restringe os resultados
  ao eixo Educação (em vez de ciclar entre todos), usa tipos de despesa
  específicos para servidor (Folha, Empenhos, Pagamentos, Diárias,
  Despesa Consolidada) e valores compatíveis com folha (R$ 5k a R$ 45k
  no lugar de R$ 12 mi a R$ 280 mi).

#### Detalhe corrige automaticamente o eixo pelo cargo
- **`CARGO_PARA_EIXO`** no `data/servidores.ts` mapeia 16 cargos para
  seu eixo correto e órgãos prováveis (Professor → Educação SEDUC/IEMA;
  Médico → Saúde SES/EMSERH; Soldado → Segurança PMMA, etc.).
- `useMemo` no Detalhe corrige o eixoSlug se a URL veio com o eixo
  errado (ex: `eixo=obras` + cargo=professor vira `eixo=educacao`).
- Tabela de transações usa órgãos do cargo (Professor → SEDUC/IEMA/UEMA
  no lugar de SES/PMMA aleatórios).
- Natureza da transação fixa em "Pessoal" para tipo=cargo (no lugar
  de "Serviços de terceiros" aleatório).
- Valores compatíveis com folha (R$ 5k-45k) no lugar do range genérico
  R$ 12mi-280mi.
- Status prioriza Pago e Liquidado (folha não fica empenhada por muito
  tempo).

#### Nomes fictícios e níveis do magistério no Detalhe
- **`NOMES_FICTICIOS`**: 15 nomes brasileiros genéricos (João Silva,
  Maria Antônio, Maria Gular, José Pereira, Ana Sousa, Carlos Oliveira,
  Fernanda Lima, Marcos Souza, Luiza Castro, Paulo Mendes, Beatriz
  Ferreira, Roberto Almeida, Patrícia Rocha, Antônio Carlos, Cláudia
  Nunes). Substituem "Folha de Professor" repetido 15 vezes por
  "Folha de João Silva", "Folha de Maria Antônio", etc.
- **`NIVEIS_PROFESSOR`**: 5 níveis do plano de cargos do magistério
  (Médio, Superior, Especialista, Mestre, Doutor). Aplicados quando
  o cargo pesquisado contém "professor". Resultado: "Folha de João
  Silva (Especialista)" em cada linha.

### Fixed

#### Resultados clicáveis no `ConsultaEspecifica`
- O `<article>` decorativo dos resultados agora é um `<Link>` real
  apontando para `/detalhe?q=<filtro>&tipo=<tipo>&eixo=<eixoSlug>`.
- Mapeamento `TIPO_PARA_DETALHE` traduz `servidor` → `cargo` (a rota
  `/detalhe` espera `tipo=cargo`).
- A11y: adicionados `aria-label`, `focus-visible:ring-2`, e o
  `ArrowRight` agora aparece em mobile também (não só em sm:).

#### Badge "atual" do Diamante 2023/2024 estava clipada
- O `overflow-hidden` adicionado no `CardSelo` durante o teste de
  bordas vermelhas estava clipando a badge `-top-2`. Removido,
  mantendo só o `relative` original. A badge mostarda volta a aparecer.

### Refactored

#### Extração para `data/servidores.ts`
- Movidos do `Detalhe.tsx` para `data/servidores.ts`:
  - Tipo `Servidor` (15 campos: nome, cargo, lotação, admissão,
    proventos, descontos, líquido).
  - Tipo `CargoMeta` e mapa `CARGO_PARA_EIXO` (16 cargos).
  - Função `identificarCargo` (substring match case-insensitive).
  - Função `gerarServidores` (gerador determinístico com seed +
    índice, salário-base por nível do magistério).
  - Função `gerarHistoricoMensal` (NEW): gera 12 meses com variações
    realistas (terço de férias em junho, 13º em dezembro).
  - Constantes `NOMES_FICTICIOS`, `NIVEIS_PROFESSOR`, `LOTACOES_POR_EIXO`.
- Compartilhado entre `/detalhe` (lista de cards) e `/servidor`
  (extrato completo). Geração 100% determinística garante que a
  mesma URL sempre retorna o mesmo servidor sem persistir estado
  entre páginas.
- Removidas ~110 linhas duplicadas do `Detalhe.tsx`.

---

## [0.6.0] - 2026-04-26

### Added
- **Filtro de cidade na página /mapa**: novo componente `FiltroMunicipio`
  com autocomplete dos 217 municípios. Busca com normalização de acento,
  ranking por relevância (prefixo > substring), navegação por teclado
  (↑↓ Enter Esc), highlight do match com `<mark>`. Resolve a barreira
  do cidadão que não sabe a localização geográfica da cidade no mapa.
- **Atalhos de seção no Header (desktop)**: 3 novos botões centralizados
  entre o logo e a nav direita, sem alterar os ícones existentes:
  - "Dados do Portal" (BarChart3) → `#portal-hoje`
  - "Começar Aqui" (Compass) → `#eixos`
  - "Sobre o Portal" (Info) → `/sobre`
- **ScrollToTop com hash navigation**: agora trata `#ancora` em
  navegações cross-page com `requestAnimationFrame` + `scrollIntoView`
  para garantir que o elemento já está montado antes do scroll.
- **MetricasDestaque com `id="portal-hoje"` + `scroll-mt-20`**: section
  alvo do atalho "Dados do Portal" no menu.
- **Painel município no /mapa com indicadores visuais**: dois mini-cards
  (Obras laranja, Servidores verde) com gradient + sombra colorida +
  mini progress bar mostrando % do total estadual.

### Changed
- **Refino visual completo da home (cards de métricas + eixos)**:
  multi-layer shadow, hover lift `-translate-y-0.5`, gradients sutis no
  destaque, glow decorativo no canto, microinteração de scale no ícone,
  border-radius `rounded-xl`. Aplicado em `MetricasDestaque`, `EixoGrid`
  e `CardResumo`.
- **Refino visual completo da página /busca**: mesmo padrão da home
  aplicado em atalhos por tipo (4 cards com tema azul/vermelho/verde/
  laranja), cards de resultado (acento lateral azul no hover), botão
  "Buscar" com gradient + shadow azul, sub-cards do dashboard.
- **DashboardInicial redesenhado criativo**:
  - **Termos mais buscados**: top 3 como podium (medalha ouro/prata/
    bronze), restante como pills neutras, badge "🔥 HOT" pulsando no #1
  - **Métricas em destaque**: gauge circular SVG animado (98,5/100)
    com gradiente azul + 2 mini-cards (Selo Diamante mostarda,
    Categorias azul)
  - **Atualizações recentes**: timeline horizontal com bolinhas
    conectadas, item "hoje" pulsando (`animate-ping`)
- **Refino visual completo da /mapa**:
  - Hero com glow azul + dicas de uso em pills
  - Card "Maranhão consolidado" com gradient + ícone TrendingUp
  - Painel de município com animação de entrada slide-in-from-right
  - Estado vazio com ícone circular + texto convidativo
  - Container do mapa com border `border/70` + multi-layer shadow
  - Painel lateral aumentado de 320px → 360px
- **Município selecionado no mapa em vermelho institucional**: era verde
  escuro `#0F7B40`, agora `#DC2626` com border `#7F1D1D` 2.5px.
  Cria contraste máximo contra o gradiente verde do mapa.
- **Cards no padrão "tema institucional"**: 4 cores STC (azul, vermelho,
  verde, laranja) aplicadas via objeto `TEMAS` reutilizável em
  `MetricasDestaque` e `Atalhos da /busca`.
- **Logo aumentado** no Header: `h-9` → `h-11` → `h-14` (default).
- **Ícone "Dados do Portal"**: trocado de `Search` para `BarChart3`
  (mais semântico, evita duplicação com o Buscar da nav direita).

### Fixed
- **Barra colorida institucional renderizando 4 segmentos em vez de 5**:
  `success` e `info` não estavam declarados no `tailwind.config.js` como
  classes utilitárias (existiam só como variáveis CSS). `bg-success` era
  classe inexistente, virava transparente.
- **Ícones coloridos persistindo no alto contraste**: agora todos os
  cards de métrica, atalhos da busca, podium, mini-cards e elementos do
  mapa viram silhuetas brancas uniformes em alto contraste, respeitando
  o WCAG AAA (que prioriza contraste de luminância sobre matiz).
- **Texto do badge "Hackathon" ilegível em alto contraste**: tinha
  `text-primary-foreground` que vira preto em alto contraste, sobre
  fundo cinza escuro. Forçado para branco via override CSS.
- **Traço amarelo sob "Maranhão" no hero persistindo em alto contraste**:
  trocado para branco/40 sutil quando alto contraste ativo.

### Security
- (Sem mudanças nesta versão.)

---

## [0.5.0] - 2026-04-26 (manhã)

### Added
- **Paleta institucional STC**: tokens HSL atualizados em `:root`,
  `.dark` e `.high-contrast` para refletir a identidade do governo:
  - Primary: azul `HSL(215 65% 38%)` ~`#225AA1` (lupa do logo)
  - Secondary: mostarda `HSL(42 78% 48%)` ~`#D9A123`
  - Destructive: vermelho `HSL(0 72% 48%)` ~`#D62B2B`
  - Foreground: preto `HSL(222 47% 11%)`
- **`BarraInstitucional`**: novo componente reutilizável com 5 segmentos
  iguais (vermelho/azul/verde/amarelo/laranja). Aplicado no rodapé do
  Header (h-1) e do Hero (h-2).
- **Tema por card de métrica**: 4 cores institucionais aplicadas em
  ícone, faixa inferior e glow decorativo de cada card.
- **Tokens `success` e `info`** no `tailwind.config.js`.

### Changed
- **PDF do Memorial**: cores RGB atualizadas para azul institucional
  `RGB(34, 90, 161)`, faixa branca com borda azul + logo oficial.
- **Logo institucional**: substituído SVG genérico pelo PNG oficial do
  Portal da Transparência (`nova_logo_portal_transparencia_26_08_2022.png`),
  com filtro CSS `brightness(0) invert(1)` no alto contraste para virar
  silhueta branca.

### Fixed
- **5 resíduos lowercase "transparama"** trocados para
  "portal-transparencia" (storage keys do localStorage e CustomEvent
  name) + 2 docs.

---

## [0.4.0] - 2026-04-25 (tarde)

### Added
- **Rebrand "TransparaMA" → "Portal da Transparência"**: 33 arquivos
  atualizados (código + docs + migrations + 7 entradas no `ia_cache` do
  banco). Logo oficial PNG do Portal MA usado em Header, Footer e PDF.
- **AjudaInteligente com RAG primitivo**: Edge Function `/ask` v23
  embute snapshot do `EIXOS_DATA` e injeta no prompt do Claude com
  matching por palavra-chave dos 9 eixos.
- **Multi-turn com histórico de até 10 interações**: hook envia
  histórico, Edge Function valida cada mensagem, deduplica roles
  consecutivas, garante array começando com `user`. Cache só ativa
  quando histórico vazio.
- **Integração com API pública do Portal MA**: `/api/consulta-unidades`
  (157 unidades estáveis). Cache em memória 1h, fail-open se API cair.
- **Persona corrigida** no system prompt: "VOCÊ É O PORTAL", não manda
  cidadão para fora, URLs sempre internas (`/eixo/X`, `/busca`, `/mapa`).
- **Botão Compartilhar via WhatsApp** (Web Share API + fallback wa.me)
  em página de eixo, busca/detalhe e painel de município no mapa.
- **Memorial PDF do eixo** com jspdf (capa, RAG, gráficos, fontes).
- **Página /sobre** com problema, solução, diferenciais, stack e equipe.

---

## [0.3.x e anteriores]

Versões consolidadas no histórico do git:
- `7bfd766`: Toast IA "Posso ajudar?" automático na Busca + 3 cenários
- `1c323f3`: Correções da auditoria + bug de normalização Unicode
- `99c6fdc`: Pitch reestruturado em 3min + wireframes
- `a9b1e58`: AjudaInteligente com Claude Haiku 4.5 + cache pré-populado
- `1efc8d3`: Datasets dos 6 eixos faltantes
- `91d25d2`: Painel de acessibilidade + hero refinado
- `e868544`: Hero com palácio + identidade visual MA
- `21be747`: Drill-down por categoria no município selecionado
- `03d8109`: Página de detalhe do termo no lugar do redirect ao eixo
- `c45fd95`: Botão voltar inteligente + paginação completa na busca

---

Criado por André Lopes
Desenvolvedor Fullstack
