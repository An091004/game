import { afterEach, describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve, sep } from 'node:path';
import { buildVersion, patchAndroid } from '../scripts/patch-android.mjs';

const repo = resolve(import.meta.dirname, '..');
const tempRoot = resolve(repo, '.task');
const fixtures = [];
const archive = resolve(repo, 'node_modules/@capacitor/cli/assets/android-template.tar.gz');
const files = [
  'app/build.gradle',
  'app/src/main/AndroidManifest.xml',
  'app/src/main/res/values/styles.xml',
  'app/src/main/res/values/strings.xml',
  'app/src/main/java/com/getcapacitor/myapp/MainActivity.java',
];
// Chỉ đọc các file văn bản từ template npm thật; không giải nén JAR/PNG hoặc chạy cap add/Gradle.
const source = Object.fromEntries(files.map(path => [path, execFileSync('tar', ['-xOf', archive, path], { encoding: 'utf8' })]));
function fixture() {
  mkdirSync(tempRoot, { recursive: true });
  const root = mkdtempSync(resolve(tempRoot, 'android-patch-'));
  fixtures.push(root);
  for (const [path, text] of Object.entries(source)) {
    const target = resolve(root, path.replace('com/getcapacitor/myapp', 'com/nhanvan/game'));
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, text.replaceAll('com.getcapacitor.myapp', 'com.nhanvan.game'));
  }
  return root;
}
const read = (root, path) => readFileSync(resolve(root, path), 'utf8');
const env = { ANDROID_VERSION_NAME: '0.1.0', ANDROID_VERSION_CODE: '42' };
afterEach(() => {
  for (const root of fixtures.splice(0)) {
    if (!resolve(root).startsWith(tempRoot + sep)) throw Error('Fixture ngoài repo.');
    rmSync(root, { recursive: true, force: true });
  }
});

