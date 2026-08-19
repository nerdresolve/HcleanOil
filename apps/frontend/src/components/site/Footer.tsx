import Link from 'next/link';
import { Container } from '@/components/ui/Layout';
import { Icon } from '@/components/ui/Icon';
import { Logo } from '@/components/ui/Logo';
import { categories, site } from '@/data/site';
import s from './Footer.module.css';

const COLUMNS = [
  {
    title: 'Soluções',
    links: categories.map((c) => ({ href: `/produtos#${c.slug}`, label: c.name })),
  },
  {
    title: 'Empresa',
    links: [
      { href: '/sobre', label: 'Sobre a HCLEAN' },
      { href: '/sobre#historia', label: 'Nossa história' },
      { href: '/sobre#parceria', label: 'Parceria Hidroclean' },
    ],
  },
  {
    title: 'Atendimento',
    links: [
      { href: '/contato', label: 'Solicitar atendimento' },
      { href: '/contato', label: 'Falar com um especialista' },
      { href: '/produtos', label: 'Ver produtos' },
    ],
  },
];

export function Footer() {
  return (
    <footer className={s.footer}>
      <Container>
        <div className={s.grid}>
          <div className={s.brandCol}>
            <Logo height={32} tone="light" />
            <p className={s.blurb}>
              Equipamentos e soluções para resposta a emergências ambientais. Há mais
              de 18 anos apoiando operações de contenção e absorção no Brasil.
            </p>
            <div className={s.contactList}>
              <a className={s.contactItem} href={`mailto:${site.contact.email}`}>
                <Icon name="mail" size={16} color="var(--hc-green-300)" />
                {site.contact.email}
              </a>
              <a className={s.contactItem} href={site.contact.phoneHref}>
                <Icon name="phone" size={16} color="var(--hc-green-300)" />
                {site.contact.phone}
              </a>
              <span className={s.contactItem}>
                <Icon name="globe" size={16} color="var(--hc-green-300)" />
                {site.contact.site}
              </span>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title} className={s.col}>
              <span className={s.colTitle}>{col.title}</span>
              {col.links.map((l) => (
                <Link key={l.label + l.href} href={l.href} className={s.colLink}>
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className={s.bottom}>
          <span>
            © {new Date().getFullYear()} {site.legalName}
          </span>
          <span>Parceira técnica da Hidroclean</span>
        </div>
      </Container>
    </footer>
  );
}
