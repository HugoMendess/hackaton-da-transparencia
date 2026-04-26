import jsPDF from "jspdf"
import type { DadosEixo } from "@/data/eixos-dataset"

/**
 * Gera o Memorial PDF de um eixo do Portal da Transparência.
 *
 * O PDF é construído programaticamente (jsPDF puro, sem html2canvas) para
 * garantir leveza e portabilidade. O layout segue a identidade visual do
 * portal: cabeçalho azul institucional, tipografia hierárquica e seções
 * numeradas (01, 02, 03) idênticas às da página de eixo.
 *
 * O cidadão usa este PDF como prova/relatório para levar a reuniões de
 * bairro, conselhos municipais ou compartilhar com outros cidadãos.
 *
 * Largura A4: 210mm. Margem padrão: 15mm. Linha útil: 180mm.
 */

const PRIMARY: [number, number, number] = [34, 90, 161] // azul Portal MA, ~#225AA1
const PRIMARY_DARK: [number, number, number] = [22, 60, 110]
const FG: [number, number, number] = [20, 24, 28]
const MUTED: [number, number, number] = [100, 116, 125]
const BORDER: [number, number, number] = [216, 224, 235]
const BG_SOFT: [number, number, number] = [235, 242, 250]

const MARGEM = 15
const LARGURA = 210
const ALTURA = 297
const COLUNA = LARGURA - MARGEM * 2

export async function gerarPDFEixo(
  eixoNome: string,
  dados: DadosEixo
): Promise<void> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  // Logo oficial do Portal da Transparência. Carregamento best-effort:
  // se falhar (network, 404), o PDF é gerado sem logo (fallback gracioso).
  const logo = await carregarLogo()

  let y = 0
  y = desenharCapa(doc, eixoNome, dados, logo, y)
  y = desenharPerguntaAncora(doc, dados, y)
  y = desenharCardsResumo(doc, dados, y)
  y = desenharComposicao(doc, dados, y)
  y = desenharSerieHistorica(doc, dados, y)
  y = desenharDestaques(doc, dados, y)
  desenharRodape(doc, eixoNome, dados)

  const slug = dados.slug
  const data = new Date().toISOString().slice(0, 10)
  doc.save(`Portal-Transparencia-MA-${slug}-${data}.pdf`)
}

type LogoData = { dataUrl: string; ratio: number }

async function carregarLogo(): Promise<LogoData | null> {
  try {
    const res = await fetch("/images/nova_logo_portal_transparencia_26_08_2022.png")
    if (!res.ok) return null
    const blob = await res.blob()
    const dataUrl = await blobToDataURL(blob)
    const ratio = await medirRatio(dataUrl)
    return { dataUrl, ratio }
  } catch {
    return null
  }
}

function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error("Falha ao ler imagem"))
    reader.readAsDataURL(blob)
  })
}

function medirRatio(dataUrl: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img.width / img.height)
    img.onerror = () => reject(new Error("Imagem inválida"))
    img.src = dataUrl
  })
}

// ─── Capa ──────────────────────────────────────────────────────────
function desenharCapa(
  doc: jsPDF,
  eixoNome: string,
  dados: DadosEixo,
  logo: LogoData | null,
  _y: number
): number {
  void _y
  void dados

  // Faixa branca com borda inferior azul (deixa o logo respirar)
  const faixaAltura = 32
  doc.setFillColor(255, 255, 255)
  doc.rect(0, 0, LARGURA, faixaAltura, "F")
  doc.setDrawColor(...PRIMARY)
  doc.setLineWidth(0.6)
  doc.line(0, faixaAltura, LARGURA, faixaAltura)

  // Logo do Portal da Transparência (à esquerda).
  // Altura fixa de 18mm, largura proporcional. Fallback: se a imagem
  // não carregou, deixa o espaço em branco em vez de mostrar texto.
  if (logo) {
    const alturaLogo = 18
    const larguraLogo = alturaLogo * logo.ratio
    const yLogo = (faixaAltura - alturaLogo) / 2
    doc.addImage(logo.dataUrl, "PNG", MARGEM, yLogo, larguraLogo, alturaLogo)
  }

  // Selo "MEMORIAL CIDADÃO" + data (à direita)
  doc.setTextColor(...PRIMARY_DARK)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(8)
  doc.text("MEMORIAL CIDADÃO", LARGURA - MARGEM, 14, { align: "right" })

  const data = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
  doc.setTextColor(...MUTED)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  doc.text(`Gerado em ${data}`, LARGURA - MARGEM, 19, { align: "right" })

  // Título do eixo
  doc.setTextColor(...FG)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(22)
  doc.text(eixoNome, MARGEM, faixaAltura + 16)

  // Subtítulo
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.setTextColor(...MUTED)
  const subtitulo = `Relatório completo dos investimentos públicos em ${eixoNome.toLowerCase()} no estado do Maranhão em 2026.`
  const subLinhas = doc.splitTextToSize(subtitulo, COLUNA)
  doc.text(subLinhas, MARGEM, faixaAltura + 24)

  return faixaAltura + 38
}

