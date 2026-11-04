import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";

export interface SaveStore {
  get(key: string): string | null | Promise<string | null>;
  set(key: string, value: string): void | Promise<void>;
}
export const localStore: SaveStore = {
  get: (key) => window.localStorage.getItem(key),
  set: (key, value) => window.localStorage.setItem(key, value),
};
export const preferencesStore: SaveStore = {
  get: async (key) => (await Preferences.get({ key })).value,
  set: (key, value) => Preferences.set({ key, value }),
};
/** Không đổi sang store rỗng nếu Preferences lỗi: SaveManager sẽ khóa ghi. */
export function createSaveStore(): SaveStore {
  return Capacitor.isNativePlatform() ? preferencesStore : localStore;
}
