/**
 * Diagnostica a conexão SMTP: testa TCP puro e depois o handshake em 465
 * (TLS implícito) e 587 (STARTTLS).
 *
 * Existe porque os dois casos falham com mensagens parecidas e causas bem
 * diferentes: em rede com inspeção de TLS a 465 é cortada no handshake
 * (ECONNRESET/timeout) enquanto a 587 passa. O TCP separa bloqueio de rede
 * de erro de credencial.
 *
 *   node scripts/testar-smtp.mjs
 */
import 'dotenv/config';
import nodemailer from 'nodemailer';
import net from 'node:net';

const host = process.env.SMTP_HOST;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;

// Nunca imprima a senha nem o tamanho dela — só se está presente.
console.log(`host=${host} user=${user} senha=${pass ? 'definida' : 'AUSENTE'}`);

/** A porta responde a um TCP simples? Separa bloqueio de rede de erro de TLS. */
function tcp(porta) {
  return new Promise((resolve) => {
    const s = net.connect({ host, port: porta, timeout: 8000 });
    s.on('connect', () => { s.destroy(); resolve('conecta'); });
    s.on('timeout', () => { s.destroy(); resolve('timeout'); });
    s.on('error', (e) => resolve(`erro ${e.code}`));
  });
}

for (const porta of [465, 587, 25]) {
  console.log(`  tcp ${porta}: ${await tcp(porta)}`);
}

for (const [porta, secure] of [[465, true], [587, false]]) {
  const t = nodemailer.createTransport({
    host, port: porta, secure,
    auth: { user, pass },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
  });
  try {
    await t.verify();
    console.log(`  smtp ${porta} (secure=${secure}): OK`);
  } catch (e) {
    console.log(`  smtp ${porta} (secure=${secure}): ${e.code ?? ''} ${e.message}`);
  }
}
