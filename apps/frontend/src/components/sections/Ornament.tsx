import { BrandWaveArt, BrandLinesArt, BrandRingsArt, BrandDotsArt } from './Shared';
import s from './Ornaments.module.css';

export type OrnamentShape = 'wave' | 'lines' | 'rings' | 'dots';
export type OrnamentPlace =
  | 'right'
  | 'left'
  | 'topRight'
  | 'topLeft'
  | 'bottomRight'
  | 'bottomLeft';

const SHAPES = {
  wave: BrandWaveArt,
  lines: BrandLinesArt,
  rings: BrandRingsArt,
  dots: BrandDotsArt,
};

/** Classe a aplicar na <Section> que hospeda um ornamento. */
export const ornamentHost = s.host;

/**
 * Marca-d'água de fundo posicionada.
 *
 * Uso: `<Section className={ornamentHost}><Ornament shape="rings" place="topLeft" />…`
 *
 * Alterne `place` entre seções vizinhas — duas peças do mesmo lado, uma
 * seguida da outra, pesam a página.
 */
export function Ornament({
  shape,
  place,
  onDark,
  fade,
  keepOnMobile,
}: {
  shape: OrnamentShape;
  place: OrnamentPlace;
  /** Sobre faixa escura: clareia em vez de escurecer. */
  onDark?: boolean;
  /** Esmaece na direção do texto — útil para a malha de pontos. */
  fade?: 'in' | 'inLeft';
  keepOnMobile?: boolean;
}) {
  const Shape = SHAPES[shape];
  const className = [
    s.art,
    s[place],
    onDark ? s.onDark : '',
    fade === 'in' ? s.fadeIn : fade === 'inLeft' ? s.fadeInLeft : '',
    keepOnMobile ? s.keepOnMobile : '',
  ]
    .filter(Boolean)
    .join(' ');

  return <Shape className={className} />;
}
