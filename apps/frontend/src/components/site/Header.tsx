import Link from 'next/link';
import { Container } from '@/components/ui/Layout';
import { ButtonLink } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { NavLinks } from './NavLinks';
import s from './Header.module.css';

export function Header() {
  return (
    <header className={s.header}>
      <Container>
        <div className={s.bar}>
          <Link href="/" className={s.brand} aria-label="HCLEAN — página inicial">
            <Logo height={34} tone="light" />
          </Link>

          <NavLinks />

          <div className={s.actions}>
            <span className={s.hideOnSmall}>
              <ButtonLink href="/produtos" size="sm" variant="inverse-outline">
                Produtos
              </ButtonLink>
            </span>
            <ButtonLink href="/contato" size="sm">
              Solicitar atendimento
            </ButtonLink>
          </div>
        </div>
      </Container>
    </header>
  );
}
