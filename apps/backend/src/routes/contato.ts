import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { contactSchema, extractItems } from '../lib/schema.js';
import { sendMail } from '../lib/mailer.js';
import { env } from '../lib/env.js';
import { leadNotification, leadConfirmation } from '../emails/templates.js';

export const contatoRouter = Router();

/* Um formulário de contato é alvo fácil de spam; 5 envios por IP a cada
   15 minutos é folgado para uso real e curto para robô. */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    ok: false,
    error: 'Muitas solicitações. Tente novamente em alguns minutos.',
  },
});

const formatDate = (d: Date) =>
  new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Sao_Paulo',
  }).format(d);

contatoRouter.post('/contato', limiter, async (req, res) => {
  const parsed = contactSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'Dados inválidos.',
    });
  }

  const data = parsed.data;

  // Honeypot preenchido: responde como sucesso para não ensinar o robô.
  if (data.empresa_site) {
    return res.json({ ok: true });
  }

  const notification = leadNotification({
    ...data,
    items: extractItems(data),
    receivedAt: formatDate(new Date()),
  });

  try {
    // O lead é o que não pode se perder — envia e confirma antes de responder.
    await sendMail({
      to: env.MAIL_TO,
      subject: notification.subject,
      html: notification.html,
      text: notification.text,
      // Responder no cliente de e-mail fala direto com quem preencheu.
      replyTo: `"${data.nome}" <${data.email}>`,
    });
  } catch (err) {
    console.error('[contato] falha ao enviar notificação:', err);
    return res.status(502).json({
      ok: false,
      error:
        'Não foi possível enviar sua solicitação agora. Tente novamente ou escreva para contato@hcleanoil.com.br.',
    });
  }

  // A confirmação é cortesia: se falhar, o lead já está salvo — apenas registra.
  if (env.SEND_CONFIRMATION) {
    const confirmation = leadConfirmation(data);
    sendMail({
      to: data.email,
      subject: confirmation.subject,
      html: confirmation.html,
      text: confirmation.text,
    }).catch((err) => {
      console.error('[contato] falha ao enviar confirmação:', err);
    });
  }

  return res.json({ ok: true });
});
