import jsPDF from "jspdf"
import type { DadosEixo } from "@/data/eixos-dataset"

/**
 * Memorial PDF do eixo temático no formato visual do Portal da Transparência do MA.
 *
 * Construído programaticamente em jsPDF puro (sem html2canvas) para garantir
 * leveza, fidelidade tipográfica e portabilidade. O layout segue a identidade
 * institucional: faixa azul superior, logo oficial, hierarquia em seções
 * numeradas (01-04) e rodapé com fonte oficial e nota LGPD.
 *
 * Largura A4: 210mm. Margem: 15mm. Coluna útil: 180mm.
 */

// ─── Paleta institucional (espelha frontend/src/index.css) ────────────
const PRIMARY: [number, number, number] = [34, 90, 161] // #225AA1 azul Portal MA
const PRIMARY_DARK: [number, number, number] = [22, 60, 110]
const SECONDARY: [number, number, number] = [217, 161, 35] // #D9A123 mostarda
const DESTRUCTIVE: [number, number, number] = [214, 43, 43] // #D62B2B vermelho MA
const SUCCESS: [number, number, number] = [33, 130, 95] // verde "Pago"
const FG: [number, number, number] = [20, 24, 28]
const MUTED: [number, number, number] = [100, 116, 125]
const BORDER: [number, number, number] = [216, 224, 235]
const BG_SOFT: [number, number, number] = [235, 242, 250]
const WHITE: [number, number, number] = [255, 255, 255]

// ─── Layout ──────────────────────────────────────────────────────────
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

  const logo = await carregarLogo()

  let y = desenharCapa(doc, eixoNome, dados, logo)
  y = desenharPerguntaAncora(doc, dados, y)
  y = desenharCardsResumo(doc, dados, y)
  y = desenharComposicao(doc, dados, y)
  y = desenharSerieHistorica(doc, dados, y)
  desenharDestaques(doc, dados, y)
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

// ─── Capa institucional ──────────────────────────────────────────────
function desenharCapa(
  doc: jsPDF,
  eixoNome: string,
  dados: DadosEixo,
  logo: LogoData | null
): number {
  // Faixa azul institucional (banner superior 8mm)
  doc.setFillColor(...PRIMARY)
  doc.rect(0, 0, LARGURA, 8, "F")

  // Faixa branca com logo + identificação
  const faixaInicio = 8
  const faixaAltura = 30
  doc.setFillColor(...WHITE)
  doc.rect(0, faixaInicio, LARGURA, faixaAltura, "F")

  // Logo à esquerda (altura 18mm, ratio preservado)
  if (logo) {
    const alturaLogo = 18
    const larguraLogo = alturaLogo * logo.ratio
    const yLogo = faixaInicio + (faixaAltura - alturaLogo) / 2
    doc.addImage(logo.dataUrl, "PNG", MARGEM, yLogo, larguraLogo, alturaLogo)
  }

  // Selo + data à direita
  doc.setTextColor(...PRIMARY_DARK)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(8)
  doc.text("PORTAL DA TRANSPARÊNCIA", LARGURA - MARGEM, faixaInicio + 11, {
    align: "right",
  })
  doc.text("MEMORIAL CIDADÃO", LARGURA - MARGEM, faixaInicio + 16, {
    align: "right",
  })

  const data = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
  doc.setTextColor(...MUTED)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(7)
  doc.text(`Gerado em ${data}`, LARGURA - MARGEM, faixaInicio + 22, {
    align: "right",
  })

  // Linha primary fina abaixo da faixa branca
  const yLinha = faixaInicio + faixaAltura
  doc.setDrawColor(...PRIMARY)
  doc.setLineWidth(0.6)
  doc.line(0, yLinha, LARGURA, yLinha)

  // Tag "EIXO TEMÁTICO" mostarda + título
  doc.setFillColor(...SECONDARY)
  doc.rect(MARGEM, yLinha + 8, 30, 5, "F")
  doc.setTextColor(...WHITE)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(7)
  doc.text("EIXO TEMÁTICO", MARGEM + 15, yLinha + 11.5, { align: "center" })

  // Título grande do eixo
  doc.setTextColor(...FG)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(24)
  doc.text(eixoNome, MARGEM, yLinha + 24)

  // Subtítulo
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.setTextColor(...MUTED)
  const subtitulo = `Relatório completo dos investimentos públicos em ${eixoNome.toLowerCase()} no estado do Maranhão em 2026.`
  const subLinhas = doc.splitTextToSize(subtitulo, COLUNA)
  doc.text(subLinhas, MARGEM, yLinha + 32)

  // Slug + fonte (referência rápida abaixo do subtítulo)
  doc.setFontSize(8)
  doc.setTextColor(...PRIMARY)
  doc.setFont("helvetica", "bold")
  doc.text(`Fonte oficial: ${dados.fonteOficial.nome}`, MARGEM, yLinha + 41)

  return yLinha + 50
}

