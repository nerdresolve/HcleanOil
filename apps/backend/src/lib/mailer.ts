import nodemailer, { type Transporter } from 'nodemailer';
import { env } from './env.js';
import { logoAttachment } from '../emails/logo.js';

let transporter: Transporter | null = null;

export function getTransporter(): Transporter {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    // 465 usa TLS implícito; nas demais portas o STARTTLS é negociado.
    secure: env.SMTP_SECURE ?? env.SMTP_PORT === 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  });

  return transporter;
}

type SendArgs = {
  to: string;
  cc?: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  /** Anexos além da marca — a proposta em PDF, por exemplo. */
  anexos?: { filename: string; content: Buffer }[];
};

export async function sendMail({
  to,
  cc,
  subject,
  html,
  text,
  replyTo,
  anexos = [],
}: SendArgs) {
  const transport = getTransporter();

  return transport.sendMail({
    from: `"${env.MAIL_FROM_NAME}" <${env.MAIL_FROM}>`,
    to,
    cc,
    replyTo,
    subject,
    text,
    html,
    // A marca do cabeçalho viaja junto; sem isso o cid não resolve.
    attachments: [logoAttachment, ...anexos],
  });
}

/** Confere as credenciais na subida do processo, para falhar cedo. */
export async function verifyConnection() {
  return getTransporter().verify();
}
