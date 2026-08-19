/**
 * Marca HCLEAN — símbolo (anel com onda) + wordmark, redesenhado como SVG
 * inline a partir do design system. Inline em vez de <img> para não custar
 * uma requisição no caminho crítico do LCP.
 */

type Props = {
  height?: number;
  tone?: 'light' | 'dark';
  variant?: 'lockup' | 'mark';
  className?: string;
};

export function Logo({
  height = 34,
  tone = 'light',
  variant = 'lockup',
  className,
}: Props) {
  const word = tone === 'light' ? 'var(--hc-paper)' : 'var(--hc-green-800)';
  const ring = tone === 'light' ? '#F7F7F7' : '#092B1B';

  const mark = (
    <svg
      viewBox="0 0 200 200"
      width={height}
      height={height}
      role="img"
      aria-label="HCLEAN"
      style={{ display: 'block', flex: '0 0 auto' }}
    >
      <circle cx="100" cy="100" r="88" fill="none" stroke={ring} strokeWidth="9" />
      {/* Onda dupla: verde da marca sobre azul técnico. */}
      <path
        d="M34 118 C64 92, 96 92, 126 112 C146 125, 160 126, 172 118"
        fill="none"
        stroke="#00BF63"
        strokeWidth="13"
        strokeLinecap="round"
      />
      <path
        d="M30 92 C60 66, 92 66, 122 86 C142 99, 158 100, 172 92"
        fill="none"
        stroke="#4198C8"
        strokeWidth="11"
        strokeLinecap="round"
        opacity="0.85"
      />
    </svg>
  );

  if (variant === 'mark') return <span className={className}>{mark}</span>;

  return (
    <span
      className={className}
      style={{ display: 'inline-flex', alignItems: 'center', gap: height * 0.3 }}
    >
      {mark}
      <span
        style={{
          font: `var(--fw-bold) ${height * 0.72}px/1 var(--font-display)`,
          letterSpacing: '0.02em',
          color: word,
        }}
      >
        HCLEAN
      </span>
    </span>
  );
}
