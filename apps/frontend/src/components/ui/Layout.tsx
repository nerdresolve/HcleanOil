import type { ReactNode } from 'react';
import s from './Layout.module.css';

const cx = (...v: (string | false | undefined)[]) => v.filter(Boolean).join(' ');

/* -------------------------------------------------------------- container */

export function Container({
  children,
  narrow,
  className,
}: {
  children: ReactNode;
  narrow?: boolean;
  className?: string;
}) {
  return (
    <div className={cx(s.container, narrow && s.narrow, className)}>{children}</div>
  );
}

/* ---------------------------------------------------------------- section */

type SectionTone = 'page' | 'card' | 'sunken' | 'inverse';

const TONE: Record<SectionTone, string> = {
  page: s.tonePage,
  card: s.toneCard,
  sunken: s.toneSunken,
  inverse: s.toneInverse,
};

export function Section({
  children,
  tone = 'page',
  size = 'md',
  id,
  className,
}: {
  children: ReactNode;
  tone?: SectionTone;
  size?: 'sm' | 'md' | 'lg';
  id?: string;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cx(
        size === 'sm' ? s.sectionSm : size === 'lg' ? s.sectionLg : s.section,
        TONE[tone],
        className,
      )}
    >
      {children}
    </section>
  );
}

/* --------------------------------------------------------- sectionHeading */

export function SectionHeading({
  eyebrow,
  title,
  description,
  tone = 'dark',
  align = 'left',
  as: Tag = 'h2',
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  tone?: 'dark' | 'light';
  align?: 'left' | 'center';
  as?: 'h1' | 'h2' | 'h3';
}) {
  const light = tone === 'light';
  return (
    <div className={cx(s.heading, align === 'center' && s.headingCenter)}>
      {eyebrow ? (
        <span className={cx(s.eyebrow, light && s.eyebrowLight)}>{eyebrow}</span>
      ) : null}
      <Tag className={cx(s.title, light && s.titleLight)}>{title}</Tag>
      {description ? (
        <p className={cx(s.description, light && s.descriptionLight)}>{description}</p>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------- card */

export function Card({
  children,
  tone = 'default',
  className,
}: {
  children: ReactNode;
  tone?: 'default' | 'sunken' | 'inverse';
  className?: string;
}) {
  return (
    <div
      className={cx(
        s.card,
        tone === 'sunken' && s.cardSunken,
        tone === 'inverse' && s.cardInverse,
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ badge */

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'accent' | 'inverse';
}) {
  return (
    <span
      className={cx(
        s.badge,
        tone === 'accent' && s.badgeAccent,
        tone === 'inverse' && s.badgeInverse,
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------- grid */

export function Grid({
  children,
  cols = 3,
  className,
}: {
  children: ReactNode;
  cols?: 2 | 3 | 4;
  className?: string;
}) {
  return (
    <div
      className={cx(
        s.grid,
        cols === 2 ? s.cols2 : cols === 4 ? s.cols4 : s.cols3,
        className,
      )}
    >
      {children}
    </div>
  );
}
