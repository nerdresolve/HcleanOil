'use client';

import type { ReactNode } from 'react';
import { useQuote } from './QuoteProvider';

/**
 * Texto clicável que abre o pop-up de orçamento — para listas como o rodapé,
 * onde um botão estilizado destoaria dos links vizinhos.
 *
 * É um <button> de verdade, e não um <a href="#">, porque a ação abre um
 * diálogo em vez de navegar: assim o leitor de tela anuncia o papel certo.
 */
export function QuoteLink({
  children,
  className,
  productSlug,
}: {
  children: ReactNode;
  className?: string;
  productSlug?: string;
}) {
  const { open } = useQuote();
  return (
    <button
      type="button"
      className={className}
      onClick={() => open(productSlug)}
      style={{
        background: 'none',
        border: 0,
        padding: 0,
        textAlign: 'left',
        cursor: 'pointer',
        font: 'inherit',
      }}
    >
      {children}
    </button>
  );
}
