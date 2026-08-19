/**
 * Capturador de e-mails para desenvolvimento.
 *
 *   npm run maildev
 *
 * Sobe um SMTP falso na 2525 que aceita tudo e guarda as mensagens, e uma
 * caixa de entrada em http://localhost:8025 para lê-las no navegador. Serve
 * para testar o formulário de ponta a ponta sem credenciais reais e sem
 * disparar mensagem para ninguém.
 *
 * Aponte o .env para ele:
 *   SMTP_HOST=127.0.0.1  SMTP_PORT=2525  SMTP_USER=dev  SMTP_PASS=dev
 */
import net from 'node:net';
import http from 'node:http';

const SMTP_PORT = 2525;
const WEB_PORT = 8025;
const messages = [];

/* ---------------------------------------------------------------- SMTP --- */

net
  .createServer((sock) => {
    let buf = '';
    let inData = false;
    let raw = '';

    sock.write('220 localhost HCLEAN maildev\r\n');

    const finish = () => {
      const end = raw.indexOf('\r\n.\r\n');
      if (end === -1) return false;
      inData = false;
      store(raw.slice(0, end));
      raw = '';
      sock.write('250 OK queued\r\n');
      return true;
    };

    sock.on('data', (chunk) => {
      const text = chunk.toString('utf8');

      if (inData) {
        raw += text;
        finish();
        return;
      }

      buf += text;
      let idx;
      while ((idx = buf.indexOf('\r\n')) !== -1) {
        const line = buf.slice(0, idx);
        buf = buf.slice(idx + 2);
        const cmd = line.slice(0, 4).toUpperCase();

        if (cmd === 'EHLO' || cmd === 'HELO') {
          sock.write('250-localhost\r\n250 AUTH PLAIN LOGIN\r\n');
        } else if (cmd === 'AUTH') {
          sock.write('235 authenticated\r\n');
        } else if (cmd === 'DATA') {
          inData = true;
          sock.write('354 send data\r\n');
          if (buf) {
            raw += buf;
            buf = '';
            finish();
          }
        } else if (cmd === 'QUIT') {
          sock.write('221 bye\r\n');
          sock.end();
        } else {
          sock.write('250 OK\r\n');
        }
      }
    });

    sock.on('error', () => {});
  })
  .listen(SMTP_PORT, () => console.log('SMTP  -> localhost:' + SMTP_PORT));

/* ------------------------------------------------------------- parsing --- */

/** Decodifica cabeçalhos no formato =?UTF-8?Q?…?= / =?UTF-8?B?…?=. */
function decodeHeader(v) {
  return String(v).replace(/=\?UTF-8\?([QB])\?([^?]*)\?=/gi, (_, enc, body) => {
    if (enc.toUpperCase() === 'B') return Buffer.from(body, 'base64').toString('utf8');
    const bin = body
      .replace(/_/g, ' ')
      .replace(/=([0-9A-F]{2})/gi, (_m, h) => String.fromCharCode(parseInt(h, 16)));
    return Buffer.from(bin, 'binary').toString('utf8');
  });
}

function decodeBody(body, encoding, charset = 'utf8') {
  const enc = String(encoding || '').toLowerCase();
  if (enc === 'base64') return Buffer.from(body, 'base64').toString(charset);
  if (enc === 'quoted-printable') {
    const bin = body
      .replace(/=\r?\n/g, '')
      .replace(/=([0-9A-F]{2})/gi, (_m, h) => String.fromCharCode(parseInt(h, 16)));
    return Buffer.from(bin, 'binary').toString(charset);
  }
  return body;
}

