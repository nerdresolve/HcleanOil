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
  /* TLS implícito (465) ou STARTTLS (587). Vazio segue a porta, mas dá para
     forçar: em redes com inspeção de TLS a 465 é cortada e só a 587 passa. */
  SMTP_SECURE: z
    .enum(['true', 'false'])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === 'true')),
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

  /**
   * Gera e envia a proposta em PDF logo após a confirmação.
   *
   * Quando o pedido tem item sem preço de tabela (hoje só o tanque), a
   * proposta vai apenas para a equipe, que completa os valores à mão.
   */
  ENVIAR_PROPOSTA: z
    .enum(['true', 'false'])
    .default('false')
    .transform((v) => v === 'true'),

  /** Onde salvar o contador de numeração das propostas. */
  PROPOSTAS_DIR: z.string().default('propostas'),

  /**
   * Número da última proposta emitida manualmente, para a numeração
   * automática continuar de onde parou em vez de recomeçar do 1.
   */
  PROPOSTA_INICIAL: z.coerce.number().default(0),

  /** Prazo de entrega exibido nas condições da proposta. */
  PRAZO_ENTREGA: z.string().default('a combinar'),

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