// ─── Pergunta-âncora (cidadã) ─────────────────────────────────────────
function desenharPerguntaAncora(
  doc: jsPDF,
  dados: DadosEixo,
  y: number
): number {
  const altura = 50
  // Card branco com borda sutil
  doc.setFillColor(...WHITE)
  doc.setDrawColor(...BORDER)
  doc.setLineWidth(0.2)
  doc.roundedRect(MARGEM, y, COLUNA, altura, 2, 2, "FD")

  // Border-left grossa primary (acento visual)
  doc.setFillColor(...PRIMARY)
  doc.rect(MARGEM, y, 2.5, altura, "F")

  // Etiqueta
  doc.setTextColor(...PRIMARY_DARK)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(7)
  doc.text("PERGUNTA CIDADÃ RESPONDIDA", MARGEM + 6, y + 7)

  // Pergunta
  doc.setTextColor(...FG)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  const pergLinhas = doc.splitTextToSize(dados.perguntaAncora, COLUNA - 10)
  doc.text(pergLinhas, MARGEM + 6, y + 15)

  // Linha separadora interna
  const yLinhaInterna = y + 22 + (pergLinhas.length - 1) * 5
  doc.setDrawColor(...BG_SOFT)
  doc.setLineWidth(0.3)
  doc.line(MARGEM + 6, yLinhaInterna, MARGEM + COLUNA - 4, yLinhaInterna)

  // Resposta
  doc.setTextColor(...MUTED)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  const respLinhas = doc.splitTextToSize(dados.resposta, COLUNA - 10)
  doc.text(respLinhas.slice(0, 5), MARGEM + 6, yLinhaInterna + 6)

  return y + altura + 10
}

// ─── 01 · Cards de resumo ─────────────────────────────────────────────
function desenharCardsResumo(
  doc: jsPDF,
  dados: DadosEixo,
  y: number
): number {
  y = desenharSecaoHeader(doc, "01", "Visão geral", y)

  const cards = dados.cardsResumo.slice(0, 4)
  const larguraCard = (COLUNA - 6) / 2
  const alturaCard = 24
  const gap = 6

  cards.forEach((card, i) => {
    const col = i % 2
    const row = Math.floor(i / 2)
    const cx = MARGEM + col * (larguraCard + gap)
    const cy = y + row * (alturaCard + gap)

    // Card branco com borda
    doc.setFillColor(...WHITE)
    doc.setDrawColor(...BORDER)
    doc.setLineWidth(0.2)
    doc.roundedRect(cx, cy, larguraCard, alturaCard, 1.5, 1.5, "FD")

    // Top-bar primary (1.5mm de altura, identidade visual)
    doc.setFillColor(...PRIMARY)
    doc.rect(cx, cy, larguraCard, 1.2, "F")

    // Label uppercase
    doc.setTextColor(...MUTED)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(7)
    doc.text(card.label.toUpperCase(), cx + 4, cy + 7)

    // Valor (destaque tipográfico)
    doc.setTextColor(...FG)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(14)
    doc.text(card.valor, cx + 4, cy + 14.5)

    // Legenda (linha auxiliar)
    if (card.legenda) {
      doc.setTextColor(...MUTED)
      doc.setFont("helvetica", "normal")
      doc.setFontSize(7)
      const legLinhas = doc.splitTextToSize(card.legenda, larguraCard - 8)
      doc.text(legLinhas[0], cx + 4, cy + 20)
    }
  })

  const linhasUsadas = Math.ceil(cards.length / 2)
  return y + linhasUsadas * (alturaCard + gap) + 6
}

