import type { Metadata } from 'next';
import { Container, Section, SectionHeading, Grid, Badge } from '@/components/ui/Layout';
import { ButtonLink } from '@/components/ui/Button';
import {
  Hero,
  HeroSplit,
  HeroCopy,
  HeroTitle,
  HeroLead,
  HeroText,
  Actions,
  MediaFrame,
  Split,
  Prose,
  Feature,
  Pillar,
  CTABanner,
} from '@/components/sections/Shared';
import { ProductCard } from '@/components/sections/ProductCard';
import { categories, pillars, products, site } from '@/data/site';

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <>
      <Hero>
        <HeroSplit>
          <HeroCopy>
            <Badge tone="inverse">Referência nacional há mais de 18 anos</Badge>
            <HeroTitle>Soluções para resposta rápida a emergências ambientais</HeroTitle>
            <HeroLead>
              Equipamentos desenvolvidos para contenção, absorção e atendimento a
              derramamentos de óleo e outros contaminantes.
            </HeroLead>
            <HeroText>
              Há mais de 18 anos, a HCLEAN fornece equipamentos e soluções para operações
              de resposta a emergências ambientais em todo o Brasil.
            </HeroText>
            <Actions>
              <ButtonLink href="/produtos" size="lg" iconRight="arrow-right">
                Conheça nossas soluções
              </ButtonLink>
              <ButtonLink href="/contato" size="lg" variant="inverse-outline">
                Solicitar atendimento técnico
              </ButtonLink>
            </Actions>
          </HeroCopy>
          <MediaFrame tone="dark" label="Operação de contenção de derramamento" />
        </HeroSplit>
      </Hero>

      {/* Experiência que responde quando importa */}
      <Section tone="page">
        <Container>
          <Split>
            <Prose>
              <SectionHeading
                eyebrow="Experiência que responde quando importa"
                title="Equipamentos para situações que exigem resposta imediata."
                description="Em uma emergência ambiental, tempo, confiabilidade e preparo fazem diferença."
              />
              <p>
                A HCLEAN fornece equipamentos para contenção, absorção e atendimento
                inicial, ajudando empresas e equipes operacionais a estarem preparadas
                para agir com segurança e eficiência.
              </p>
              <p>
                Com mais de 18 anos de atuação, construímos nossa experiência junto a
                operações reais de resposta a derramamentos e proteção ambiental.
              </p>
              <ButtonLink href="/sobre" variant="outline" iconRight="arrow-right">
                Conheça a HCLEAN
              </ButtonLink>
            </Prose>
            <MediaFrame label="Equipe técnica em operação de resposta" />
          </Split>
        </Container>
      </Section>

      {/* Nossas soluções */}
      <Section tone="card">
        <Container>
          <SectionHeading
            eyebrow="Nossas soluções"
            title="Equipamentos para cada etapa da resposta ambiental"
            description="Da contenção do contaminante à absorção e ao atendimento inicial, a HCLEAN oferece soluções para diferentes necessidades operacionais."
          />
          <div style={{ marginTop: 48 }}>
            <Grid cols={4}>
              {categories.map((c) => (
                <Feature key={c.slug} icon={c.icon} title={c.name} text={c.short} />
              ))}
            </Grid>
          </div>
          <div style={{ marginTop: 40 }}>
            <ButtonLink href="/produtos" variant="outline" iconRight="arrow-right">
              Ver todos os produtos
            </ButtonLink>
          </div>
        </Container>
      </Section>

      {/* Produtos em destaque */}
      <Section tone="page">
        <Container>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 24,
              marginBottom: 40,
            }}
          >
            <SectionHeading
              eyebrow="Produtos em destaque"
              title="Soluções prontas para a operação"
            />
            <ButtonLink href="/produtos" variant="outline" iconRight="arrow-right">
              Ver produtos
            </ButtonLink>
          </div>
          <Grid cols={4}>
            {products.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </Grid>
        </Container>
      </Section>

      {/* Por que HCLEAN */}
      <Section tone="inverse">
        <Container>
          <SectionHeading
            tone="light"
            eyebrow="Por que HCLEAN?"
            title="Experiência técnica para situações que não podem esperar."
          />
          <div style={{ marginTop: 48 }}>
            <Grid cols={4}>
              {pillars.map((p) => (
                <Pillar key={p.title} icon={p.icon} title={p.title} text={p.text} />
              ))}
            </Grid>
          </div>
        </Container>
      </Section>

      {/* CTA final */}
      <Section tone="page">
        <Container>
          <CTABanner
            eyebrow="Atendimento técnico"
            title="Sua operação está preparada para uma emergência ambiental?"
            text="Conte com equipamentos adequados para contenção, absorção e atendimento. Fale com nossa equipe e encontre a solução mais adequada para sua operação."
            primary={{ href: '/contato', label: 'Falar com um especialista' }}
            secondary={{ href: '/produtos', label: 'Ver produtos' }}
          />
        </Container>
      </Section>
    </>
  );
}
