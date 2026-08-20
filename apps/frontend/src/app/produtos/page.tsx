import type { Metadata } from 'next';
import { Container, Section, SectionHeading, Grid } from '@/components/ui/Layout';
import { ButtonLink } from '@/components/ui/Button';
import { QuoteButton } from '@/components/quote/QuoteButton';
import {
  Hero,
  HeroCopy,
  HeroTitle,
  HeroLead,
  Actions,
  Breadcrumbs,
  CTABanner,
} from '@/components/sections/Shared';
import { ProductCard, FormatoCard } from '@/components/sections/ProductCard';
import { Ornament, ornamentHost } from '@/components/sections/Ornament';
import { categories, productsByCategory } from '@/data/site';
import { formatos } from '@/data/formatos';
import s from './produtos.module.css';

export const metadata: Metadata = {
  title: 'Produtos',
  description:
    'Barreiras de contenção, três linhas de material absorvente, kits SOPEP e de primeiro atendimento e tanques para armazenamento temporário.',
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
            Conheça nosso portfólio de barreiras de contenção, materiais absorventes,
            kits de emergência e tanques para atendimento a derramamentos.
          </HeroLead>
          <Actions>
            <QuoteButton size="lg" iconRight="arrow-right">Solicitar orçamento</QuoteButton>
          </Actions>
        </HeroCopy>
      </Hero>

      <Section tone="page" size="sm" className={ornamentHost}>
        <Ornament shape="rings" place="topRight" />
        <Container>
          <SectionHeading
            eyebrow="Introdução"
            title="A solução certa para cada cenário operacional"
            description="Cada emergência apresenta características diferentes. Por isso, a HCLEAN trabalha com um portfólio desenvolvido para diferentes etapas da resposta ambiental."
          />
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
            className={ornamentHost}
          >
            {/* Alterna a peça e o lado a cada categoria, para a sequência de
                faixas não repetir o mesmo canto. */}
            <Ornament
              shape={i % 2 === 0 ? 'lines' : 'wave'}
              place={i % 2 === 0 ? 'bottomRight' : 'left'}
            />
            <Container>
              <div className={s.categoryHead}>
                <h2 className={s.categoryTitle}>{category.name}</h2>
                <p className={s.categoryIntro}>{category.intro}</p>
              </div>
              <Grid cols={3}>
                {items.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </Grid>
            </Container>
          </Section>
        );
      })}

      {/* Entrada alternativa ao catálogo: quem procura "cordão absorvente" não
          sabe necessariamente o que é "linha branca". Cada página reúne o mesmo
          formato nas três linhas. */}
      <Section tone="card" className={ornamentHost}>
        <Ornament shape="wave" place="right" />
        <Container>
          <SectionHeading
            eyebrow="Buscar por formato"
            title="Prefere procurar pelo tipo de peça?"
            description="Os absorventes existem em seis formatos, cada um para uma etapa da resposta. Veja o formato lado a lado nas três linhas e escolha pela substância da sua operação."
          />
          <div style={{ marginTop: 44 }}>
            <Grid cols={3}>
              {formatos.map((f) => (
                <FormatoCard key={f.slug} formato={f} />
              ))}
            </Grid>
          </div>
        </Container>
      </Section>

      <Section tone="page" className={ornamentHost}>
        <Ornament shape="dots" place="topLeft" fade="inLeft" />
        <Container>
          <CTABanner
            eyebrow="Atendimento"
            title="Precisa de uma solução para sua operação?"
            text="Nossa equipe está preparada para entender sua necessidade e indicar os equipamentos mais adequados."
            primary={{ quote: true, label: 'Solicitar orçamento' }}
          />
        </Container>
      </Section>
    </>
  );
}