// ─── 02 · Composição (barras horizontais com porcentagem) ─────────────
function desenharComposicao(
  doc: jsPDF,
  dados: DadosEixo,
  y: number
): number {
  y = checarPagina(doc, y, 70)
  y = desenharSecaoHeader(doc, "02", "Composição dos gastos", y)

  const itens = dados.composicaoGastos.slice(0, 6)
  const total = itens.reduce((acc, item) => acc + item.valor, 0)
  const max = Math.max(...itens.map((i) => i.valor))

  const colNome = 55
  const colValor = 30
  const gap = 3
  const xBarra = MARGEM + colNome + gap
  const larguraBarMax = COLUNA - colNome - colValor - gap * 2
  const linhaH = 9

  itens.forEach((item, i) => {
    const ly = y + i * linhaH
    const pct = total > 0 ? (item.valor / total) * 100 : 0
    const barLargura = (item.valor / max) * larguraBarMax

    // Nome
    doc.setTextColor(...FG)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(8)
    const nome = doc.splitTextToSize(item.nome, colNome)[0]
    doc.text(nome, MARGEM, ly + 4)

    // Trilho da barra (BG_SOFT)
    doc.setFillColor(...BG_SOFT)
    doc.rect(xBarra, ly + 1.5, larguraBarMax, 5, "F")

    // Preenchimento primary
    doc.setFillColor(...PRIMARY)
    doc.rect(xBarra, ly + 1.5, barLargura, 5, "F")

    // Valor + porcentagem
    doc.setTextColor(...PRIMARY_DARK)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(8)
    doc.text(`R$ ${formatMilhoes(item.valor)}`, LARGURA - MARGEM, ly + 4, {
      align: "right",
    })
    doc.setTextColor(...MUTED)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(7)
    doc.text(`${pct.toFixed(1)}%`, LARGURA - MARGEM, ly + 8, {
      align: "right",
    })
  })

  return y + itens.length * linhaH + 8
}

// ─── 03 · Série histórica (tabela institucional) ──────────────────────
function desenharSerieHistorica(
  doc: jsPDF,
  dados: DadosEixo,
  y: number
): number {
  y = checarPagina(doc, y, 60)
  y = desenharSecaoHeader(doc, "03", "Evolução anual", y)

  const colW = COLUNA / 4
  const linhaH = 8

  // Header com fundo PRIMARY (institucional)
  doc.setFillColor(...PRIMARY)
  doc.rect(MARGEM, y, COLUNA, linhaH, "F")
  doc.setTextColor(...WHITE)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(8)
  ;["Ano", "Empenhado", "Liquidado", "Pago"].forEach((h, i) => {
    doc.text(h, MARGEM + colW * i + (i === 0 ? 3 : colW - 3), y + 5.5, {
      align: i === 0 ? "left" : "right",
    })
  })
  y += linhaH

  // Linhas zebradas (accent muito sutil)
  doc.setFont("helvetica", "normal")
  dados.serieHistorica.forEach((linha, i) => {
    if (i % 2 === 1) {
      doc.setFillColor(...BG_SOFT)
      doc.rect(MARGEM, y, COLUNA, linhaH, "F")
    }

    // Ano em negrito primary_dark
    doc.setTextColor(...PRIMARY_DARK)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(8)
    doc.text(String(linha.ano), MARGEM + 3, y + 5.5)

    // Empenhado e Liquidado em cinza
    doc.setTextColor(...FG)
    doc.setFont("helvetica", "normal")
    doc.text(`R$ ${formatMilhoes(linha.empenhado)}`, MARGEM + colW * 2 - 3, y + 5.5, {
      align: "right",
    })
    doc.text(`R$ ${formatMilhoes(linha.liquidado)}`, MARGEM + colW * 3 - 3, y + 5.5, {
      align: "right",
    })

    // Pago em verde success (status positivo)
    doc.setTextColor(...SUCCESS)
    doc.setFont("helvetica", "bold")
    doc.text(`R$ ${formatMilhoes(linha.pago)}`, MARGEM + colW * 4 - 3, y + 5.5, {
      align: "right",
    })

    y += linhaH
  })

  // Borda inferior
  doc.setDrawColor(...BORDER)
  doc.setLineWidth(0.2)
  doc.line(MARGEM, y, LARGURA - MARGEM, y)

  return y + 10
}

