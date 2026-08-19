import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container, Section, SectionHeading, Grid, Badge } from '@/components/ui/Layout';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import {
  Hero,
  HeroSplit,
  HeroCopy,
  HeroTitle,
  HeroLead,
  Actions,
  MediaFrame,
  Split,
  Prose,
  Breadcrumbs,
  CTABanner,
} from '@/components/sections/Shared';
import { ProductCard } from '@/components/sections/ProductCard';
import {
  findCategory,
  findProduct,
  products,
  relatedProducts,
  site,
} from '@/data/site';
import s from './produto.module.css';

type Params = { params: Promise<{ slug: string }> };

/** Todas as páginas de produto são geradas no build — HTML estático, LCP baixo. */
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = findProduct(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.lead,
    alternates: { canonical: `/produtos/${product.slug}` },
    openGraph: {
      type: 'website',
      title: `${product.name} | ${site.name}`,
      description: product.lead,
      url: `/produtos/${product.slug}`,
    },
  };
}

export default async function ProdutoPage({ params }: Params) {
  const { slug } = await params;
  const product = findProduct(slug);
  if (!product) notFound();

  const category = findCategory(product.category);
  const related = relatedProducts(product);
  const hasSpecs = product.specs.length > 0;

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.about,
    category: category?.name,
    brand: { '@type': 'Brand', name: site.name },
    manufacturer: { '@type': 'Organization', name: site.legalName },
  };

  return (
    <>
      <Hero>
        <Breadcrumbs
          trail={[
            { href: '/', label: 'Início' },
            { href: '/produtos', label: 'Produtos' },
            { label: category?.name ?? 'Produto' },
          ]}
        />
        <div style={{ height: 24 }} />
        <HeroSplit>
          <HeroCopy>
            {category ? <Badge tone="inverse">{category.name}</Badge> : null}
            <HeroTitle>{product.name}</HeroTitle>
            <HeroLead>{product.lead}</HeroLead>
            <Actions>
              <ButtonLink href="/contato" size="lg" iconRight="arrow-right">
                Solicitar cotação
              </ButtonLink>
              <ButtonLink href="/contato" size="lg" variant="inverse-outline">
                Falar com um especialista
              </ButtonLink>
            </Actions>
          </HeroCopy>
          <MediaFrame tone="dark" label={product.name} />
        </HeroSplit>
      </Hero>

      {/* Sobre o produto */}
      <Section tone="page">
        <Container>
          <Split>
            <Prose>
              <SectionHeading
                eyebrow="Sobre o produto"
                title="Controle e contenção para operações de resposta"
              />
              <p>{product.about}</p>
            </Prose>
            <MediaFrame label={`${product.name} em operação`} />
          </Split>
        </Container>
      </Section>

      {/* Aplicações */}
      <Section tone="card">
        <Container>
          <SectionHeading eyebrow="Aplicações" title="Onde utilizar" />
          <ul className={s.applications}>
            {product.applications.map((a) => (
              <li key={a} className={s.application}>
                <Icon name="check" size={18} strokeWidth={2.25} color="var(--hc-green-300)" />
                {a}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Características — só aparece quando há dados reais de fábrica. */}
      {hasSpecs ? (
        <Section tone="page">
          <Container>
            <SectionHeading eyebrow="Características" title="Projetada para a operação" />
            <table className={s.specs}>
              <tbody>
                {product.specs.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    <td>{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Container>
        </Section>
      ) : null}

      {/* CTA intermediário */}
      <Section tone={hasSpecs ? 'card' : 'page'}>
        <Container>
          <CTABanner
            eyebrow="Atendimento técnico"
            title="Precisa definir qual solução atende sua operação?"
            text="Nossa equipe pode ajudar você a identificar o equipamento mais adequado para sua necessidade."
            primary={{ href: '/contato', label: 'Falar com a equipe técnica' }}
          />
        </Container>
      </Section>

      {/* Produtos relacionados */}
      <Section tone="page">
        <Container>
          <SectionHeading
            eyebrow="Produtos relacionados"
            title="Outras soluções que podem complementar sua operação"
          />
          <div style={{ marginTop: 40 }}>
            <Grid cols={4}>
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </Grid>
          </div>
          <div style={{ marginTop: 40 }}>
            <ButtonLink href="/produtos" variant="outline" iconRight="arrow-right">
              Conhecer todos os produtos
            </ButtonLink>
          </div>
        </Container>
      </Section>

      {/* CTA final */}
      <Section tone="inverse">
        <Container narrow>
          <div className={s.finalCta}>
            <span className={s.finalEyebrow}>Contato</span>
            <h2 className={s.finalTitle}>Solicite informações sobre este produto</h2>
            <p className={s.finalText}>
              Preencha o formulário e nossa equipe entrará em contato para entender sua
              necessidade.
            </p>
            <ButtonLink href="/contato" size="lg" iconRight="arrow-right">
              Solicitar atendimento
            </ButtonLink>
          </div>
        </Container>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
    </>
  );
}
