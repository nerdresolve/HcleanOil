import Link from 'next/link';
import type { ReactNode } from 'react';
import { Container } from '@/components/ui/Layout';
import { ButtonLink } from '@/components/ui/Button';
import { QuoteButton } from '@/components/quote/QuoteButton';
import { Icon } from '@/components/ui/Icon';
import type { IconName } from '@/data/site';
import s from './Shared.module.css';

/* Contador para ids únicos de <defs> quando o mesmo ornamento aparece duas
   vezes na página. */
let seq = 0;

/* ------------------------------------------------------------------- hero */

/** Ondas decorativas do topo — mesmas curvas do design system. */
function HeroArt() {
  return (
    <div className={s.heroArt} aria-hidden="true">
      <svg viewBox="0 0 1440 700" preserveAspectRatio="none">
        <path
          d="M0,520 C300,430 700,400 1000,470 C1200,516 1340,540 1440,490 L1440,700 L0,700 Z"
          fill="#0E3D27"
        />
        <path
          d="M0,600 C260,520 520,506 780,556 C1020,602 1240,616 1440,566"
          fill="none"
          stroke="#2B83BF"
          strokeWidth="3"
          opacity=".5"
        />
        <path
          d="M900,80 C1080,40 1300,110 1440,50"
          fill="none"
          stroke="#00BF63"
          strokeWidth="4"
          opacity=".55"
        />
      </svg>
    </div>
  );
}

export function Hero({ children }: { children: ReactNode }) {
  return (
    <section className={s.hero}>
      <HeroArt />
      <Container>
        <div className={s.heroInner}>{children}</div>
      </Container>
    </section>
  );
}

export const HeroSplit = ({ children }: { children: ReactNode }) => (
  <div className={s.heroSplit}>{children}</div>
);

export const HeroCopy = ({ children }: { children: ReactNode }) => (
  <div className={s.heroCopy}>{children}</div>
);

export const HeroTitle = ({ children }: { children: ReactNode }) => (
  <h1 className={s.heroTitle}>{children}</h1>
);

export const HeroLead = ({ children }: { children: ReactNode }) => (
  <p className={s.heroLead}>{children}</p>
);

export const HeroText = ({ children }: { children: ReactNode }) => (
  <p className={s.heroText}>{children}</p>
);

export const Actions = ({ children }: { children: ReactNode }) => (
  <div className={s.actions}>{children}</div>
);

/* -------------------------------------------------------------- ornamento */

/**
 * Ornamentos de marca — versões em traço do símbolo, para preencher fundos sem
 * competir com o conteúdo. Todos herdam `currentColor`, então tom e opacidade
 * ficam no CSS de quem usa.
 *
 * O viewBox tem folga em volta do desenho, de modo que a peça possa sangrar
 * pela borda da seção sem parecer cortada no meio do traço.
 */

/** Anel com as três ondas. Peça principal, para cantos amplos. */
export function BrandWaveArt({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <svg viewBox="0 0 640 640" fill="none">
        <circle cx="320" cy="320" r="286" stroke="currentColor" strokeWidth="9" />
        {[0, 36, 72].map((dy, i) => (
          <path
            key={dy}
            d={`M58 ${300 + dy} C168 ${222 + dy}, 288 ${222 + dy}, 398 ${288 + dy} C472 ${333 + dy}, 536 ${343 + dy}, 584 ${310 + dy}`}
            stroke="currentColor"
            strokeWidth={11 - i * 2}
            strokeLinecap="round"
          />
        ))}
      </svg>
    </div>
  );
}

/** Só as ondas, largas e paralelas — boa para faixas horizontais. */
export function BrandLinesArt({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <svg viewBox="0 0 900 320" fill="none" preserveAspectRatio="none">
        {[0, 40, 80, 120, 160].map((dy, i) => (
          <path
            key={dy}
            d={`M-40 ${90 + dy} C160 ${20 + dy}, 340 ${20 + dy}, 520 ${86 + dy} C660 ${137 + dy}, 800 ${146 + dy}, 940 ${104 + dy}`}
            stroke="currentColor"
            strokeWidth={i % 2 === 0 ? 9 : 4}
            strokeLinecap="round"
          />
        ))}
      </svg>
    </div>
  );
}

/** Anéis concêntricos, referência ao alcance da barreira em cerco. */
export function BrandRingsArt({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <svg viewBox="0 0 520 520" fill="none">
        {[250, 196, 142, 88, 40].map((r, i) => (
          <circle
            key={r}
            cx="260"
            cy="260"
            r={r}
            stroke="currentColor"
            strokeWidth={i === 0 ? 8 : 3}
            strokeDasharray={i % 2 ? '14 18' : undefined}
          />
        ))}
      </svg>
    </div>
  );
}

