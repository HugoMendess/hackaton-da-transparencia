# 🎨 IMAGENS NECESSÁRIAS - TransparaMA

> Lista de assets visuais que a equipe precisa gerar para elevar o frontend ao nível visual de portais de referência (SP, GO) e superar o Portal MA atual.

**Pasta de destino:** `frontend/public/images/`

Todas as imagens devem ser otimizadas em **WebP** (ou AVIF) com fallback PNG quando necessário, para manter o LCP baixo no celular.

---

## Prioridade 1 - Hero (impacto visual imediato)

### 1. `hero-ma.webp` (background do hero da home)
- **Dimensões:** 1920 × 1080 (desktop) + versão mobile 1024 × 1280
- **Onde aparece:** atrás do título principal na home
- **Conceito:** vista institucional de São Luís ou Palácio dos Leões, com tratamento visual sutil (overlay verde primário ~70% opacidade)
- **Atributos:** alt vazio (decorativa), `loading="eager"` no componente Hero
- **Prompt para IA (Midjourney/Imagen):**
  > "Aerial photo of São Luís Maranhão historic center at golden hour, blue sky, photorealistic, cinematic, depth of field, institutional --ar 16:9 --style raw"
- **Substitui:** padrão geométrico SVG atual em `Hero.tsx`

### 2. `hero-ma-mobile.webp`
- **Dimensões:** 1024 × 1280 (vertical para mobile)
- **Conceito:** mesma cena enquadrada vertical, com o título caber em cima
- **Onde aparece:** mesmo hero, breakpoint `sm:`

---

## Prioridade 2 - Identidade

### 3. `og-image.png` (compartilhamento social)
- **Dimensões:** 1200 × 630 (padrão Open Graph)
- **Onde aparece:** preview ao compartilhar no WhatsApp, LinkedIn, Twitter
- **Conteúdo:** logo TransparaMA + tagline "O futuro Portal da Transparência do Maranhão" + brasão do MA estilizado em canto + cor de fundo verde primário (#0F7B40)
- **Tipografia:** Playfair Display Bold para o nome, Inter Medium para a tagline

### 4. `favicon.svg` (já existe Vite default, substituir)
- **Dimensões:** 32 × 32 e 64 × 64 (raster fallback)
- **Conceito:** colunata grega estilizada (mesma do componente `Logo.tsx`)
- **Variações:** light e dark mode (definir via `<link media="(prefers-color-scheme: dark)">`)

### 5. `apple-touch-icon.png`
- **Dimensões:** 180 × 180
- **Conceito:** ícone TransparaMA com fundo verde primário sólido + colunata branca centralizada
- **Onde aparece:** quando o cidadão adiciona como PWA no iPhone

### 6. `brasao-ma-stilizado.svg`
- **Dimensões:** vetor (200 × 200 base)
- **Onde aparece:** Footer e como decoração sutil no Hero
- **Conceito:** brasão do Maranhão simplificado, monocromático em verde primário ou dourado, traços modernos

---

## Prioridade 3 - Eixos temáticos (thumbnails)

Localização: `frontend/public/images/eixos/`. Aparecem como decoração superior nos cards de eixo na home (substituindo o background atual `bg-accent/30`).

| Slug | Arquivo | Conceito |
|---|---|---|
| `gestao-publica` | `eixo-gestao.webp` | Servidores públicos genéricos no atendimento, tons azul/cinza |
| `saude` | `eixo-saude.webp` | UTI ou hospital público maranhense, tom verde água sutil |
| `educacao` | `eixo-educacao.webp` | Sala de aula da rede pública, livros, crianças (sem rostos identificáveis por LGPD) |
| `seguranca` | `eixo-seguranca.webp` | Polícia/bombeiro do MA em ação institucional |
| `habitacao` | `eixo-habitacao.webp` | Casa/conjunto habitacional popular |
| `programas-sociais` | `eixo-sociais.webp` | Mãos recebendo cesta básica/auxílio, tom emocional |
| `obras` | `eixo-obras.webp` | Obra pública em andamento, capacete, andaime |

**Dimensões:** 800 × 450 (16:9). Usar gradient overlay no CSS para legibilidade do texto sobre a imagem.

**Atenção LGPD:** **nenhuma pessoa identificável** nas fotos. Usar imagens genéricas, planos abertos, costas, ângulos sem rosto.

---

## Prioridade 4 - Estados e ilustrações

### 7. `empty-em-construcao.svg`
- **Dimensões:** vetor (400 × 300 base)
- **Onde aparece:** componente `EmConstrucao` em `pages/Eixo.tsx`
- **Conceito:** ilustração minimalista de um cone de obras/colunata em andamento, tons primários do tema

### 8. `empty-nao-encontrado.svg`
- **Dimensões:** vetor (400 × 300 base)
- **Onde aparece:** componente `NaoEncontrado` em `pages/Eixo.tsx`
- **Conceito:** ilustração minimalista de mapa com pin perdido

### 9. `empty-sem-resultados.svg`
- **Dimensões:** vetor (400 × 300 base)
- **Onde aparece:** quando a busca retornar zero (próxima sprint)
- **Conceito:** lupa estilizada em monocromático

---

## Prioridade 5 - Compartilhar Zap (futuro)

### 10. Template `share-card-base.svg`
- **Dimensões:** 1080 × 1350 (formato story do Instagram, vertical)
- **Onde aparece:** template do botão "Compartilhar Zap"
- **Layout:** título do dado (ex: "R$ 2,3 bi com Saúde") + valor grande no centro + logo TransparaMA + URL do portal + brasão do MA pequeno
- **Tipografia:** Playfair Display Bold para o valor, Inter para o resto
- **Cor de fundo:** verde primário com gradient sutil

---

## Como entregar

1. Criar a pasta `frontend/public/images/` e subdiretórios necessários
2. Subir os arquivos com **nomes exatos** desta lista
3. Otimizar em [squoosh.app](https://squoosh.app) (WebP qualidade 80) antes de commitar
4. Reportar no chat do time qual imagem foi entregue para Claude integrar no código
5. **Não commitar imagens > 500 KB** sem otimização prévia

---

## Bibliotecas de stock recomendadas (uso comercial OK)

- [Unsplash](https://unsplash.com) - free, alta qualidade
- [Pexels](https://www.pexels.com) - free, brasileiro disponível
- [Wikimedia Commons](https://commons.wikimedia.org) - imagens institucionais do Maranhão (Palácio dos Leões, etc) com licenças abertas
- [Storyset](https://storyset.com) - ilustrações vetoriais grátis para empty states

---

## Geração via IA (Midjourney, DALL-E, Imagen)

Quando usar IA generativa, adicionar disclaimer no rodapé da página:
> "Algumas imagens decorativas foram geradas por IA e não representam pessoas ou cenas reais."

---

## Status atual

| # | Asset | Status |
|---|---|---|
| 1 | hero-ma.webp | Pendente (placeholder SVG ativo) |
| 2 | hero-ma-mobile.webp | Pendente |
| 3 | og-image.png | Pendente |
| 4 | favicon.svg | Pendente (Vite default ativo) |
| 5 | apple-touch-icon.png | Pendente |
| 6 | brasao-ma-stilizado.svg | Pendente |
| 7-13 | Thumbnails dos 7 eixos | Pendente |
| 14 | empty-em-construcao.svg | Pendente |
| 15 | empty-nao-encontrado.svg | Pendente |
| 16 | empty-sem-resultados.svg | Pendente |
| 17 | share-card-base.svg | Pendente (próxima sprint) |

---
Criado por André Lopes
Desenvolvedor Fullstack
