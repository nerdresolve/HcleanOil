'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { nav } from '@/data/site';
import s from './Header.module.css';

/**
 * Único componente de cliente do cabeçalho — existe só para marcar o link
 * ativo. O resto do header permanece renderizado no servidor.
 */
export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className={s.nav} aria-label="Navegação principal">
      {nav.map((item) => {
        const active =
          item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`${s.link} ${active ? s.linkActive : ''}`}
            aria-current={active ? 'page' : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
