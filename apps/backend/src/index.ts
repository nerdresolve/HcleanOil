import express from 'express';
import cors from 'cors';
import { env } from './lib/env.js';
import { verifyConnection } from './lib/mailer.js';
import { contatoRouter } from './routes/contato.js';

const app = express();

app.set('trust proxy', 1); // atrás de proxy/CDN, para o rate limit ver o IP real
app.use(express.json({ limit: '64kb' }));
app.use(
  cors({
    origin: env.CORS_ORIGINS,
    methods: ['POST', 'GET'],
  }),
);

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api', contatoRouter);

app.listen(env.PORT, () => {
  console.log(`HCLEAN API em http://localhost:${env.PORT}`);

  // Diagnóstico de credenciais: avisa cedo, mas não derruba o processo —
  // o /health continua respondendo enquanto o SMTP é ajustado.
  verifyConnection()
    .then(() => console.log('SMTP conectado.'))
    .catch((err) => console.error('SMTP indisponível:', err.message));
});
