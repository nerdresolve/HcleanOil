import Image from 'next/image';
import { ButtonLink } from '@/components/ui/Button';
import { QuoteButton } from '@/components/quote/QuoteButton';
import { Container } from '@/components/ui/Layout';
import { Icon } from '@/components/ui/Icon';
import type { IconName } from '@/data/site';
import s from './VideoHero.module.css';

type Stat = { icon: IconName; value: string; label: string };

type Props = {
  title: string;
  /** Segunda linha do título, destacada em verde. */
  titleAccent?: string;
  lead: string;
  /** A ação principal pode navegar (`href`) ou abrir o pop-up (`quote`). */
  primary: { label: string } & ({ href: string } | { quote: true });
  secondary?: { href: string; label: string };
  stats?: Stat[];
  /** Vídeo de fundo. Sem ele, o hero usa só o poster. */
  video?: { webm?: string; mp4?: string };
  /** Imagem exibida antes do vídeo carregar e no mobile. */
  poster: string;
  posterAlt: string;
};

export function VideoHero({
  title,
  titleAccent,
  lead,
  primary,
  secondary,
  stats,
  video,
  poster,
  posterAlt,
}: Props) {
  const hasVideo = Boolean(video?.mp4 || video?.webm);

  return (
    <section className={s.hero}>
      <div className={s.media}>
        {/*
          O poster é uma <Image> de verdade, com priority: é ele que conta como
          LCP, então precisa vir otimizado e cedo. O vídeo entra por cima
          quando puder — em conexão lenta ou com "reduzir movimento" o poster
          simplesmente permanece.
        */}
        <Image
          src={poster}
          alt={posterAlt}
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover' }}
        />
        {hasVideo ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster={poster}
            aria-hidden="true"
            tabIndex={-1}
          >
            {video?.webm ? <source src={video.webm} type="video/webm" /> : null}
            {video?.mp4 ? <source src={video.mp4} type="video/mp4" /> : null}
          </video>
        ) : null}
      </div>

      <div className={s.scrim} />

      <Container>
        <div className={s.inner}>
          <h1 className={s.title}>
            {title}
            {titleAccent ? (
              <>
                {' '}
                <span className={s.titleAccent}>{titleAccent}</span>
              </>
            ) : null}
          </h1>

          <p className={s.lead}>{lead}</p>

          {stats?.length ? (
            <dl className={s.stats}>
              {stats.map((st) => (
                <div key={st.label} className={s.stat}>
                  <span className={s.statIcon}>
                    <Icon name={st.icon} size={30} strokeWidth={1.6} />
                  </span>
                  {/* O rótulo é o termo e o número é a definição, mas
                      visualmente o número vem primeiro — daí a ordem invertida
                      no CSS em vez de trocar a semântica. */}
                  <dt className={s.statLabel}>{st.label}</dt>
                  <dd className={s.statValue}>{st.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          <div className={s.actions}>
            {'href' in primary ? (
              <ButtonLink href={primary.href} size="lg" iconRight="arrow-right">
                {primary.label}
              </ButtonLink>
            ) : (
              <QuoteButton size="lg" iconRight="arrow-right">
                {primary.label}
              </QuoteButton>
            )}
            {secondary ? (
              <ButtonLink href={secondary.href} size="lg" variant="inverse-outline">
                {secondary.label}
              </ButtonLink>
            ) : null}
          </div>
        </div>
      </Container>

      {/* A curva fecha na cor da seção seguinte e toca a base do quadro, para
          não sobrar uma tira escura abaixo da onda. */}
      <div className={s.wave} aria-hidden="true">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path
            d="M0,52 C240,110 480,120 720,96 C960,72 1200,18 1440,44 L1440,120 L0,120 Z"
            fill="var(--surface-page)"
          />
        </svg>
      </div>
    </section>
  );
}
