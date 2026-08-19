/**
 * Marca HCLEAN em SVG.
 *
 * Os WebP originais trazem a metade inferior do disco pintada de branco opaco
 * — sobre fundo verde isso vira uma caixa clara atrás da marca. Aqui o símbolo
 * é vetorial: o "céu" do disco é transparente, assenta em qualquer fundo,
 * escala sem perda e não custa requisição.
 *
 * As cores seguem o original: o anel em verde-escuro, a onda de trás em verde
 * profundo virando azul e a da frente em verde-menta com brilho. A palavra usa
 * o mesmo verde-esmeralda do lockup, não o verde-neon dos controles.
 */

let seq = 0;

type Tone = 'light' | 'dark';

/** Verde da palavra: esmeralda no claro, quase branco no escuro. */
const WORD_COLOR: Record<Tone, string> = {
  light: '#F4F8F6',
  dark: '#2E9E6B',
};

/** Só o símbolo: anel com as ondas. */
export function LogoMark({
  size = 40,
  tone = 'light',
  className,
}: {
  size?: number;
  tone?: Tone;
  className?: string;
}) {
  const uid = `hc-mark-${++seq}`;
  const ring = tone === 'light' ? 'rgba(247,247,247,.95)' : '#1F6B45';

  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      width={size}
      height={size}
      role="img"
      aria-label="HCLEAN"
      style={{ display: 'block', flex: '0 0 auto' }}
    >
      <defs>
        {/* Onda da frente: verde-menta claro descendo para esmeralda. */}
        <linearGradient id={`${uid}-front`} x1="0" y1="0.2" x2="1" y2="0.9">
          <stop offset="0" stopColor="#7FD9AE" />
          <stop offset="0.45" stopColor="#42B383" />
          <stop offset="1" stopColor="#2C8F63" />
        </linearGradient>
        {/* Onda de trás: verde profundo virando azul-petróleo. */}
        <linearGradient id={`${uid}-back`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2F7D52" />
          <stop offset="0.5" stopColor="#2C7FA8" />
          <stop offset="1" stopColor="#4FA3CE" />
        </linearGradient>
        <clipPath id={`${uid}-clip`}>
          <circle cx="100" cy="100" r="82" />
        </clipPath>
      </defs>

      <circle cx="100" cy="100" r="87" fill="none" stroke={ring} strokeWidth="8" />

      <g clipPath={`url(#${uid}-clip)`}>
        {/* Onda azul ao fundo, saindo mais alto à esquerda. */}
        <path
          d="M10 126 C46 92, 86 92, 122 116 C148 133, 170 136, 192 122 L192 200 L10 200 Z"
          fill={`url(#${uid}-back)`}
        />
        {/* Fio claro que separa as duas ondas e dá o brilho do original. */}
        <path
          d="M10 140 C46 106, 86 106, 122 130 C148 147, 170 150, 192 136
             L192 149 C170 163, 148 160, 122 143 C86 119, 46 119, 10 153 Z"
          fill={tone === 'light' ? 'rgba(255,255,255,.95)' : '#FFFFFF'}
        />
        {/* Onda verde à frente. */}
        <path
          d="M10 154 C46 120, 86 120, 122 144 C148 161, 170 164, 192 150 L192 200 L10 200 Z"
          fill={`url(#${uid}-front)`}
        />
      </g>
    </svg>
  );
}

type Props = {
  /** 'light' = palavra clara, para fundo escuro. */
  tone?: Tone;
  height?: number;
  className?: string;
};

/** Lockup: símbolo + palavra. */
export function Logo({ tone = 'light', height = 34, className }: Props) {
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: height * 0.34,
        lineHeight: 0,
      }}
    >
      <LogoMark size={height} tone={tone} />
      <span
        style={{
          /* Peso 600 e tracking aberto: o lockup original é mais leve e
             espaçado que um bold fechado. */
          font: `600 ${height * 0.62}px/1 var(--font-display)`,
          letterSpacing: '0.11em',
          color: WORD_COLOR[tone],
          whiteSpace: 'nowrap',
        }}
      >
        HCLEAN
      </span>
    </span>
  );
}
