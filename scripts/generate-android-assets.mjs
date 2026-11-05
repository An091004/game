import { readFileSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadContext, setArguments } from '@capacitor/assets/dist/ctx.js';
import { run } from '@capacitor/assets/dist/tasks/generate.js';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const config = JSON.parse(readFileSync(resolve(repo, 'capacitor.config.json'), 'utf8'));
const ctx = await loadContext(repo);
setArguments(ctx, {
  android: true,
  iconBackgroundColor: config.backgroundColor,
  iconBackgroundColorDark: config.backgroundColor,
  splashBackgroundColor: config.backgroundColor,
  splashBackgroundColorDark: config.backgroundColor,
});
// CLI assets có thể báo lỗi nhưng vẫn exit 0. Kiểm tra kết quả API để CI dừng
// nếu thiếu ảnh, thay vì vô tình đóng gói icon mặc định của template.
const generated = await run(ctx);
const paths = generated.flatMap(asset => Object.values(asset.destFilenames));
for (const required of [
  'mipmap-xxxhdpi/ic_launcher.png',
  'mipmap-xxxhdpi/ic_launcher_foreground.png',
  'mipmap-xxxhdpi/ic_launcher_background.png',
  'drawable/splash.png',
  'drawable-night/splash.png',
]) {
  const path = paths.find(path => path.replaceAll('\\', '/').endsWith('/' + required));
  if (!path || statSync(path).size === 0) throw new Error(`Sinh icon/splash thất bại: thiếu ${required}.`);
}
console.log(`Đã xác minh icon/splash từ assets/icon.svg (${paths.length} file).`);
