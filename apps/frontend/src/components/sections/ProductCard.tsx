import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { findCategory, type Product } from '@/data/site';
import s from './ProductCard.module.css';

export function ProductCard({ product }: { product: Product }) {
  const category = findCategory(product.category);

  return (
    <Link href={`/produtos/${product.slug}`} className={s.card}>
      <div className={s.thumb} aria-hidden="true">
        {product.name}
      </div>
      <div className={s.body}>
        {category ? <span className={s.line}>{category.name}</span> : null}
        <h3 className={s.name}>{product.name}</h3>
        <p className={s.lead}>{product.lead}</p>
        <span className={s.more}>
          Ver produto
          <Icon name="arrow-right" size={16} strokeWidth={2} />
        </span>
      </div>
    </Link>
  );
}
