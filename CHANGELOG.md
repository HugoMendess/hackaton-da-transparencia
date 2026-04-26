# Changelog

Todas as mudanças relevantes do Portal da Transparência (hackathon 2026)
serão documentadas aqui.

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/),
seguindo versionamento semântico [SemVer](https://semver.org/lang/pt-BR/).

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
