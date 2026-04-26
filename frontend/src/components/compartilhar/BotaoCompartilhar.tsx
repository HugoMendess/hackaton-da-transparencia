import { useState } from "react"
import { Share2, Check } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Botão de compartilhamento via WhatsApp.
 *
 * Estratégia:
 *  - Se o browser suporta Web Share API nativa (mobile, alguns desktops),
 *    abre o sheet de compartilhamento do sistema com texto + URL.
 *  - Caso contrário, abre WhatsApp Web (`wa.me`) numa nova aba com o texto
 *    pré-formatado.
 *  - Em ambos os casos, mostra micro-feedback visual de sucesso por 2s.
 *
 * O texto sempre inclui:
 *  - Linha contextual cidadã (passada via prop `mensagem`)
 *  - URL absoluta da página atual (gerada a partir de `caminho`)
 *  - Assinatura "Portal da Transparência" no final (transmite a marca)
 */
export function BotaoCompartilhar({
  mensagem,
  caminho,
  variante = "padrao",
  rotulo = "Compartilhar",
}: {
  mensagem: string
  caminho: string
  variante?: "padrao" | "compacto" | "primario"
  rotulo?: string
}) {
  const [feedback, setFeedback] = useState(false)

  async function compartilhar() {
    const url = new URL(caminho, window.location.origin).toString()
    const texto = `${mensagem}\n\nVeja em: ${url}\n\n— Portal da Transparência do Maranhão`

    // 1. Tenta Web Share API (mobile/iOS/macOS, alguns Chromium)
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: "Portal da Transparência", text: texto, url })
        triggerFeedback()
        return
      } catch (err) {
        // Usuário cancelou ou não autorizou: cai no fallback
        if (err instanceof Error && err.name === "AbortError") return
      }
    }

    // 2. Fallback: abre WhatsApp Web num nova aba
    const waUrl = `https://wa.me/?text=${encodeURIComponent(texto)}`
    window.open(waUrl, "_blank", "noopener,noreferrer")
    triggerFeedback()
  }

  function triggerFeedback() {
    setFeedback(true)
    setTimeout(() => setFeedback(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={compartilhar}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md font-medium transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        variante === "padrao" &&
          "min-h-touch px-3 py-1.5 text-sm border border-border bg-background hover:bg-muted hover:border-primary/40",
        variante === "primario" &&
          "min-h-touch px-3 py-1.5 text-sm bg-success text-success-foreground hover:bg-success/90",
        variante === "compacto" &&
          "size-8 justify-center text-muted-foreground hover:text-primary hover:bg-muted",
        feedback && "ring-2 ring-success/40"
      )}
      aria-label={`${rotulo}: enviar pelo WhatsApp`}
      title={rotulo}
    >
      {feedback ? (
        <Check className="size-4 text-success" aria-hidden="true" />
      ) : (
        <Share2 className="size-4" aria-hidden="true" />
      )}
      {variante !== "compacto" && (
        <span>{feedback ? "Pronto!" : rotulo}</span>
      )}
    </button>
  )
}
