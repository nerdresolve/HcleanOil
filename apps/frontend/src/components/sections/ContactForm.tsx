'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { categories, products } from '@/data/site';
import s from './ContactForm.module.css';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const ENDPOINT =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export function ContactForm({ defaultProduct }: { defaultProduct?: string }) {
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));

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
        err instanceof Error
          ? err.message
          : 'Não foi possível enviar sua solicitação.',
      );
    }
  }

  if (status === 'sent') {
    return (
      <div className={`${s.alert} ${s.alertSuccess}`} role="status">
        <Icon name="check" size={20} strokeWidth={2.25} />
        <span>
          <strong className={s.alertTitle}>Solicitação enviada</strong>
          Recebemos seus dados. Nossa equipe entrará em contato para orientar você sobre
          produtos, aplicações e fornecimento.
        </span>
      </div>
    );
  }

  return (
    <form className={s.form} onSubmit={handleSubmit} noValidate>
      {/* Isca para robôs: humano nunca vê, logo nunca preenche. */}
      <div className={s.hp} aria-hidden="true">
        <label htmlFor="empresa_site">Não preencha este campo</label>
        <input id="empresa_site" name="empresa_site" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={s.field}>
        <label className={s.label} htmlFor="nome">
          Nome <span className={s.required}>*</span>
        </label>
        <input
          className={s.input}
          id="nome"
          name="nome"
          required
          autoComplete="name"
          placeholder="Nome completo"
        />
      </div>

      <div className={s.field}>
        <label className={s.label} htmlFor="empresa">
          Empresa <span className={s.required}>*</span>
        </label>
        <input
          className={s.input}
          id="empresa"
          name="empresa"
          required
          autoComplete="organization"
          placeholder="Razão social"
        />
      </div>

      <div className={s.field}>
        <label className={s.label} htmlFor="email">
          E-mail corporativo <span className={s.required}>*</span>
        </label>
        <input
          className={s.input}
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="nome@empresa.com.br"
        />
      </div>

      <div className={s.field}>
        <label className={s.label} htmlFor="telefone">
          Telefone
        </label>
        <input
          className={s.input}
          id="telefone"
          name="telefone"
          type="tel"
          autoComplete="tel"
          placeholder="(00) 00000-0000"
        />
      </div>

      <div className={`${s.field} ${s.full}`}>
        <label className={s.label} htmlFor="produto">
          Produto de interesse
        </label>
        <select
          className={s.select}
          id="produto"
          name="produto"
          defaultValue={defaultProduct ?? ''}
        >
          <option value="">Selecione (opcional)</option>
          {categories.map((c) => (
            <optgroup key={c.slug} label={c.name}>
              {products
                .filter((p) => p.category === c.slug)
                .map((p) => (
                  <option key={p.slug} value={p.name}>
                    {p.name}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className={`${s.field} ${s.full}`}>
        <label className={s.label} htmlFor="mensagem">
          Descreva sua necessidade
        </label>
        <textarea
          className={s.textarea}
          id="mensagem"
          name="mensagem"
          rows={5}
          placeholder="Explique brevemente a aplicação, o cenário da operação e a quantidade estimada."
        />
      </div>

      <div className={`${s.full}`} style={{ display: 'grid', gap: 20 }}>
        <label className={s.consent}>
          <input type="checkbox" name="consentimento" defaultChecked />
          Aceito receber contato e comunicações técnicas por e-mail.
        </label>

        {status === 'error' ? (
          <div className={`${s.alert} ${s.alertError}`} role="alert">
            <span>{message}</span>
          </div>
        ) : null}

        <div className={s.actions}>
          <Button
            type="submit"
            size="lg"
            iconRight="arrow-right"
            disabled={status === 'sending'}
          >
            {status === 'sending' ? 'Enviando…' : 'Solicitar atendimento'}
          </Button>
        </div>

        <p className={s.microcopy}>
          <strong>Fale com a equipe comercial da HCLEAN.</strong>
          <br />
          Envie seus dados e explique brevemente sua necessidade. Nossa equipe entrará em
          contato para orientar você sobre produtos, aplicações e fornecimento.
        </p>
      </div>
    </form>
  );
}
