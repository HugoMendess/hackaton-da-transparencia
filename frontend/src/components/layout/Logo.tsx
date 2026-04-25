import { cn } from "@/lib/utils"

/**
 * Logo institucional do TransparaMA.
 * Símbolo: colunata grega estilizada + tipografia sóbria.
 * Acessível: aria-label substitui o role decorativo do SVG.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="size-6 text-primary"
        role="img"
        aria-label="TransparaMA"
      >
        <path
          d="M3 9.5L12 4l9 5.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5 10v8M9 10v8M15 10v8M19 10v8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M3 19h18M3 21h18"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
      <span className="font-semibold tracking-tight">
        Transpara<span className="text-primary">MA</span>
      </span>
    </span>
  )
}
