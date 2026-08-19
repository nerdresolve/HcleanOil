import Image from 'next/image';

/**
 * Marca HCLEAN — arquivos oficiais em public/marca.
 *
 * São dois lockups prontos (símbolo + palavra), um com a palavra em branco
 * para fundo escuro e outro em verde para fundo claro; usar o arquivo certo
 * evita recolorir a marca no CSS.
 */

/* Proporções medidas nos arquivos já recortados — sem elas o Next reserva o
   espaço errado e a página salta quando a imagem carrega. */
const LOCKUP = {
  light: { src: '/marca/hclean-lockup-branco.webp', w: 391, h: 115 },
  dark: { src: '/marca/hclean-lockup-verde.webp', w: 406, h: 120 },
} as const;

type Props = {
  /** 'light' = palavra clara, para fundo escuro. */
  tone?: 'light' | 'dark';
  height?: number;
  priority?: boolean;
  className?: string;
};

export function Logo({ tone = 'light', height = 34, priority, className }: Props) {
  const { src, w, h } = LOCKUP[tone];
  return (
    <Image
      className={className}
      src={src}
      alt="HCLEAN"
      height={height}
      width={Math.round((height * w) / h)}
      priority={priority}
      style={{ height, width: 'auto', display: 'block' }}
    />
  );
}

/** Só o símbolo (anel com as ondas), sem a palavra. */
export function LogoMark({
  size = 40,
  priority,
  className,
}: {
  size?: number;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Image
      className={className}
      src="/marca/hclean-simbolo.webp"
      alt="HCLEAN"
      width={size}
      height={size}
      priority={priority}
      style={{ display: 'block' }}
    />
  );
}
