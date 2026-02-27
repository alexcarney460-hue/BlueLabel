import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { removeBackground } from '@imgly/background-removal-node';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runOne(inputPath, outputPath) {
  const input = await fs.readFile(inputPath);
  const out = await removeBackground(new Blob([input], { type: 'image/jpeg' }), {
    output: {
      format: 'image/png',
    },
  });
  const buf = Buffer.from(await out.arrayBuffer());
  await fs.writeFile(outputPath, buf);
  console.log(`wrote ${outputPath}`);
}

async function main() {
  const root = path.resolve(__dirname, '..');
  const pub = path.join(root, 'public');

  await runOne(path.join(pub, 'cherry.jpg'), path.join(pub, 'cherry.png'));
  await runOne(path.join(pub, 'strawberry.jpg'), path.join(pub, 'strawberry.png'));
  await runOne(path.join(pub, 'watermelon.jpg'), path.join(pub, 'watermelon.png'));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