// ─── 04 · Destaques (cards com border-left) ───────────────────────────
function desenharDestaques(doc: jsPDF, dados: DadosEixo, y: number): number {
  y = checarPagina(doc, y, 50)
  y = desenharSecaoHeader(doc, "04", "Destaques", y)

  dados.destaques.forEach((d) => {
    y = checarPagina(doc, y, 22)

    // Card branco
    doc.setFillColor(...WHITE)
    doc.setDrawColor(...BORDER)
    doc.setLineWidth(0.2)
    doc.roundedRect(MARGEM, y, COLUNA, 18, 1.5, 1.5, "FD")

    // Border-left grossa primary
    doc.setFillColor(...PRIMARY)
    doc.rect(MARGEM, y, 2.5, 18, "F")

    // Subtítulo
    doc.setTextColor(...MUTED)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(7)
    doc.text(d.subtitulo.toUpperCase(), MARGEM + 6, y + 6)

    // Título
    doc.setTextColor(...FG)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(11)
    const tituloLinhas = doc.splitTextToSize(d.titulo, COLUNA - 60)
    doc.text(tituloLinhas[0], MARGEM + 6, y + 13)

    // Valor com badge BG_SOFT (canto direito)
    const valorTextoLargura = doc.getTextWidth(d.valor) + 6
    const valorX = LARGURA - MARGEM - valorTextoLargura - 2
    doc.setFillColor(...BG_SOFT)
    doc.roundedRect(valorX, y + 6, valorTextoLargura, 7, 1, 1, "F")
    doc.setTextColor(...PRIMARY_DARK)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(10)
    doc.text(d.valor, valorX + valorTextoLargura - 3, y + 11, {
      align: "right",
    })

    y += 21
  })

  return y + 4
}

// ─── Rodapé institucional ─────────────────────────────────────────────
function desenharRodape(doc: jsPDF, eixoNome: string, dados: DadosEixo): void {
  const totalPaginas = doc.getNumberOfPages()
  for (let p = 1; p <= totalPaginas; p++) {
    doc.setPage(p)

    // Linha primary marcante (separa conteúdo do rodapé)
    doc.setDrawColor(...PRIMARY)
    doc.setLineWidth(0.5)
    doc.line(MARGEM, ALTURA - 20, LARGURA - MARGEM, ALTURA - 20)

    // Fonte oficial à esquerda
    doc.setTextColor(...PRIMARY_DARK)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(7)
    doc.text("Fonte oficial:", MARGEM, ALTURA - 14)
    doc.setTextColor(...MUTED)
    doc.setFont("helvetica", "normal")
    doc.text(dados.fonteOficial.nome, MARGEM + 19, ALTURA - 14)

    // Identificação à direita
    doc.setTextColor(...PRIMARY_DARK)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(7)
    doc.text(
      `${eixoNome}  ·  Página ${p}/${totalPaginas}`,
      LARGURA - MARGEM,
      ALTURA - 14,
      { align: "right" }
    )

    // Nota LGPD
    doc.setFontSize(6)
    doc.setFont("helvetica", "italic")
    doc.setTextColor(...MUTED)
    doc.text(
      "Documento gerado pelo Portal da Transparência do Maranhão. Dados públicos, em conformidade com as Leis 12.527/2011 (LAI) e 13.709/2018 (LGPD).",
      MARGEM,
      ALTURA - 8
    )

    // Assinatura visual: ponto colorido na borda inferior (identidade)
    doc.setFillColor(...PRIMARY)
    doc.rect(0, ALTURA - 3, LARGURA / 3, 3, "F")
    doc.setFillColor(...SECONDARY)
    doc.rect(LARGURA / 3, ALTURA - 3, LARGURA / 3, 3, "F")
    doc.setFillColor(...DESTRUCTIVE)
    doc.rect((LARGURA / 3) * 2, ALTURA - 3, LARGURA / 3, 3, "F")
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────
function desenharSecaoHeader(
  doc: jsPDF,
  numero: string,
  titulo: string,
  y: number
): number {
  // Numeração grande primary
  doc.setTextColor(...PRIMARY)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(15)
  doc.text(numero, MARGEM, y + 4)

  // Título da seção
  doc.setTextColor(...FG)
  doc.setFontSize(12)
  doc.text(titulo, MARGEM + 13, y + 4)

  // Microbarra primary (3mm) abaixo da numeração
  doc.setFillColor(...PRIMARY)
  doc.rect(MARGEM, y + 6, 6, 0.6, "F")

  return y + 12
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
