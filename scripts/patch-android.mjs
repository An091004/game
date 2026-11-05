import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const config = JSON.parse(readFileSync(resolve(repo, 'capacitor.config.json'), 'utf8'));
const pkg = JSON.parse(readFileSync(resolve(repo, 'package.json'), 'utf8'));

function replaceOne(text, pattern, replacement, label) {
  pattern.lastIndex = 0;
  if ([...text.matchAll(pattern)].length !== 1) {
    throw new Error(`Không tìm thấy đúng một mẫu ${label}. Template Capacitor có thể đã đổi; chưa ghi file.`);
  }
  return text.replace(pattern, replacement);
}

function attribute(tag, name, value) {
  const pattern = new RegExp(`\\s${name}="[^"]*"`, 'g');
  return pattern.test(tag)
    ? replaceOne(tag, pattern, ` ${name}="${value}"`, name)
    : tag.replace(/>$/, ` ${name}="${value}">`);
}

function styleItem(xml, style, name, value) {
  const stylePattern = new RegExp(`<style\\b[^>]*name="${style.replaceAll('.', '\\.')}"[^>]*>[\\s\\S]*?<\\/style>`, 'g');
  return replaceOne(xml, stylePattern, block => {
    const itemPattern = new RegExp(`<item name="${name}">[^<]*<\\/item>`, 'g');
    const item = `<item name="${name}">${value}</item>`;
    return itemPattern.test(block)
      ? replaceOne(block, itemPattern, item, name)
      : block.replace('</style>', `    ${item}\n    </style>`);
  }, `style ${style}`);
}

export function buildVersion(env = process.env) {
  const name = env.ANDROID_VERSION_NAME ?? pkg.version;
  const code = env.ANDROID_VERSION_CODE ?? (env.CI ? '' : '1');
  // Chỉ nhận semver phát hành, không đưa chuỗi tùy ý vào Groovy/XML.
  if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/.test(name)) {
    throw new Error('ANDROID_VERSION_NAME phải là semver, ví dụ 0.1.0.');
  }
  if (!/^[1-9]\d*$/.test(code) || Number(code) > 2100000000) {
    throw new Error('ANDROID_VERSION_CODE phải là số nguyên 1..2100000000; CI dùng github.run_number.');
  }
  return { name, code: Number(code) };
}

