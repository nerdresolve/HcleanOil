/**
 * Copia para dist/ os arquivos que o TypeScript não leva.
 *
 * O `tsc` compila só `.ts`; as imagens da proposta, extraídas do modelo Word,
 * ficariam para trás e o PDF sairia sem figura nenhuma.
 */
import { cpSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');

const PASTAS = [['src/proposta/imagens', 'dist/proposta/imagens']];

for (const [origem, destino] of PASTAS) {
  const de = join(RAIZ, origem);
  if (!existsSync(de)) {
    console.log(`ausente, pulando: ${origem}`);
    continue;
  }
  cpSync(de, join(RAIZ, destino), { recursive: true });
  console.log(`${origem} -> ${destino} (${readdirSync(de).length} arquivos)`);
}
