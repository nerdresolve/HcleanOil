import type { Metadata } from 'next';
import { Container, Section, SectionHeading, Card } from '@/components/ui/Layout';
import { Icon } from '@/components/ui/Icon';
import { ContactForm } from '@/components/sections/ContactForm';
import { site } from '@/data/site';
import s from './contato.module.css';

export const metadata: Metadata = {
  title: 'Contato',
  description:
    'Fale com a equipe comercial da HCLEAN. Nossa equipe entra em contato para orientar sobre produtos, aplicações e fornecimento.',
  alternates: { canonical: '/contato' },
};

const HELP = [
  'Identificar o equipamento adequado à sua operação.',
  'Orientar sobre aplicações e formas de uso.',
  'Informar condições de fornecimento.',
];

export default function ContatoPage() {
  return (
    <Section tone="page">
      <Container>
        <div className={s.layout}>
          <div className={s.main}>
            <SectionHeading
              as="h1"
              eyebrow="Contato"
              title="Precisa de uma solução para sua operação?"
              description="Nossa equipe está preparada para entender sua necessidade e indicar os equipamentos mais adequados."
            />
            <Card className={s.formCard}>
              <ContactForm />
            </Card>
          </div>

          <aside className={s.aside}>
            <Card tone="inverse" className={s.contactCard}>
              <span className={s.eyebrowLight}>Atendimento comercial</span>
              <h2 className={s.asideTitle}>Fale com um especialista</h2>
              <p className={s.asideText}>
                Nossa equipe ajuda a identificar a solução adequada para o seu cenário
                operacional.
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
            </Card>

            <Card>
              <span className={s.eyebrow}>Como podemos ajudar</span>
              <ul className={s.helpList}>
                {HELP.map((h) => (
                  <li key={h} className={s.helpItem}>
                    <Icon
                      name="check"
                      size={17}
                      strokeWidth={2.25}
                      color="var(--hc-green-600)"
                    />
                    {h}
                  </li>
                ))}
              </ul>
            </Card>
          </aside>
        </div>
      </Container>
    </Section>
  );
}
