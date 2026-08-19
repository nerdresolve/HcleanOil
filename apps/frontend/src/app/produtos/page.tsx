import type { Metadata } from 'next';
import { Container, Section, SectionHeading, Grid } from '@/components/ui/Layout';
import { ButtonLink } from '@/components/ui/Button';
import {
  Hero,
  HeroCopy,
  HeroTitle,
  HeroLead,
  Actions,
  Breadcrumbs,
  CTABanner,
} from '@/components/sections/Shared';
import { ProductCard } from '@/components/sections/ProductCard';
import { categories, productsByCategory, site } from '@/data/site';
import s from './produtos.module.css';

export const metadata: Metadata = {
  title: 'Produtos',
  description:
    'Conheça o portfólio HCLEAN: barreiras de contenção, absorventes, kits de emergência, tanques e soluções para atendimento a derramamentos.',
  alternates: { canonical: '/produtos' },
};

export default function ProdutosPage() {
  return (
    <>
      <Hero>
        <Breadcrumbs trail={[{ href: '/', label: 'Início' }, { label: 'Produtos' }]} />
        <div style={{ height: 20 }} />
        <HeroCopy>
          <HeroTitle>Equipamentos para resposta a emergências ambientais</HeroTitle>
          <HeroLead>
            Conheça nosso portfólio de barreiras de contenção, absorventes, kits de
            emergência, tanques e soluções para atendimento a derramamentos.
          </HeroLead>
          <Actions>
            <ButtonLink href="/contato" size="lg" iconRight="arrow-right">
              Solicitar atendimento
            </ButtonLink>
          </Actions>
        </HeroCopy>
      </Hero>

      <Section tone="page" size="sm">
        <Container>
          <SectionHeading
            eyebrow="Introdução"
            title="A solução certa para cada cenário operacional"
            description="Cada emergência apresenta características diferentes. Por isso, a HCLEAN trabalha com um portfólio desenvolvido para diferentes etapas da resposta ambiental. Explore nossas soluções e encontre o equipamento adequado à sua necessidade."
          />

          {/* Índice das categorias — atalho para quem chega buscando um tipo. */}
          <nav className={s.jump} aria-label="Categorias">
            {categories.map((c) => (
              <a key={c.slug} href={`#${c.slug}`} className={s.jumpLink}>
                {c.name}
              </a>
            ))}
          </nav>
        </Container>
      </Section>

      {categories.map((category, i) => {
        const items = productsByCategory(category.slug);
        if (!items.length) return null;
        return (
          <Section
            key={category.slug}
            id={category.slug}
            tone={i % 2 === 0 ? 'card' : 'page'}
          >
            <Container>
              <div className={s.categoryHead}>
                <h2 className={s.categoryTitle}>{category.name}</h2>
                <p className={s.categoryIntro}>{category.intro}</p>
              </div>
              <Grid cols={4}>
                {items.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </Grid>
            </Container>
          </Section>
        );
      })}

      <Section tone="page">
        <Container>
          <CTABanner
            eyebrow="Atendimento"
            title="Precisa de uma solução para sua operação?"
            text="Nossa equipe está preparada para entender sua necessidade e indicar os equipamentos mais adequados."
            primary={{ href: '/contato', label: 'Solicitar atendimento' }}
          />
        </Container>
      </Section>
    </>
  );
}