/** Chỉ vá văn bản. Không gọi SDK, Gradle hoặc sinh dự án native. */
export function patchAndroid(androidDir = resolve(repo, 'android'), env = process.env) {
  const version = buildVersion(env);
  const read = path => readFileSync(resolve(androidDir, path), 'utf8').replaceAll('\r\n', '\n');
  let gradle = read('app/build.gradle');
  let manifest = read('app/src/main/AndroidManifest.xml');
  let styles = read('app/src/main/res/values/styles.xml');
  let strings = read('app/src/main/res/values/strings.xml');
  const appId = config.appId;
  if (appId !== 'com.nhanvan.game') throw new Error('Không đổi appId: đổi ID sẽ tách kho save hiện có.');

  // cap add đã đặt package MainActivity. Fail nếu script chạy trước bước đó.
  const java = read(`app/src/main/java/${appId.replaceAll('.', '/')}/MainActivity.java`);
  if (!java.includes(`package ${appId};`)) throw new Error('MainActivity không khớp appId; cần chạy cap add android trước.');
  gradle = replaceOne(gradle, /^\s*namespace\s*(?:=\s*)?"[^"]+"/gm, `    namespace = "${appId}"`, 'namespace');
  gradle = replaceOne(gradle, /^\s*applicationId\s*(?:=\s*)?"[^"]+"/gm, `        applicationId = "${appId}"`, 'applicationId');
  gradle = replaceOne(gradle, /^\s*versionCode\s*(?:=\s*)?\d+/gm, `        versionCode = ${version.code}`, 'versionCode');
  gradle = replaceOne(gradle, /^\s*versionName\s*(?:=\s*)?"[^"]+"/gm, `        versionName = "${version.name}"`, 'versionName');
  const signingLine = "apply from: 'nhanvan-signing.gradle'";
  if (!gradle.includes(signingLine)) gradle = gradle.trimEnd() + '\n\n' + signingLine + '\n';

  manifest = replaceOne(manifest, /<application\b[^>]*>/g, tag => {
    for (const [name, value] of Object.entries({
      'android:allowBackup': 'true',
      'android:fullBackupContent': '@xml/backup_rules',
      'android:dataExtractionRules': '@xml/data_extraction_rules',
      'android:usesCleartextTraffic': 'false',
    })) tag = attribute(tag, name, value);
    return tag;
  }, 'application');
  manifest = replaceOne(manifest, /<activity\b(?=[^>]*android:name="(?:\.MainActivity|com\.nhanvan\.game\.MainActivity)")[^>]*>/g,
    tag => attribute(tag, 'android:screenOrientation', 'portrait'), 'MainActivity');
  if (!manifest.includes('android.permission.POST_NOTIFICATIONS')) {
    manifest = replaceOne(manifest, /<\/manifest>/g,
      '    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />\n</manifest>', 'manifest');
  }

  for (const style of ['AppTheme', 'AppTheme.NoActionBar']) {
    for (const [name, value] of Object.entries({
      'android:statusBarColor': '@color/nhanvan_background',
      'android:navigationBarColor': '@color/nhanvan_background',
      'android:windowLightStatusBar': 'false',
      'android:windowLightNavigationBar': 'false',
      'android:windowBackground': '@color/nhanvan_background',
    })) styles = styleItem(styles, style, name, value);
  }
  for (const [name, value] of Object.entries({
    windowSplashScreenBackground: '@color/nhanvan_background',
    windowSplashScreenAnimatedIcon: '@mipmap/ic_launcher_foreground',
    postSplashScreenTheme: '@style/AppTheme.NoActionBar',
  })) styles = styleItem(styles, 'AppTheme.NoActionBarLaunch', name, value);
  for (const name of ['app_name', 'title_activity_main']) {
    strings = replaceOne(strings, new RegExp(`(<string name="${name}">)[^<]*(<\\/string>)`, 'g'),
      `$1${config.appName}$2`, name);
  }

  const backupInclude = '        <include domain="sharedpref" path="CapacitorStorage.xml" />';
  const files = {
    'app/build.gradle': gradle,
    'app/nhanvan-signing.gradle': readFileSync(resolve(repo, 'scripts/android-signing.gradle'), 'utf8'),
    'app/src/main/AndroidManifest.xml': manifest,
    'app/src/main/res/values/styles.xml': styles,
    'app/src/main/res/values/strings.xml': strings,
    'app/src/main/res/values/nhanvan-colors.xml': `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="nhanvan_background">${config.backgroundColor}</color>
    <color name="colorPrimary">#0d2323</color>
    <color name="colorPrimaryDark">${config.backgroundColor}</color>
    <color name="colorAccent">#d9b778</color>
</resources>
`,
    'app/src/main/res/xml/backup_rules.xml': `<?xml version="1.0" encoding="utf-8"?>
<full-backup-content>
${backupInclude}
</full-backup-content>
`,
    'app/src/main/res/xml/data_extraction_rules.xml': `<?xml version="1.0" encoding="utf-8"?>
<data-extraction-rules>
    <cloud-backup>
${backupInclude}
    </cloud-backup>
    <device-transfer>
${backupInclude}
    </device-transfer>
</data-extraction-rules>
`,
  };
  // Tất cả mẫu phải hợp lệ trước lần ghi đầu tiên, tránh vá dở khi template đổi.
  for (const [path, content] of Object.entries(files)) {
    const destination = resolve(androidDir, path);
    mkdirSync(dirname(destination), { recursive: true });
    writeFileSync(destination, content);
  }
  return { appId, ...version, files: Object.keys(files) };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const result = patchAndroid();
    console.log(`Đã vá Android: ${result.appId}, versionName=${result.name}, versionCode=${result.code}.`);
  } catch (error) {
    console.error(`Không vá được Android: ${error.message}`);
    process.exitCode = 1;
  }
}
