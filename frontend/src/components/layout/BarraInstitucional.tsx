import { cn } from "@/lib/utils"

/**
 * Barra colorida institucional do Portal da Transparência.
 *
 * Cinco segmentos iguais nas cores oficiais (vermelho, azul, verde,
 * amarelo, laranja) que aparecem na identidade visual do governo.
 * Usada como acabamento no rodapé do Header (entre o menu e o conteúdo)
 * e no rodapé do Hero (entre o hero e os eixos), reforçando a
 * identidade visual de portal governamental.
 *
 * Altura controlada via className (ex: "h-1" no header, "h-2" no hero).
 * Decorativa, sem semântica para leitores de tela.
 */
export function BarraInstitucional({ className }: { className?: string }) {
  return (
    <div
      className={cn("flex w-full overflow-hidden", className)}
      role="presentation"
      aria-hidden="true"
      data-barra-institucional="true"
    >
      <span className="h-full flex-1 bg-destructive" />
      <span className="h-full flex-1 bg-primary" />
      <span className="h-full flex-1 bg-success" />
      <span className="h-full flex-1 bg-yellow-400" />
      <span className="h-full flex-1 bg-orange-500" />
    </div>
  )
}