function store(rawMessage) {
  const sep = rawMessage.indexOf('\r\n\r\n');
  const headerBlock = rawMessage.slice(0, sep).replace(/\r\n[ \t]+/g, ' ');
  const bodyBlock = rawMessage.slice(sep + 4);

  const headers = {};
  for (const line of headerBlock.split('\r\n')) {
    const m = line.match(/^([\w-]+):\s*(.*)$/);
    if (m) headers[m[1].toLowerCase()] = m[2];
  }

  let html = '';
  let text = '';
  const inlineImages = {};

  const walk = (content, boundary) => {
    if (!boundary) {
      text = decodeBody(content, headers['content-transfer-encoding']);
      return;
    }
    for (const part of content.split('--' + boundary)) {
      const cut = part.indexOf('\r\n\r\n');
      if (cut === -1) continue;
      const ph = part.slice(0, cut).replace(/\r\n[ \t]+/g, ' ');
      const pb = part.slice(cut + 4);
      const ctype = (ph.match(/Content-Type:\s*([^;\r\n]+)/i) || [])[1] || '';
      const cenc = (ph.match(/Content-Transfer-Encoding:\s*([^\r\n;]+)/i) || [])[1];
      const nested = ph.match(/boundary="?([^";\r\n]+)"?/i);

      if (nested) walk(pb, nested[1]);
      else if (/text\/html/i.test(ctype)) html = decodeBody(pb, cenc);
      else if (/text\/plain/i.test(ctype)) text = decodeBody(pb, cenc);
      else if (/^image\//i.test(ctype)) {
        // Anexo inline: vira data URI para render no navegador.
        const cid = (ph.match(/Content-ID:\s*<([^>]+)>/i) || [])[1];
        if (cid) {
          inlineImages[cid] =
            'data:' + ctype.trim() + ';base64,' + pb.replace(/[\r\n]/g, '').trim();
        }
      }
    }
  };

  const boundary = (headers['content-type'] || '').match(/boundary="?([^";]+)"?/i);
  walk(bodyBlock, boundary && boundary[1]);

  for (const [cid, uri] of Object.entries(inlineImages)) {
    html = html.split('cid:' + cid).join(uri);
  }

  const msg = {
    id: messages.length + 1,
    at: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
    to: decodeHeader(headers.to || ''),
    replyTo: decodeHeader(headers['reply-to'] || ''),
    subject: decodeHeader(headers.subject || '(sem assunto)'),
    html,
    text,
  };

  messages.unshift(msg);
  console.log(`[${msg.at}] ${msg.subject}  ->  ${msg.to}`);
}

/* ----------------------------------------------------------------- web --- */

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

http
  .createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');

    if (url.pathname.startsWith('/msg/')) {
      const msg = messages.find((m) => String(m.id) === url.pathname.slice(5));
      res.writeHead(msg ? 200 : 404, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(
        msg ? msg.html || '<pre>' + esc(msg.text) + '</pre>' : 'não encontrado',
      );
    }

    const list = messages.length
      ? messages
          .map(
            (m) => `
      <li><a href="/msg/${m.id}" target="viewer">
        <strong>${esc(m.subject)}</strong>
        <span>para ${esc(m.to)}${m.replyTo ? ' &middot; responder a ' + esc(m.replyTo) : ''}</span>
        <time>${esc(m.at)}</time>
      </a></li>`,
          )
          .join('')
      : '<li class="empty">Nenhum e-mail ainda. Envie o formulário no site.</li>';

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<title>HCLEAN — e-mails capturados</title>
<meta http-equiv="refresh" content="8">
<style>
  *{box-sizing:border-box} body{margin:0;font:14px/1.5 system-ui,sans-serif;background:#F7F7F7;color:#2A342F;display:flex;height:100vh}
  aside{width:400px;flex:0 0 400px;background:#fff;border-right:1px solid #DCE0DE;display:flex;flex-direction:column}
  header{padding:16px 20px;background:#092B1B;color:#F7F7F7}
  header b{display:block;font-size:15px} header span{font-size:12px;opacity:.7}
  ul{list-style:none;margin:0;padding:0;overflow:auto;flex:1}
  li a{display:block;padding:14px 20px;border-bottom:1px solid #EDEFEE;text-decoration:none;color:inherit}
  li a:hover{background:#EEF9F3}
  li strong{display:block;color:#092B1B;margin-bottom:3px}
  li span{display:block;font-size:12px;color:#66736D}
  li time{display:block;font-size:11px;color:#8E9A94;margin-top:4px}
  li.empty{padding:24px 20px;color:#66736D}
  iframe{flex:1;border:0;background:#fff}
</style></head><body>
<aside>
  <header><b>E-mails capturados</b><span>${messages.length} mensagem(ns) &middot; atualiza sozinho</span></header>
  <ul>${list}</ul>
</aside>
<iframe name="viewer" ${messages.length ? `src="/msg/${messages[0].id}"` : ''}></iframe>
</body></html>`);
  })
  .listen(WEB_PORT, () => console.log('Caixa -> http://localhost:' + WEB_PORT));