/** Malha de pontos, textura discreta para blocos escuros. */
export function BrandDotsArt({ className }: { className?: string }) {
  const id = `hc-dots-${++seq}`;
  return (
    <div className={className} aria-hidden="true">
      <svg viewBox="0 0 400 400" fill="none">
        <defs>
          <pattern id={id} width="26" height="26" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="2.4" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="400" height="400" fill={`url(#${id})`} />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ wave */

/**
 * Transição em onda entre duas faixas de cor.
 *
 * `from` é a cor da seção ACIMA e `to` a da seção ABAIXO. A faixa é pintada
 * com `from` e a curva desenhada em `to` fecha o vão até a próxima seção — a
 * curva sempre toca a base do quadro, senão sobra uma tira da cor de cima
 * embaixo da onda.
 */
export function Wave({
  from = 'var(--hc-green-800)',
  to = 'var(--surface-page)',
}: {
  from?: string;
  to?: string;
}) {
  return (
    <div className={s.wave} style={{ background: from }} aria-hidden="true">
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path
          d="M0,52 C240,110 480,120 720,96 C960,72 1200,18 1440,44 L1440,120 L0,120 Z"
          fill={to}
        />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------ media frame */

/**
 * Espaço reservado para foto. Trocar por <Image> assim que as imagens reais
 * de operação existirem — o alt já descreve o conteúdo esperado.
 */
export function MediaFrame({
  label,
  tone = 'light',
}: {
  label: string;
  tone?: 'light' | 'dark';
}) {
  return (
    <div
      className={`${s.frame} ${tone === 'dark' ? s.frameDark : ''}`}
      role="img"
      aria-label={label}
    >
      {label}
    </div>
  );
}

/* ----------------------------------------------------------------- split */

/**
 * Duas colunas. `reverse` só muda a proporção — a ordem visual continua a do
 * HTML, então quem escreve a página decide o que vem primeiro.
 */
export const Split = ({
  children,
  reverse,
}: {
  children: ReactNode;
  reverse?: boolean;
}) => (
  <div className={reverse ? `${s.split} ${s.splitReverse}` : s.split}>{children}</div>
);

export const Prose = ({ children }: { children: ReactNode }) => (
  <div className={s.prose}>{children}</div>
);

/* --------------------------------------------------------------- feature */

export function Feature({
  icon,
  title,
  text,
}: {
  icon: IconName;
  title: string;
  text: string;
}) {
  return (
    <div className={s.feature}>
      <span className={s.featureIcon}>
        <Icon name={icon} size={22} />
      </span>
      <h3 className={s.featureTitle}>{title}</h3>
      <p className={s.featureText}>{text}</p>
    </div>
  );
}

export function Pillar({
  icon,
  title,
  text,
}: {
  icon: IconName;
  title: string;
  text: string;
}) {
  return (
    <div className={s.pillar}>
      <Icon name={icon} size={24} color="var(--hc-green-300)" />
      <h3 className={s.pillarTitle}>{title}</h3>
      <p className={s.pillarText}>{text}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ stat */

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className={s.stat}>
      <span className={s.statValue}>{value}</span>
      <span className={s.statLabel}>{label}</span>
    </div>
  );
}

/* ------------------------------------------------------------- cta banner */

/**
 * Faixa de chamada. A ação principal pode ser um link (`href`) ou o pop-up de
 * orçamento (`quote`), que é o caso da maioria dos CTAs comerciais.
 */
export function CTABanner({
  eyebrow,
  title,
  text,
  primary,
  secondary,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  primary: { label: string } & ({ href: string } | { quote: true; productSlug?: string });
  secondary?: { href: string; label: string };
}) {
  return (
    <div className={s.cta}>
      <div className={s.ctaArt} aria-hidden="true">
        <svg viewBox="0 0 1440 300" preserveAspectRatio="none" width="100%" height="100%">
          <path
            d="M0,220 C300,150 700,120 1000,180 C1200,220 1340,240 1440,200 L1440,300 L0,300 Z"
            fill="#0E3D27"
          />
          <path
            d="M700,40 C900,20 1200,60 1440,20"
            fill="none"
            stroke="#00BF63"
            strokeWidth="3"
            opacity=".5"
          />
        </svg>
      </div>
      <div className={s.ctaCopy}>
        {eyebrow ? <span className={s.ctaEyebrow}>{eyebrow}</span> : null}
        <h2 className={s.ctaTitle}>{title}</h2>
        {text ? <p className={s.ctaText}>{text}</p> : null}
      </div>
      <div className={s.ctaActions}>
        {'href' in primary ? (
          <ButtonLink href={primary.href} size="lg" iconRight="arrow-right">
            {primary.label}
          </ButtonLink>
        ) : (
          <QuoteButton
            size="lg"
            iconRight="arrow-right"
            productSlug={primary.productSlug}
          >
            {primary.label}
          </QuoteButton>
        )}
        {secondary ? (
          <ButtonLink href={secondary.href} size="lg" variant="inverse-outline">
            {secondary.label}
          </ButtonLink>
        ) : null}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------- breadcrumbs */

export function Breadcrumbs({
  trail,
}: {
  trail: { href?: string; label: string }[];
}) {
  return (
    <nav className={s.crumbs} aria-label="Trilha de navegação">
      {trail.map((item, i) => (
        <span key={item.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          {i > 0 ? <Icon name="chevron-right" size={13} /> : null}
          {item.href ? (
            <Link href={item.href}>{item.label}</Link>
          ) : (
            <span className={s.crumbCurrent}>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
