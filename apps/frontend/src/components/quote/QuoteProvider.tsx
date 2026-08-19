'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { QuoteModal } from './QuoteModal';

type QuoteContextValue = {
  /** Abre o formulário, opcionalmente já com um produto selecionado. */
  open: (productSlug?: string) => void;
  close: () => void;
};

const QuoteContext = createContext<QuoteContextValue | null>(null);

/**
 * Disponibiliza o formulário de orçamento para toda a árvore.
 *
 * Fica no layout, de modo que qualquer CTA — cabeçalho, cartão de produto,
 * banner — abra o mesmo pop-up, já com o produto certo pré-selecionado.
 */
export function QuoteProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [slug, setSlug] = useState<string | undefined>();

  const open = useCallback((productSlug?: string) => {
    setSlug(productSlug);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <QuoteContext.Provider value={value}>
      {children}
      <QuoteModal open={isOpen} onClose={close} productSlug={slug} />
    </QuoteContext.Provider>
  );
}

export function useQuote() {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error('useQuote precisa estar dentro de <QuoteProvider>');
  return ctx;
}