describe('Android patch trên template Capacitor đã khóa trong npm', () => {
  it('đặt ID, tên, version và chỉ khóa portrait của MainActivity', () => {
    const root = fixture();
    patchAndroid(root, env);
    expect(read(root, 'app/build.gradle')).toContain('applicationId = "com.nhanvan.game"');
    expect(read(root, 'app/build.gradle')).toContain('namespace = "com.nhanvan.game"');
    expect(read(root, 'app/build.gradle')).toContain('versionCode = 42');
    expect(read(root, 'app/build.gradle')).toContain('versionName = "0.1.0"');
    expect(read(root, 'app/src/main/res/values/strings.xml')).toContain('<string name="app_name">Nhàn Vân</string>');
    expect(read(root, 'app/src/main/AndroidManifest.xml')).toMatch(/<activity\b[^>]*android:screenOrientation="portrait"/);
  });
  it('backup Preferences cho Android trước/sau 12, không gom WebView cache', () => {
    const root = fixture();
    patchAndroid(root, env);
    const manifest = read(root, 'app/src/main/AndroidManifest.xml');
    expect(manifest).toContain('android:allowBackup="true"');
    expect(manifest).toContain('android:fullBackupContent="@xml/backup_rules"');
    expect(manifest).toContain('android:dataExtractionRules="@xml/data_extraction_rules"');
    const oldRules = read(root, 'app/src/main/res/xml/backup_rules.xml');
    const newRules = read(root, 'app/src/main/res/xml/data_extraction_rules.xml');
    expect(oldRules).toContain('domain="sharedpref" path="CapacitorStorage.xml"');
    expect(newRules.match(/CapacitorStorage.xml/g)).toHaveLength(2);
    expect(newRules).toContain('<cloud-backup>');
    expect(newRules).toContain('<device-transfer>');
    expect(newRules).not.toContain('domain="root"');
    const native = readFileSync(resolve(repo, 'node_modules/@capacitor/preferences/android/src/main/java/com/capacitorjs/plugins/preferences/PreferencesConfiguration.java'), 'utf8');
    expect(native).toContain('DEFAULTS.group = "CapacitorStorage"');
  });
  it('chạy hai lần không đổi byte, tăng version vẫn giữ cấu hình', () => {
    const root = fixture();
    const first = patchAndroid(root, env);
    const before = first.files.map(path => read(root, path));
    patchAndroid(root, env);
    expect(first.files.map(path => read(root, path))).toEqual(before);
    patchAndroid(root, { ...env, ANDROID_VERSION_CODE: '43' });
    expect(read(root, 'app/build.gradle')).toContain('versionCode = 43');
    expect(read(root, 'app/build.gradle').match(/apply from: 'nhanvan-signing.gradle'/g)).toHaveLength(1);
    expect(read(root, 'app/src/main/AndroidManifest.xml').match(/POST_NOTIFICATIONS/g)).toHaveLength(1);
  });
  it('splash Android 12 có icon và theme sau splash, status bar nền tối', () => {
    const root = fixture();
    patchAndroid(root, env);
    const styles = read(root, 'app/src/main/res/values/styles.xml');
    expect(styles).toContain('<item name="windowSplashScreenAnimatedIcon">@mipmap/ic_launcher_foreground</item>');
    expect(styles).toContain('<item name="postSplashScreenTheme">@style/AppTheme.NoActionBar</item>');
    expect(styles).toContain('<item name="android:windowLightStatusBar">false</item>');
    expect(read(root, 'app/src/main/res/values/nhanvan-colors.xml')).toContain('#08191a');
  });
  it.each(['applicationId', 'versionCode'])('template thiếu %s thì không ghi dở manifest hoặc Gradle', field => {
    const root = fixture();
    const path = resolve(root, 'app/build.gradle');
    const changed = readFileSync(path, 'utf8').replace(field, 'unknownField');
    writeFileSync(path, changed);
    expect(() => patchAndroid(root, env)).toThrow('Template Capacitor có thể đã đổi');
    expect(readFileSync(path, 'utf8')).toBe(changed);
    expect(read(root, 'app/src/main/AndroidManifest.xml')).toBe(source['app/src/main/AndroidManifest.xml']);
    expect(existsSync(resolve(root, 'app/nhanvan-signing.gradle'))).toBe(false);
  });
  it('giữ activity phụ và từ chối MainActivity sai package', () => {
    const root = fixture();
    const path = resolve(root, 'app/src/main/AndroidManifest.xml');
    writeFileSync(path, readFileSync(path, 'utf8').replace('</application>', '<activity android:name=".OtherActivity" /></application>'));
    patchAndroid(root, env);
    expect(readFileSync(path, 'utf8')).toContain('<activity android:name=".OtherActivity" />');
    writeFileSync(resolve(root, 'app/src/main/java/com/nhanvan/game/MainActivity.java'), 'package wrong.name;');
    expect(() => patchAndroid(root, env)).toThrow('MainActivity không khớp');
  });
  it('không ghi giá trị ký từ env vào file đã sinh', () => {
    const root = fixture();
    const result = patchAndroid(root, { ...env, ANDROID_KEYSTORE_PASSWORD: 'test-placeholder-not-a-secret' });
    for (const path of result.files) expect(read(root, path)).not.toContain('test-placeholder-not-a-secret');
  });
});

describe('Version từ môi trường CI', () => {
  it.each(['0', '-1', '1.2', '1e3', '2147483648', '1\nprintln(1)'])('từ chối versionCode %s', code => {
    expect(() => buildVersion({ ...env, ANDROID_VERSION_CODE: code })).toThrow('ANDROID_VERSION_CODE');
  });
  it('bắt buộc versionCode trong CI, giữ semver và run number', () => {
    expect(() => buildVersion({ CI: 'true' })).toThrow('ANDROID_VERSION_CODE');
    expect(buildVersion({ ANDROID_VERSION_NAME: '1.2.3-debug.1', ANDROID_VERSION_CODE: '123' })).toEqual({ name: '1.2.3-debug.1', code: 123 });
    expect(() => buildVersion({ ...env, ANDROID_VERSION_NAME: '1.0";println(1)' })).toThrow('ANDROID_VERSION_NAME');
  });
});
