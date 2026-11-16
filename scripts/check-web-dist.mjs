import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = resolve('dist');
const decoder = new TextDecoder('utf-8', { fatal: true });
function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(item => {
    if (item.isSymbolicLink()) throw Error('Không xuất bản symlink: ' + item.name);
    const path = join(dir, item.name);
    return item.isDirectory() ? files(path) : [path];
  });
}
for (const required of ['index.html', '.nojekyll', 'icon.svg', 'licenses/be-vietnam-pro-OFL.txt', 'licenses/noto-serif-OFL.txt']) {
  if (!existsSync(join(root, required))) throw Error('Bản web thiếu: ' + required);
}
const output = files(root);
for (const path of output) {
  const bytes = readFileSync(path), name = relative(root, path);
  if (bytes.includes(0)) throw Error('Bản web chứa nhị phân: ' + name);
  decoder.decode(bytes);
  if (!/\.(?:html|css|js|svg|txt|json)$/.test(name) && name !== '.nojekyll') throw Error('File ngoài danh sách xuất bản: ' + name);
}
const html = readFileSync(join(root, 'index.html'), 'utf8');
if (/(?:src|href)=["'](?:\/|https?:)/i.test(html)) throw Error('Đường dẫn không tương thích hosting dưới /game/.');
const css = output.filter(path => path.endsWith('.css')).map(path => readFileSync(path, 'utf8')).join('\n');
if (!css.includes('data:font/woff')) throw Error('Font chưa được nhúng trong CSS.');
if (/url\(["']?https?:/i.test(css)) throw Error('CSS còn tài nguyên từ mạng ngoài.');
const sourceCommit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const sourceDirty = Boolean(execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim());
writeFileSync(join(root, 'build-info.json'), JSON.stringify({ app: 'Nhàn Vân', target: 'web', sourceCommit, sourceDirty }, null, 2) + '\n');
console.log(`Web hợp lệ: ${output.length} file văn bản, font nhúng, asset tương đối, không cần APK.`);
