import { cn } from "@/lib/utils"

/**
 * Logo institucional do Portal da Transparência (Governo do Maranhão).
 * Usa o PNG oficial em alta resolução servido a partir de /public/images.
 *
 * A altura padrão (h-9 = 36px) cabe bem no Header. Quem precisar de
 * tamanhos diferentes (Footer, página Sobre) sobrescreve via `className`.
 *
 * Acessibilidade: alt descritivo e dimensões intrínsecas para evitar
 * shift de layout enquanto a imagem carrega.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <img
      src="/images/nova_logo_portal_transparencia_26_08_2022.png"
      alt="Portal da Transparência, Governo do Maranhão"
      width={864}
      height={296}
      loading="eager"
      decoding="async"
      data-logo="true"
      className={cn("h-11 w-auto", className)}
    />
  )
}
