'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { LogoMark } from '@/components/ui/Logo';
import { products } from '@/data/site';
import { findQuoteProduct, type QuantityField } from '@/data/quote';
import s from './QuoteModal.module.css';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const ENDPOINT = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

/** Unidades federativas, para o estado de entrega. */
const UFS = [
  'AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS',
  'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC',
  'SE', 'SP', 'TO',
];

type Props = {
  open: boolean;
  onClose: () => void;
  productSlug?: string;
};

export function QuoteModal({ open, onClose, productSlug }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [slug, setSlug] = useState(productSlug ?? '');
  const [picked, setPicked] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  const config = slug ? findQuoteProduct(slug) : undefined;
  /* Variante única não precisa de caixa de seleção: já vem marcada. */
  const singleOption = config?.options.length === 1 ? config.options[0] : undefined;

  /* Abre e fecha o <dialog> nativo em resposta à prop. showModal() é o que
     ativa a camada superior, o backdrop e a prisão de foco. */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  /* Ao reabrir, volta ao estado inicial com o produto pedido. */
  useEffect(() => {
    if (!open) return;
    setSlug(productSlug ?? '');
    setPicked({});
    setStatus('idle');
    setMessage('');
  }, [open, productSlug]);

  /* Enquanto o pop-up está aberto, trava o scroll da página atrás. */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  function handleProductChange(next: string) {
    setSlug(next);
    setPicked({});
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    /* `noValidate` desliga o balão do navegador para podermos mostrar o erro
       no visual do site — mas a checagem ainda precisa acontecer aqui, senão
       um envio vazio viaja até a API só para voltar 400. */
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = Object.fromEntries(new FormData(form));

    /* O <select> guarda o slug para casar com a configuração de quantidades;
       no e-mail o que importa é o nome legível. */
    const chosen = products.find((p) => p.slug === data.produto);
    if (chosen) data.produto = chosen.name;

    setStatus('sending');
    setMessage('');

    try {
      const res = await fetch(`${ENDPOINT}/api/contato`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !body.ok) {
        throw new Error(body.error || 'Não foi possível enviar sua solicitação.');
      }
      setStatus('sent');
      form.reset();
    } catch (err) {
      setStatus('error');
      setMessage(
        err instanceof Error ? err.message : 'Não foi possível enviar sua solicitação.',
      );
    }
  }

  return (
    <dialog
      ref={ref}
      className={s.dialog}
      aria-labelledby="quote-title"
      /* Fecha ao clicar fora ou no Esc, mantendo o estado do React em sincronia. */
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      {status === 'sent' ? (
        <div className={s.result}>
          <span className={s.resultIcon}>
            <Icon name="check" size={30} strokeWidth={2.4} />
          </span>
          <h2 className={s.resultTitle}>Solicitação enviada</h2>
          <p className={s.resultText}>
            Recebemos seus dados. Nossa equipe comercial entrará em contato para
            orientar você sobre produtos, aplicações e fornecimento.
          </p>
          <div style={{ paddingTop: 8 }}>
            <Button type="button" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div className={s.head}>
            <LogoMark size={44} tone="dark" />
            <h2 id="quote-title" className={s.title}>
              Solicitar orçamento
            </h2>
            <p className={s.subtitle}>
              Informe os dados abaixo e nossa equipe retorna com a proposta.
            </p>
            <button
              type="button"
              className={s.close}
              onClick={onClose}
              aria-label="Fechar"
            >
              <Icon name="close" size={20} strokeWidth={2} />
            </button>
          </div>

          <div className={s.body}>
            {/* Isca para robôs: humano nunca vê, logo nunca preenche. */}
            <div className={s.hp} aria-hidden="true">
              <label htmlFor="q-empresa-site">Não preencha</label>
              <input id="q-empresa-site" name="empresa_site" tabIndex={-1} autoComplete="off" />
            </div>

            <div className={s.grid}>
              <div className={s.field}>
                <label className={s.label} htmlFor="q-nome">
                  Nome <span className={s.required}>*</span>
                </label>
                <input
                  className={s.input}
                  id="q-nome"
                  name="nome"
                  required
                  autoComplete="name"
                  placeholder="Digite seu nome"
                />
              </div>

              <div className={s.field}>
                <label className={s.label} htmlFor="q-empresa">
                  Empresa <span className={s.required}>*</span>
                </label>
                <input
                  className={s.input}
                  id="q-empresa"
                  name="empresa"
                  required
                  autoComplete="organization"
                  placeholder="Razão social"
                />
              </div>

              <div className={s.field}>
                <label className={s.label} htmlFor="q-email">
                  E-mail <span className={s.required}>*</span>
                </label>
                <input
                  className={s.input}
                  id="q-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="Digite um e-mail válido"
                />
              </div>

              <div className={s.field}>
                <label className={s.label} htmlFor="q-telefone">
                  DDD + Telefone
                </label>
                <input
                  className={s.input}
                  id="q-telefone"
                  name="telefone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="Insira seu telefone com DDD"
                />
              </div>

              {/* O estado define o frete: CIF no Sudeste a partir de R$ 1.000,
                  FOB no resto. Sem ele a proposta não sai calculada. */}
              <div className={s.field}>
                <label className={s.label} htmlFor="q-estado">
                  Estado de entrega <span className={s.required}>*</span>
                </label>
                <select
                  className={s.select}
                  id="q-estado"
                  name="estado"
                  required
                  defaultValue=""
                >
                  <option value="">Selecione</option>
                  {UFS.map((uf) => (
                    <option key={uf} value={uf}>
                      {uf}
                    </option>
                  ))}
                </select>
              </div>

              <div className={s.field}>
                <label className={s.label} htmlFor="q-produto">
                  Produto de interesse
                </label>
                <select
                  className={s.select}
                  id="q-produto"
                  name="produto"
                  value={slug}
                  onChange={(e) => handleProductChange(e.target.value)}
                >
                  <option value="">Selecione um produto</option>
                  {products.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantidades específicas do produto escolhido. */}
              {config ? (
                <div className={s.options}>
                  {config.intro ? <p className={s.optionsIntro}>{config.intro}</p> : null}

                  {config.options.map((opt) => {
                    const active = singleOption ? true : Boolean(picked[opt.id]);
                    return (
                      <div key={opt.id} className={s.option}>
                        {singleOption ? (
                          <div className={s.optionHead} style={{ cursor: 'default' }}>
                            {opt.label}
                          </div>
                        ) : (
                          <label className={s.optionHead}>
                            <input
                              type="checkbox"
                              name={`item:${opt.label}`}
                              checked={active}
                              onChange={(e) =>
                                setPicked((prev) => ({
                                  ...prev,
                                  [opt.id]: e.target.checked,
                                }))
                              }
                            />
                            {opt.label}
                          </label>
                        )}

                        {active ? (
                          <div className={s.optionBody}>
                            {opt.fields.map((f) => (
                              <QuantityInput key={f.name} field={f} option={opt.label} />
                            ))}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ) : null}

              <div className={s.field}>
                <label className={s.label} htmlFor="q-mensagem">
                  Observações
                </label>
                <textarea
                  className={s.textarea}
                  id="q-mensagem"
                  name="mensagem"
                  rows={3}
                  placeholder="Descreva a aplicação, o cenário da operação ou qualquer detalhe relevante."
                />
              </div>

              {status === 'error' ? (
                <div className={s.alert} role="alert">
                  <Icon name="alert" size={17} />
                  <span>{message}</span>
                </div>
              ) : null}
            </div>
          </div>

          <div className={s.footer}>
            <label className={s.consent}>
              <input type="checkbox" name="consentimento" defaultChecked />
              Aceito receber contato e comunicações técnicas por e-mail.
            </label>
            <Button
              type="submit"
              size="lg"
              fullWidth
              iconRight="arrow-right"
              disabled={status === 'sending'}
            >
              {status === 'sending' ? 'Enviando…' : 'Enviar mensagem'}
            </Button>
          </div>
        </form>
      )}
    </dialog>
  );
}

/* ------------------------------------------------------------------ campos */

/** Campo de quantidade: número com unidade, ou três medidas para o tanque. */
function QuantityInput({ field, option }: { field: QuantityField; option: string }) {
  if (field.kind === 'dimensions') {
    return (
      <div>
        <div className={s.dims}>
          {[
            { k: 'c', label: 'Comprimento' },
            { k: 'l', label: 'Largura' },
            { k: 'a', label: 'Altura' },
          ].map((d) => (
            <label key={d.k} className={s.dimBox}>
              <span>{d.label}</span>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                name={`${option} — ${d.label} (${field.unit})`}
                placeholder={field.unit}
              />
            </label>
          ))}
        </div>
        {field.hint ? <p className={s.hint}>{field.hint}</p> : null}
      </div>
    );
  }

  /* O nome do campo vira o rótulo da linha no e-mail. Quando a variante já diz
     o que é ("Metragem desejada"), repetir o rótulo do campo só polui. */
  const fieldName =
    option.toLowerCase().includes(field.label.toLowerCase())
      ? `${option} (${field.unit})`
      : `${option} — ${field.label} (${field.unit})`;

  return (
    <div>
      <div className={s.qty}>
        <input
          type="number"
          inputMode="numeric"
          min={field.min}
          step={field.step}
          name={fieldName}
          placeholder={field.placeholder}
          aria-label={`${option} — ${field.label} em ${field.unit}`}
        />
        <span className={s.qtyUnit}>{field.unit}</span>
      </div>
      {field.hint ? <p className={s.hint}>{field.hint}</p> : null}
    </div>
  );
}
