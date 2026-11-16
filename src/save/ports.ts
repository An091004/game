export interface SaveStore {
  get(key: string): string | null | Promise<string | null>;
  set(key: string, value: string): void | Promise<void>;
}
export const localStore: SaveStore = {
  get: (key) => window.localStorage.getItem(key),
  set: (key, value) => window.localStorage.setItem(key, value),
};
/** Web dùng đúng kho theo origin. Lỗi trình duyệt được chuyển cho SaveManager khóa ghi. */
export function createSaveStore(): SaveStore {
  return localStore;
}
