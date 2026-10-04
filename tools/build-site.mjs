import { readFile, mkdir, writeFile } from 'node:fs/promises';
import QRCode from 'qrcode';

const config = JSON.parse(await readFile('config.json', 'utf8'));
const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[c]);
const cards = config.github.map((url) => {
  const label = new URL(url).pathname.replace(/^\//, '') || new URL(url).hostname;
  return `<a class="card" href="${esc(url)}" target="_blank" rel="noopener"><h3>${esc(label)}</h3><p>Profil et réalisations techniques.</p><span>Voir le profil →</span></a>`;
}).join('\n');
await mkdir('assets', { recursive: true });
await QRCode.toFile('assets/cv-qr.png', config.qrTarget, { width: 600, margin: 2, errorCorrectionLevel: 'M' });
await writeFile('index.html', `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="CV et réalisations de ${esc(config.name)}."><title>${esc(config.name)} | ${esc(config.title)}</title><link rel="stylesheet" href="style.css"></head>
<body><main><section class="hero"><div><p class="eyebrow">${esc(config.title)}</p><h1>${esc(config.name)}</h1><p class="subtitle">${esc(config.subtitle)}</p><p class="intro">${esc(config.location)} · <a href="mailto:${esc(config.email)}">${esc(config.email)}</a></p><div class="actions"><a class="button primary" href="${esc(config.cvUrl)}" target="_blank" rel="noopener">Consulter le CV en ligne</a><a class="button secondary" href="vault.html">Documents sécurisés</a></div></div><aside class="qr-card"><img src="assets/cv-qr.png" alt="QR code vers le CV"><p>Scanner pour ouvrir le CV et les réalisations.</p></aside></section><section class="section"><p class="eyebrow">Réalisations techniques</p><h2>Projets et profils GitHub</h2><div class="cards">${cards}</div></section><section class="private-note"><h2>Documents sécurisés</h2><p>Les documents sont chiffrés avant publication et nécessitent un code d’accès.</p><a class="button secondary" href="vault.html">Accéder aux documents</a></section></main><footer>© ${esc(config.name)}</footer></body></html>`);
console.log('Site et QR code créés.');
