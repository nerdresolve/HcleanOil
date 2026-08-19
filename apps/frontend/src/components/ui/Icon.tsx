/**
 * Ícones inline.
 *
 * Desenhados à mão em vez de importar uma biblioteca: só os traçados usados
 * chegam ao HTML, sem custo de JS no cliente. Estilo alinhado ao design system
 * (traço 1.75, cantos arredondados).
 */
import type { IconName } from '@/data/site';

const PATHS: Record<IconName, React.ReactNode> = {
  shield: <path d="M12 3l7 3v6c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6l7-3z" />,
  droplets: (
    <>
      <path d="M8 3.5c2.5 3 4 5 4 6.8A4 4 0 018 14a4 4 0 01-4-3.7C4 8.5 5.5 6.5 8 3.5z" />
      <path d="M16 10c2 2.4 3 4 3 5.4A3 3 0 0116 18a3 3 0 01-3-2.6c0-1.4 1-3 3-5.4z" />
    </>
  ),
  kit: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />
      <path d="M12 11v5M9.5 13.5h5" />
    </>
  ),
  tank: (
    <>
      <rect x="4" y="6" width="16" height="14" rx="2" />
      <path d="M4 11h16" />
      <path d="M8 6V4h8v2" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  field: (
    <>
      <path d="M3 20h18" />
      <path d="M5 20V9l7-5 7 5v11" />
      <path d="M10 20v-5h4v5" />
    </>
  ),
  support: (
    <>
      <path d="M4 14v-2a8 8 0 1116 0v2" />
      <rect x="2.5" y="13.5" width="4" height="6" rx="1.5" />
      <rect x="17.5" y="13.5" width="4" height="6" rx="1.5" />
      <path d="M19.5 19.5v.5a3 3 0 01-3 3H13" />
    </>
  ),
  handshake: (
    <>
      <path d="M11 6l-2.5 2.5a2 2 0 000 2.8L11 14" />
      <path d="M13 6l2.5 2.5a2 2 0 010 2.8L13 14" />
      <path d="M3 8l4-3 5 3 5-3 4 3" />
      <path d="M3 8v6l6 5 3-2 3 2 6-5V8" />
    </>
  ),
  medal: (
    <>
      <path d="M8 3l2.5 5M16 3l-2.5 5" />
      <circle cx="12" cy="14.5" r="6" />
      <path d="M12 11.5l1.2 2.4 2.6.4-1.9 1.8.4 2.6-2.3-1.2-2.3 1.2.4-2.6-1.9-1.8 2.6-.4z" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.5 20a6.5 6.5 0 0113 0" />
      <path d="M16 5.3a3.2 3.2 0 010 5.4" />
      <path d="M18 14.2a6.5 6.5 0 013.5 5.8" />
    </>
  ),
  ruler: (
    <>
      <rect x="2" y="8" width="20" height="8" rx="1.5" />
      <path d="M7 8v3M12 8v4M17 8v3" />
    </>
  ),
  factory: (
    <>
      <path d="M3 20h18" />
      <path d="M3 20V10l5 3V10l5 3V7l5 3v10" />
      <path d="M7 20v-3M12 20v-3M17 20v-3" />
    </>
  ),
  anchor: (
    <>
      <circle cx="12" cy="5" r="2.5" />
      <path d="M12 7.5V21" />
      <path d="M7 11H17" />
      <path d="M4 15a8 8 0 0016 0" />
    </>
  ),
  flask: (
    <>
      <path d="M9 3h6" />
      <path d="M10 3v6l-5 8.5A2 2 0 006.7 21h10.6a2 2 0 001.7-3.5L14 9V3" />
      <path d="M7.5 15h9" />
    </>
  ),
  'arrow-right': (
    <>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </>
  ),
  check: <path d="M4 12.5l5 5 11-11" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 7l8.5 6 8.5-6" />
    </>
  ),
  phone: (
    <path d="M6.5 3h3l1.5 4-2 1.5a12 12 0 005.5 5.5L16 12l4 1.5v3a2 2 0 01-2.2 2A16.5 16.5 0 013.5 5.2 2 2 0 015.5 3z" />
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3.5 9.5h17M3.5 14.5h17" />
      <path d="M12 3a15 15 0 000 18a15 15 0 000-18z" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  'chevron-right': <path d="M9 5l7 7-7 7" />,
};

type Props = {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  color?: string;
  /** Texto acessível. Sem ele o ícone é tratado como decorativo. */
  title?: string;
  className?: string;
};

export function Icon({
  name,
  size = 20,
  strokeWidth = 1.75,
  color = 'currentColor',
  title,
  className,
}: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      style={{ display: 'block', flex: '0 0 auto' }}
    >
      {title ? <title>{title}</title> : null}
      {PATHS[name]}
    </svg>
  );
}
