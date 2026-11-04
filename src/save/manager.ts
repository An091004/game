import { SAVE_CONFIG, SAVE_TEXT } from "../data/save";
import type { GameState } from "../state/types";
import { deserialize, serialize } from "./codec";
import { FutureSaveError, migrateSave } from "./migrations";
import type { SaveStore } from "./ports";

export type LoadResult =
  | {
      status: "new" | "ready" | "recovered" | "migrated";
      state: GameState | null;
    }
  | { status: "blocked"; state: null; error: unknown };
const promise = <T>(value: T | Promise<T>): value is Promise<T> =>
  !!value && typeof (value as Promise<T>).then === "function";

export class SaveManager {
  blocked = false;
  private loaded = false;
  private loading = false;
  private lastGood: string | null = null;
  private expectedMain: string | null = null;
  private pending: string | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private running: Promise<boolean> | null = null;
  private draining = false;
  constructor(
    private readonly store: SaveStore,
    private readonly legacyStore: SaveStore = store,
    private readonly onError: (error: unknown) => void = () => {},
  ) {}

  async load(): Promise<LoadResult> {
    if (this.loaded || this.loading)
      throw Error("SaveManager.load() called twice");
    this.loading = true;
    try {
      const main = await this.store.get(SAVE_CONFIG.mainKey);
      this.expectedMain = main;
      if (main !== null) {
        try {
          const state = deserialize(main);
          this.lastGood = main;
          return { status: "ready", state };
        } catch (error) {
          if (error instanceof FutureSaveError) throw error;
        }
      }
      const backup = await this.store.get(SAVE_CONFIG.backupKey);
      if (backup !== null) {
        try {
          const state = deserialize(backup);
          this.lastGood = backup;
          return { status: "recovered", state };
        } catch (error) {
          if (error instanceof FutureSaveError) throw error;
        }
      }
      if (main !== null || backup !== null) throw Error(SAVE_TEXT.invalid);
      const legacy = await this.legacyStore.get(SAVE_CONFIG.legacyKey);
      if (legacy !== null) {
        if (legacy.length > SAVE_CONFIG.maxLength)
          throw Error(SAVE_TEXT.invalid);
        const state = migrateSave(JSON.parse(legacy));
        this.lastGood = serialize(state);
        return { status: "migrated", state };
      }
      return { status: "new", state: null };
    } catch (error) {
      this.blocked = true;
      return { status: "blocked", state: null, error };
    } finally {
      this.loaded = true;
      this.loading = false;
    }
  }

  markDirty(state: GameState): void {
    if (!this.loaded || this.blocked) return;
    try {
      const snapshot = serialize(state);
      if (snapshot === this.lastGood && this.expectedMain === this.lastGood && this.pending === null) return;
      this.pending = snapshot;
      // Gom thay đổi trong cửa sổ tối đa 5 giây; tick 1 giây không đẩy lùi mãi hạn lưu.
      if (this.timer === null)
        this.timer = setTimeout(() => {
          this.timer = null;
          void this.flush();
        }, SAVE_CONFIG.autosaveMs);
    } catch (error) {
      this.fail(error);
    }
  }

  flush(): Promise<boolean> {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (!this.loaded || this.blocked) return Promise.resolve(false);
    if (this.running && this.draining) return this.running;
    // Web store chạy setItem ngay trong lần gọi này trước bất kỳ await nào.
    const task = this.drain();
    this.running = task;
    void task.finally(() => {
      if (this.running === task) this.running = null;
    });
    return task;
  }

  private async drain(): Promise<boolean> {
    this.draining = true;
    try {
      while (this.pending !== null) {
        const snapshot = this.pending;
        this.pending = null;
        let current = this.store.get(SAVE_CONFIG.mainKey);
        if (promise(current)) current = await current;
        if (current !== this.expectedMain) throw Error(SAVE_TEXT.conflict);
        const backup = this.lastGood ?? snapshot;
        let write = this.store.set(SAVE_CONFIG.backupKey, backup);
        if (promise(write)) await write;
        let check = this.store.get(SAVE_CONFIG.backupKey);
        if (promise(check)) check = await check;
        if (check !== backup) throw Error(SAVE_TEXT.incomplete);
        write = this.store.set(SAVE_CONFIG.mainKey, snapshot);
        if (promise(write)) await write;
        check = this.store.get(SAVE_CONFIG.mainKey);
        if (promise(check)) check = await check;
        if (check !== snapshot) throw Error(SAVE_TEXT.incomplete);
        this.lastGood = snapshot;
        this.expectedMain = snapshot;
      }
      return true;
    } catch (error) {
      this.fail(error);
      return false;
    } finally {
      this.draining = false;
    }
  }

  private fail(error: unknown) {
    this.blocked = true;
    this.pending = null;
    if (this.timer !== null) clearTimeout(this.timer);
    this.timer = null;
    this.onError(error);
  }
}