// ─── Pergunta-âncora ──────────────────────────────────────────────
function desenharPerguntaAncora(
  doc: jsPDF,
  dados: DadosEixo,
  y: number
): number {
  // Box destaque
  doc.setFillColor(...BG_SOFT)
  doc.setDrawColor(...PRIMARY)
  doc.setLineWidth(0.3)
  const altura = 48
  doc.roundedRect(MARGEM, y, COLUNA, altura, 2, 2, "FD")

  // Etiqueta
  doc.setTextColor(...PRIMARY_DARK)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(7)
  doc.text("PERGUNTA CIDADÃ RESPONDIDA", MARGEM + 4, y + 6)

  // Pergunta
  doc.setTextColor(...FG)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(11)
  const pergLinhas = doc.splitTextToSize(dados.perguntaAncora, COLUNA - 8)
  doc.text(pergLinhas, MARGEM + 4, y + 13)

  // Resposta
  doc.setTextColor(...MUTED)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  const respLinhas = doc.splitTextToSize(dados.resposta, COLUNA - 8)
  doc.text(respLinhas.slice(0, 5), MARGEM + 4, y + 22)

  return y + altura + 8
}

// ─── Cards resumo ─────────────────────────────────────────────────
function desenharCardsResumo(
  doc: jsPDF,
  dados: DadosEixo,
  y: number
): number {
  y = desenharSecaoHeader(doc, "01", "Visão geral", y)

  const cards = dados.cardsResumo.slice(0, 4)
  const larguraCard = (COLUNA - 6) / 2 // 2 colunas com gap 6
  const alturaCard = 22
  const gap = 6

  cards.forEach((card, i) => {
    const col = i % 2
    const row = Math.floor(i / 2)
    const cx = MARGEM + col * (larguraCard + gap)
    const cy = y + row * (alturaCard + gap)

    doc.setFillColor(255, 255, 255)
    doc.setDrawColor(...BORDER)
    doc.setLineWidth(0.2)
    doc.roundedRect(cx, cy, larguraCard, alturaCard, 1.5, 1.5, "FD")

    doc.setTextColor(...MUTED)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(7)
    doc.text(card.label.toUpperCase(), cx + 4, cy + 6)

    doc.setTextColor(...FG)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(13)
    doc.text(card.valor, cx + 4, cy + 13)

    if (card.legenda) {
      doc.setTextColor(...MUTED)
      doc.setFont("helvetica", "normal")
      doc.setFontSize(7)
      const legLinhas = doc.splitTextToSize(card.legenda, larguraCard - 8)
      doc.text(legLinhas[0], cx + 4, cy + 18)
    }
  })

  const linhasUsadas = Math.ceil(cards.length / 2)
  return y + linhasUsadas * (alturaCard + gap) + 4
}

// ─── Composição (barras horizontais) ──────────────────────────────
function desenharComposicao(doc: jsPDF, dados: DadosEixo, y: number): number {
  y = checarPagina(doc, y, 60)
  y = desenharSecaoHeader(doc, "02", "Composição dos gastos", y)

  // Layout em 3 colunas: [nome][barra][valor]. As larguras do nome e
  // do valor são fixas; a barra ocupa o restante com gap de respiro
  // dos dois lados, garantindo que NUNCA invada o texto do valor.
  const itens = dados.composicaoGastos.slice(0, 6)
  const max = Math.max(...itens.map((i) => i.valor))
  const colNome = 55
  const colValor = 22
  const gap = 3
  const xBarra = MARGEM + colNome + gap
  const larguraBarMax = COLUNA - colNome - colValor - gap * 2
  const linhaH = 8

  itens.forEach((item, i) => {
    const ly = y + i * linhaH

    // Nome
    doc.setTextColor(...FG)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(8)
    const nome = doc.splitTextToSize(item.nome, colNome)[0]
    doc.text(nome, MARGEM, ly + 4)

    // Barra (fundo + preenchimento proporcional)
    const barLargura = (item.valor / max) * larguraBarMax
    doc.setFillColor(...BG_SOFT)
    doc.rect(xBarra, ly + 1.5, larguraBarMax, 4, "F")
    doc.setFillColor(...PRIMARY)
    doc.rect(xBarra, ly + 1.5, barLargura, 4, "F")

    // Valor (right-align na borda da margem direita)
    doc.setTextColor(...MUTED)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(7)
    doc.text(`R$ ${formatMilhoes(item.valor)}`, LARGURA - MARGEM, ly + 4, {
      align: "right",
    })
  })

  return y + itens.length * linhaH + 6
}

