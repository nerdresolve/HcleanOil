import Link from 'next/link';
import { Container } from '@/components/ui/Layout';
import { QuoteButton } from '@/components/quote/QuoteButton';
import { Logo } from '@/components/ui/Logo';
import { NavLinks } from './NavLinks';
import s from './Header.module.css';

export function Header() {
  return (
    <header className={s.header}>
      <Container>
        <div className={s.bar}>
          <Link href="/" className={s.brand} aria-label="HCLEAN — página inicial">
            <Logo height={38} tone="dark" />
          </Link>

          <NavLinks />

          <div className={s.actions}>
            <QuoteButton size="md">Solicitar orçamento</QuoteButton>
          </div>
        </div>
      </Container>
    </header>
  );
}
