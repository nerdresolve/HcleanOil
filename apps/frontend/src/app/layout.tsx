import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { QuoteProvider } from '@/components/quote/QuoteProvider';
import { site } from '@/data/site';
import '@/styles/globals.css';

/* Exo 2 auto-hospedada a partir dos arquivos variáveis em src/fonts.
   Um único arquivo cobre os pesos 100–900, e servir do próprio domínio evita
   a conexão extra ao Google Fonts no caminho crítico. */
const exo2 = localFont({
  src: [
    {
      path: '../fonts/Exo2-VariableFont_wght.ttf',
      weight: '100 900',
      style: 'normal',
    },
    {
      path: '../fonts/Exo2-Italic-VariableFont_wght.ttf',
      weight: '100 900',
      style: 'italic',
    },
  ],
  display: 'swap',
  variable: '--font-exo2',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    'barreira de contenção',
    'absorvente de óleo',
    'kit SOPEP',
    'emergência ambiental',
    'contenção de derramamento',
    'resposta a derramamento de óleo',
    'equipamentos ambientais',
  ],
  authors: [{ name: site.legalName }],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: { canonical: '/' },
};

/** Dados estruturados da organização — ajuda o Google a montar o knowledge panel. */
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: site.name,
  legalName: site.legalName,
  url: site.url,
  description: site.description,
  email: site.contact.email,
  telephone: '+55-21-99494-5460',
  areaServed: { '@type': 'Country', name: 'Brasil' },
  knowsAbout: [
    'Contenção de derramamentos',
    'Absorção de óleo',
    'Resposta a emergências ambientais',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={exo2.variable}>
      <body>
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        {/* O pop-up de orçamento vive aqui, de modo que qualquer CTA da página
            abra o mesmo formulário, já com o produto pré-selecionado. */}
        <QuoteProvider>
          <Header />
          <main id="conteudo">{children}</main>
          <Footer />
        </QuoteProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </body>
    </html>
  );
}