// ─── Série histórica (tabela) ─────────────────────────────────────
function desenharSerieHistorica(
  doc: jsPDF,
  dados: DadosEixo,
  y: number
): number {
  y = checarPagina(doc, y, 50)
  y = desenharSecaoHeader(doc, "03", "Evolução anual", y)

  const colW = COLUNA / 4
  const linhaH = 7

  // Cabeçalho
  doc.setFillColor(...BG_SOFT)
  doc.rect(MARGEM, y, COLUNA, linhaH, "F")
  doc.setTextColor(...PRIMARY_DARK)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(8)
  ;["Ano", "Empenhado", "Liquidado", "Pago"].forEach((h, i) => {
    doc.text(h, MARGEM + colW * i + (i === 0 ? 2 : colW - 2), y + 5, {
      align: i === 0 ? "left" : "right",
    })
  })
  y += linhaH

  // Linhas
  doc.setFont("helvetica", "normal")
  doc.setTextColor(...FG)
  dados.serieHistorica.forEach((linha, i) => {
    if (i % 2 === 1) {
      doc.setFillColor(250, 252, 251)
      doc.rect(MARGEM, y, COLUNA, linhaH, "F")
    }
    doc.setFontSize(8)
    doc.text(String(linha.ano), MARGEM + 2, y + 5)
    doc.text(`R$ ${formatMilhoes(linha.empenhado)}`, MARGEM + colW * 2 - 2, y + 5, {
      align: "right",
    })
    doc.text(`R$ ${formatMilhoes(linha.liquidado)}`, MARGEM + colW * 3 - 2, y + 5, {
      align: "right",
    })
    doc.text(`R$ ${formatMilhoes(linha.pago)}`, MARGEM + colW * 4 - 2, y + 5, {
      align: "right",
    })
    y += linhaH
  })

  return y + 8
}

// ─── Destaques ────────────────────────────────────────────────────
function desenharDestaques(doc: jsPDF, dados: DadosEixo, y: number): number {
  y = checarPagina(doc, y, 50)
  y = desenharSecaoHeader(doc, "04", "Destaques", y)

  dados.destaques.forEach((d) => {
    doc.setFillColor(255, 255, 255)
    doc.setDrawColor(...BORDER)
    doc.setLineWidth(0.2)
    doc.roundedRect(MARGEM, y, COLUNA, 16, 1.5, 1.5, "FD")

    doc.setTextColor(...MUTED)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(7)
    doc.text(d.subtitulo.toUpperCase(), MARGEM + 4, y + 5)

    doc.setTextColor(...FG)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(10)
    doc.text(d.titulo, MARGEM + 4, y + 11)

    doc.setTextColor(...PRIMARY)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(11)
    doc.text(d.valor, LARGURA - MARGEM - 4, y + 11, { align: "right" })

    y += 19
  })

  return y + 4
}

// ─── Rodapé (em todas as páginas) ─────────────────────────────────
function desenharRodape(doc: jsPDF, eixoNome: string, dados: DadosEixo): void {
  const totalPaginas = doc.getNumberOfPages()
  for (let p = 1; p <= totalPaginas; p++) {
    doc.setPage(p)

    // Linha separadora
    doc.setDrawColor(...BORDER)
    doc.setLineWidth(0.2)
    doc.line(MARGEM, ALTURA - 18, LARGURA - MARGEM, ALTURA - 18)

    // Fonte oficial
    doc.setTextColor(...MUTED)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(7)
    doc.text(`Fonte: ${dados.fonteOficial.nome}`, MARGEM, ALTURA - 12)

    // URL do portal + numeração
    doc.text(
      `Portal da Transparência MA  ·  ${eixoNome}  ·  Página ${p} de ${totalPaginas}`,
      LARGURA - MARGEM,
      ALTURA - 12,
      { align: "right" }
    )

    // Assinatura LGPD
    doc.setFontSize(6)
    doc.setTextColor(...MUTED)
    doc.text(
      "Documento gerado pelo Portal da Transparência do MA. Os dados são públicos e seguem as Leis 12.527/2011 (LAI) e 13.709/2018 (LGPD).",
      MARGEM,
      ALTURA - 6
    )
  }
}

// ─── Helpers ──────────────────────────────────────────────────────
function desenharSecaoHeader(
  doc: jsPDF,
  numero: string,
  titulo: string,
  y: number
): number {
  doc.setTextColor(...PRIMARY)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(13)
  doc.text(numero, MARGEM, y + 4)

  doc.setTextColor(...FG)
  doc.setFontSize(11)
  doc.text(titulo, MARGEM + 12, y + 4)

  return y + 8
}

function checarPagina(doc: jsPDF, y: number, alturaNecessaria: number): number {
  if (y + alturaNecessaria > ALTURA - 25) {
    doc.addPage()
    return MARGEM + 5
  }
  return y
}

function formatMilhoes(valor: number): string {
  if (valor >= 1000) {
    return `${(valor / 1000).toFixed(1)} bi`
  }
  return `${valor.toFixed(0)} mi`
}
