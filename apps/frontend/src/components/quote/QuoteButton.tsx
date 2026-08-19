'use client';

import type { ComponentProps } from 'react';
import { Button } from '@/components/ui/Button';
import { useQuote } from './QuoteProvider';

type ButtonProps = ComponentProps<typeof Button>;

/**
 * Botão que abre o pop-up de orçamento.
 *
 * Substitui os links para /contato: como o formulário é o destino de todo CTA
 * comercial do site, abrir em pop-up evita tirar a pessoa da página em que ela
 * estava lendo sobre o produto.
 */
export function QuoteButton({
  productSlug,
  children,
  ...rest
}: Omit<ButtonProps, 'onClick' | 'type'> & { productSlug?: string }) {
  const { open } = useQuote();
  return (
    <Button type="button" onClick={() => open(productSlug)} {...rest}>
      {children}
    </Button>
  );
}
