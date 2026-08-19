import type { Metadata } from 'next';
import { Container, Section, SectionHeading, Grid, Card, Badge } from '@/components/ui/Layout';
import { Icon } from '@/components/ui/Icon';
import {
  Hero,
  HeroCopy,
  HeroTitle,
  HeroLead,
  MediaFrame,
  Split,
  Prose,
  Stat,
  CTABanner,
} from '@/components/sections/Shared';
import { proofPoints, site } from '@/data/site';
import s from './sobre.module.css';

export const metadata: Metadata = {
  title: 'Sobre a HCLEAN',
  description:
    'Há mais de 18 anos a HCLEAN fornece equipamentos para resposta a emergências ambientais, com atuação em operações reais de contenção de derramamentos no Brasil.',
  alternates: { canonical: '/sobre' },
};

export default function SobrePage() {
  return (
    <>
      <Hero>
        <HeroCopy>
          <Badge tone="inverse">Referência nacional</Badge>
          <HeroTitle>Experiência construída em mais de 18 anos de atuação</HeroTitle>
          <HeroLead>
            A HCLEAN fornece equipamentos e soluções para resposta a emergências
            ambientais, apoiando empresas e equipes operacionais em situações que exigem
            preparo, rapidez e confiabilidade.
          </HeroLead>
        </HeroCopy>
      </Hero>

      {/* Nossa história */}
      <Section id="historia" tone="page">
        <Container>
          <Split>
            <Prose>
              <SectionHeading
                eyebrow="Nossa história"
                title="Uma trajetória construída no setor ambiental"
              />
              <p>
                Há mais de 18 anos, a HCLEAN atua no desenvolvimento e fornecimento de
                equipamentos voltados à resposta a emergências ambientais.
              </p>
              <p>
                Ao longo dessa trajetória, a empresa passou a fazer parte de operações
                reais de contenção de derramamentos no Brasil, construindo conhecimento
                sobre as necessidades práticas de equipes que atuam diretamente em campo.
              </p>
              <p>
                Essa experiência orienta nosso trabalho: oferecer soluções que façam
                sentido para a realidade operacional de nossos clientes.
              </p>
            </Prose>
            <MediaFrame label="Trajetória da HCLEAN no setor ambiental" />
          </Split>
        </Container>
      </Section>

      {/* Experiência em campo */}
      <Section tone="card">
        <Container>
          <Split reverse>
            <MediaFrame label="Equipamentos em operação real de contenção" />
            <Prose>
              <SectionHeading
                eyebrow="Experiência em campo"
                title="Equipamentos presentes em operações reais"
              />
              <p>
                Emergências ambientais exigem mais do que produtos disponíveis em
                catálogo. Exigem equipamentos adequados, preparo e capacidade de resposta.
              </p>
              <p>
                A HCLEAN fornece equipamentos utilizados em operações reais de contenção
                de derramamentos no Brasil, aproximando sua experiência comercial das
                necessidades de quem atua na resposta ambiental.
              </p>
            </Prose>
          </Split>
        </Container>
      </Section>

      {/* Parceria técnica */}
      <Section id="parceria" tone="page">
        <Container>
          <Card tone="sunken" className={s.partnership}>
            <span className={s.partnershipIcon}>
              <Icon name="handshake" size={30} />
            </span>
            <div className={s.partnershipCopy}>
              <span className={s.eyebrow}>Parceria técnica</span>
              <h2 className={s.partnershipTitle}>Parceria com a Hidroclean</h2>
              <p>
                A HCLEAN é parceira técnica da Hidroclean, uma das empresas pioneiras no
                Brasil no segmento de proteção ambiental.
              </p>
              <p>
                Essa parceria fortalece nossa atuação e amplia nossa capacidade de
                oferecer soluções voltadas às necessidades do setor.
              </p>
            </div>
          </Card>
        </Container>
      </Section>

      {/* Validações sociais */}
      <Section tone="inverse">
        <Container>
          <SectionHeading
            tone="light"
            eyebrow="Validações"
            title="Experiência que pode ser comprovada"
          />
          <div style={{ marginTop: 48 }}>
            <Grid cols={4}>
              {proofPoints.map((p) => (
                <Stat key={p.label} value={p.value} label={p.label} />
              ))}
            </Grid>
          </div>

          {/*
            Faixa de logos: clientes, órgãos e certificados. Os quadros abaixo
            são reservas — substituir por <Image> assim que os arquivos reais
            forem fornecidos. É a seção com mais força comercial da página.
          */}
          <div className={s.logos}>
            <span className={s.logosTitle}>Clientes, órgãos e certificações</span>
            <div className={s.logosRow}>
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className={s.logoSlot} aria-hidden="true">
                  Logo
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="page">
        <Container>
          <CTABanner
            eyebrow="Atendimento"
            title="Precisa de uma solução para sua operação?"
            text="Nossa equipe está preparada para entender sua necessidade e indicar os equipamentos mais adequados."
            primary={{ href: '/contato', label: 'Solicitar atendimento' }}
            secondary={{ href: '/produtos', label: 'Ver produtos' }}
          />
        </Container>
      </Section>
    </>
  );
}
