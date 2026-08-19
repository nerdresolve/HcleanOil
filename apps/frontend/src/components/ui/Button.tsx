import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { Icon } from './Icon';
import type { IconName } from '@/data/site';
import s from './Button.module.css';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'inverse-outline';
type Size = 'sm' | 'md' | 'lg';

const VARIANT: Record<Variant, string> = {
  primary: s.primary,
  secondary: s.secondary,
  outline: s.outline,
  ghost: s.ghost,
  'inverse-outline': s.inverseOutline,
};

const ICON_SIZE: Record<Size, number> = { sm: 16, md: 18, lg: 20 };

type BaseProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  iconLeft?: IconName;
  iconRight?: IconName;
  fullWidth?: boolean;
  className?: string;
};

const classes = (
  { variant = 'primary', size = 'md', fullWidth, className }: BaseProps,
) =>
  [s.base, s[size], VARIANT[variant], fullWidth ? s.fullWidth : '', className]
    .filter(Boolean)
    .join(' ');

const inner = ({ children, iconLeft, iconRight, size = 'md' }: BaseProps) => (
  <>
    {iconLeft ? <Icon name={iconLeft} size={ICON_SIZE[size]} strokeWidth={2} /> : null}
    {children}
    {iconRight ? <Icon name={iconRight} size={ICON_SIZE[size]} strokeWidth={2} /> : null}
  </>
);

/** Botão-link. É o caminho normal no site: quase todo CTA navega. */
export function ButtonLink(props: BaseProps & { href: string }) {
  const { href, ...rest } = props;
  return (
    <Link href={href} className={classes(props)}>
      {inner(rest as BaseProps)}
    </Link>
  );
}

/** Botão real, para submit de formulário. */
export function Button(
  props: BaseProps & Omit<ComponentProps<'button'>, 'className' | 'children'>,
) {
  const { children, variant, size, iconLeft, iconRight, fullWidth, className, ...rest } =
    props;
  return (
    <button className={classes(props)} {...rest}>
      {inner({ children, iconLeft, iconRight, size })}
    </button>
  );
}
