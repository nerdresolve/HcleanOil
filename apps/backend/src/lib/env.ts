import 'dotenv/config';
import { z } from 'zod';

/**
 * Configuração do serviço. Validada na subida: melhor o processo não iniciar
 * do que descobrir uma senha SMTP ausente no primeiro lead perdido.
 */
const schema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  SMTP_HOST: z.string().min(1, 'SMTP_HOST é obrigatório'),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().min(1, 'SMTP_USER é obrigatório'),
  SMTP_PASS: z.string().min(1, 'SMTP_PASS é obrigatório'),

  /** Remetente exibido. Deve ser um endereço autorizado pelo servidor SMTP. */
  MAIL_FROM: z.string().email('MAIL_FROM precisa ser um e-mail válido'),
  MAIL_FROM_NAME: z.string().default('HCLEAN'),

  /** Caixa que recebe os leads do formulário. */
  MAIL_TO: z.string().email('MAIL_TO precisa ser um e-mail válido'),

  /** Envia confirmação para quem preencheu o formulário. */
  SEND_CONFIRMATION: z
    .enum(['true', 'false'])
    .default('true')
    .transform((v) => v === 'true'),

  /** Origens liberadas no CORS, separadas por vírgula. */
  CORS_ORIGINS: z
    .string()
    .default('http://localhost:3000')
    .transform((v) =>
      v
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    ),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
    .join('\n');
  console.error(`Configuração inválida:\n${issues}\n\nVeja .env.example.`);
  process.exit(1);
}

export const env = parsed.data;
