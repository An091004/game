export interface StoragePort {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}
/** Cầu nối save v1. Chỉ giai đoạn 2 mới thay bằng SaveManager hai ô và migrations. */
export class LegacyStorage {
  blocked = false;
  constructor(
    private readonly getStorage: () => StoragePort,
    private readonly key: string,
  ) {}
  load<T>(normalize: (value: unknown) => T): T | null {
    try {
      const raw = this.getStorage().getItem(this.key);
      return raw === null ? null : normalize(JSON.parse(raw));
    } catch {
      this.blocked = true;
      return null;
    }
  }
  write(state: unknown): boolean {
    if (this.blocked) return false;
    try {
      this.getStorage().setItem(this.key, JSON.stringify(state));
      return true;
    } catch {
      this.blocked = true;
      return false;
    }
  }
}
