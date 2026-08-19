import { z } from 'zod';

/**
 * Validação do formulário de contato. Espelha os campos do site; tudo que
 * chega de fora passa por aqui antes de virar e-mail.
 */
export const contactSchema = z.object({
  nome: z.string().trim().min(2, 'Informe seu nome.').max(120),
  empresa: z.string().trim().min(2, 'Informe o nome da empresa.').max(160),
  email: z.string().trim().email('Informe um e-mail válido.').max(180),
  telefone: z.string().trim().max(40).optional().or(z.literal('')),
  produto: z.string().trim().max(160).optional().or(z.literal('')),
  mensagem: z.string().trim().max(4000).optional().or(z.literal('')),
  consentimento: z.union([z.literal('on'), z.boolean(), z.undefined()]).optional(),

  /* Honeypot: o formulário mantém este campo escondido, então só um robô o
     preenche. Aceita qualquer valor de propósito — quem decide o que fazer é a
     rota, que responde 200 e descarta em silêncio. Rejeitar aqui devolveria um
     400 e ensinaria ao robô exatamente qual campo o denunciou. */
  empresa_site: z.string().max(200).optional(),
});

export type ContactPayload = z.infer<typeof contactSchema>;
