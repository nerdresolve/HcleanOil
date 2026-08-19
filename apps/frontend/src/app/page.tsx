import type { Metadata } from 'next';
import Image from 'next/image';
import { Container, Section, SectionHeading, Grid, Badge } from '@/components/ui/Layout';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import {
  Hero,
  HeroSplit,
  HeroCopy,
  HeroTitle,
  HeroLead,
  HeroText,
  Actions,
  Split,
  Prose,
  Feature,
  Pillar,
  Stat,
  CTABanner,
} from '@/components/sections/Shared';
import { ProductCard } from '@/components/sections/ProductCard';
import {
  categories,
  caseStudies,
  faq,
  pillars,
  products,
  proofPoints,
  site,
} from '@/data/site';
import s from './home.module.css';

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  alternates: { canonical: '/' },
};

/* O FAQ vira dados estruturados: o Google usa isso para o rich result de
   perguntas, que ocupa mais espaço no resultado de busca. */
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function HomePage() {
  return (
    <>
      <Hero>
        <HeroSplit>
          <HeroCopy>
            <Badge tone="inverse">Fabricante nacional há mais de 18 anos</Badge>
            <HeroTitle>Equipamentos de proteção ambiental com qualidade comprovada</HeroTitle>
            <HeroLead>
              Durabilidade e resistência que garantem agilidade, segurança e conformidade
              ambiental no seu dia a dia operacional.
            </HeroLead>
            <HeroText>
              Fabricamos barreiras de contenção, materiais absorventes, kits de emergência
              e tanques para resposta a derramamentos de óleo e outros contaminantes.
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
          <div className={s.heroImage}>
            <Image
              src="/institucional/operacao-cerco-barreira.webp"
              alt="Barreira de contenção HCLEAN em operação de cerco sobre a água"
              width={640}
              height={480}
              priority
              sizes="(max-width: 900px) 100vw, 45vw"
            />
          </div>
        </HeroSplit>
      </Hero>

      {/* Números */}
      <Section tone="inverse" size="sm">
        <Container>
          <Grid cols={4}>
            {proofPoints.map((p) => (
              <Stat key={p.label} value={p.value} label={p.label} />
            ))}
          </Grid>
        </Container>
      </Section>

      {/* Experiência */}
      <Section tone="page">
        <Container>
          <Split>
            <Prose>
              <SectionHeading
                eyebrow="O material certo para a operação"
                title="O fabricante brasileiro com experiência em grandes emergências ambientais"
                description="Quando a emergência bate à porta, somos a escolha de quem não pode errar."
              />
              <p>
                A HCLEAN fabrica equipamentos para contenção, absorção e atendimento
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
            <div className={s.sideImage}>
              <Image
                src="/produtos/materiais-absorventes.webp"
                alt="Linhas de material absorvente HCLEAN"
                width={560}
                height={560}
                sizes="(max-width: 900px) 100vw, 40vw"
              />
            </div>
          </Split>
        </Container>
      </Section>

      {/* Soluções */}
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

      {/* Produtos */}
      <Section tone="page">
        <Container>
          <div className={s.rowHead}>
            <SectionHeading
              eyebrow="Produtos"
              title="Soluções prontas para a operação"
            />
            <ButtonLink href="/produtos" variant="outline" iconRight="arrow-right">
              Ver produtos
            </ButtonLink>
          </div>
          <Grid cols={3}>
            {products.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </Grid>
        </Container>
      </Section>

      {/* Operações reais */}
      <Section tone="inverse">
        <Container>
          <SectionHeading
            tone="light"
            eyebrow="Operações reais"
            title="Equipamentos presentes em grandes emergências ambientais"
            description="Quem já testou, recomenda. Algumas das operações atendidas com equipamentos HCLEAN."
          />
          <div style={{ marginTop: 48 }}>
            <Grid cols={4}>
              {caseStudies.map((c) => (
                <article key={c.name} className={s.case}>
                  <h3 className={s.caseName}>{c.name}</h3>
                  <p className={s.caseText}>{c.text}</p>
                </article>
              ))}
            </Grid>
          </div>
        </Container>
      </Section>

      {/* Por que HCLEAN */}
      <Section tone="page">
        <Container>
          <SectionHeading
            eyebrow="Por que HCLEAN?"
            title="Experiência técnica para situações que não podem esperar."
          />
          <div style={{ marginTop: 48 }}>
            <Grid cols={4}>
              {pillars.map((p) => (
                <Feature key={p.title} icon={p.icon} title={p.title} text={p.text} />
              ))}
            </Grid>
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section tone="card">
        <Container narrow>
          <SectionHeading
            eyebrow="Dúvidas frequentes"
            title="Perguntas frequentes"
          />
          <div className={s.faq}>
            {faq.map((f) => (
              /* <details> nativo: acordeão acessível e sem uma linha de JS. */
              <details key={f.q} className={s.faqItem}>
                <summary className={s.faqQuestion}>
                  {f.q}
                  <Icon name="chevron-right" size={18} className={s.faqChevron} />
                </summary>
                <p className={s.faqAnswer}>{f.a}</p>
              </details>
            ))}
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
