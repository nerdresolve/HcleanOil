import { Container, Section, SectionHeading } from '@/components/ui/Layout';
import { ButtonLink } from '@/components/ui/Button';
import { QuoteButton } from '@/components/quote/QuoteButton';

export default function NotFound() {
  return (
    <Section tone="page" size="lg">
      <Container narrow>
        <SectionHeading
          as="h1"
          eyebrow="Erro 404"
          title="Página não encontrada"
          description="O endereço acessado não existe ou foi movido. Explore nosso portfólio ou fale com a equipe técnica."
        />
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 32 }}>
          <ButtonLink href="/produtos" iconRight="arrow-right">
            Ver produtos
          </ButtonLink>
          <QuoteButton variant="outline">Solicitar orçamento</QuoteButton>
        </div>
      </Container>
    </Section>
  );
}
