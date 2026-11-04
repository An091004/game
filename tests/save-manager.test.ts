import { afterEach, describe, expect, it, vi } from "vitest";
import { SAVE_CONFIG } from "../src/data/save";
import { newState } from "../src/state/create";
import { checksum, deserialize, serialize } from "../src/save/codec";
import { FutureSaveError, migrateSave } from "../src/save/migrations";
import { SaveManager } from "../src/save/manager";
import type { SaveStore } from "../src/save/ports";
import { applyElapsed } from "../src/engine/elapsed";
import { createActivity } from "../src/engine/activity";

const { mainKey, backupKey, legacyKey } = SAVE_CONFIG;
function sample(qi = 100) {
  const s = newState();
  s.createdAt = 42;
  s.qi = qi;
  s.lastSeenAt = 1_000_000;
  s.lastSeen = s.lastSeenAt;
  s.journal = [{ at: 42, text: "Mây về bên hiên 雲" }];
  return s;
}
function memory(initial: Record<string, string | undefined> = {}) {
  const data = new Map(
    Object.entries(initial).filter(
      (entry): entry is [string, string] => entry[1] !== undefined,
    ),
  );
  const writes: { key: string; value: string }[] = [];
  const store: SaveStore = {
    get: (key) => data.get(key) ?? null,
    set: (key, value) => {
      writes.push({ key, value });
      data.set(key, value);
    },
  };
  return { data, writes, store };
}
afterEach(() => vi.useRealTimers());

describe("Codec và migration", () => {
  it("CRC32 khớp vector chuẩn", () =>
    expect(checksum("123456789")).toBe("cbf43926"));
  it("serialize/deserialize giữ dữ liệu tiếng Việt và saveVersion", () =>
    expect(deserialize(serialize(sample()))).toEqual(sample()));
  it("sửa payload làm checksum thất bại", () => {
    const raw = JSON.parse(serialize(sample()));
    raw.payload = raw.payload.replace("100,", "101,");
    expect(() => deserialize(JSON.stringify(raw))).toThrow();
  });
  it.each(["{bad", "null", "{}", "[]"])(
    "từ chối envelope không hợp lệ: %s",
    (raw) => expect(() => deserialize(raw)).toThrow(),
  );
  it("migration v1 lấy mốc lastSeen và giữ tiến trình", () => {
    const raw = JSON.parse(JSON.stringify(sample(777)));
    delete raw.saveVersion;
    delete raw.lastSeenAt;
    raw.stage = 9;
    expect(migrateSave(raw)).toMatchObject({
      saveVersion: 2,
      lastSeenAt: 1_000_000,
      qi: 777,
      stage: 9,
    });
  });
  it("migration có tính lặp an toàn", () => {
    const once = migrateSave(sample());
    expect(migrateSave(once)).toEqual(once);
  });
  it.each([
    { version: 1 },
    { ...sample(), qi: "bad" },
    { ...sample(), stage: 99 },
    { ...sample(), manuals: {} },
  ])("không chuẩn hóa state thiếu/hỏng thành save mới", (raw) =>
    expect(() => migrateSave(raw)).toThrow(),
  );
  it("save tương lai có lỗi riêng để không rollback sang backup cũ", () =>
    expect(() => migrateSave({ ...sample(), saveVersion: 99 })).toThrow(
      FutureSaveError,
    ));
  it("giới hạn danh sách và kích thước", () => {
    const s = sample();
    s.journal = Array.from({ length: 600 }, (_, at) => ({
      at,
      text: "a".repeat(1000),
    }));
    const restored = deserialize(serialize(s));
    expect(restored.journal.length).toBeLessThanOrEqual(500);
    expect(restored.journal[0].text.length).toBeLessThanOrEqual(320);
    expect(() => deserialize("x".repeat(SAVE_CONFIG.maxLength + 1))).toThrow();
  });
});

describe("Hai ô lưu và khóa ghi", () => {
  it('phiên cũ không ghi đè khi ô chính đã đổi từ nơi khác',async()=>{
    const m=memory({[mainKey]:serialize(sample(1))}),manager=new SaveManager(m.store);
    await manager.load();const newer=serialize(sample(9));m.data.set(mainKey,newer);
    manager.markDirty(sample(2));expect(await manager.flush()).toBe(false);
    expect(m.data.get(mainKey)).toBe(newer);expect(m.writes).toHaveLength(0);
  });
  it("không ghi trước khi load hoàn tất", async () => {
    let resolve!: (value: null) => void;
    const store: SaveStore = {
      get: vi
        .fn()
        .mockImplementationOnce(() => new Promise((r) => (resolve = r)))
        .mockReturnValue(null),
      set: vi.fn(),
    };
    const manager = new SaveManager(store);
    const loading = manager.load();
    manager.markDirty(sample());
    expect(await manager.flush()).toBe(false);
    resolve(null);
    expect((await loading).status).toBe("new");
    expect(store.set).not.toHaveBeenCalled();
  });
  it("ô chính hợp lệ được ưu tiên", async () => {
    const m = memory({
      [mainKey]: serialize(sample(8)),
      [backupKey]: serialize(sample(2)),
    });
    const manager = new SaveManager(m.store);
    expect(await manager.load()).toMatchObject({
      status: "ready",
      state: { qi: 8 },
    });
    expect(m.writes).toHaveLength(0);
  });
  it("ô chính hỏng phục hồi backup và không xoay chuỗi hỏng vào backup", async () => {
    const good = serialize(sample(2));
    const m = memory({ [mainKey]: "bad", [backupKey]: good });
    const manager = new SaveManager(m.store);
    expect((await manager.load()).status).toBe("recovered");
    manager.markDirty(sample(3));
    await manager.flush();
    expect(m.data.get(backupKey)).toBe(good);
    expect(deserialize(m.data.get(mainKey)!).qi).toBe(3);
  });
  it("ô chính thiếu vẫn phục hồi backup", async () => {
    const m = memory({ [backupKey]: serialize(sample()) });
    expect((await new SaveManager(m.store).load()).status).toBe("recovered");
  });
  it.each([
    { [mainKey]: "bad", [backupKey]: "also bad" },
    { [mainKey]: "bad" },
    { [backupKey]: "bad" },
  ])("các ô hỏng không được ghi đè", async (initial) => {
    const m = memory(initial),
      manager = new SaveManager(m.store);
    expect((await manager.load()).status).toBe("blocked");
    manager.markDirty(newState());
    expect(await manager.flush()).toBe(false);
    expect(m.writes).toHaveLength(0);
  });
  it("lỗi đọc không bị hiểu là chưa có save", async () => {
    const set = vi.fn();
    const manager = new SaveManager({
      get() {
        throw Error("denied");
      },
      set,
    });
    expect((await manager.load()).status).toBe("blocked");
    manager.markDirty(newState());
    await manager.flush();
    expect(set).not.toHaveBeenCalled();
  });
  it("không dùng v1 cũ nếu hai ô mới hỏng", async () => {
    const m = memory({
      [mainKey]: "bad",
      [backupKey]: "bad",
      [legacyKey]: JSON.stringify(sample()),
    });
    expect((await new SaveManager(m.store).load()).status).toBe("blocked");
  });
  it("migrate từ localStorage sang store khác, giữ nguyên v1", async () => {
    const s = JSON.parse(JSON.stringify(sample()));
    delete s.saveVersion;
    delete s.lastSeenAt;
    const old = memory({ [legacyKey]: JSON.stringify(s) }),
      target = memory();
    const manager = new SaveManager(target.store, old.store);
    const loaded = await manager.load();
    expect(loaded.status).toBe("migrated");
    manager.markDirty(loaded.state!);
    await manager.flush();
    expect(old.writes).toHaveLength(0);
    expect(old.data.has(legacyKey)).toBe(true);
    expect(deserialize(target.data.get(mainKey)!).qi).toBe(s.qi);
    expect(target.data.has(backupKey)).toBe(true);
  });
  it("save v1 hỏng khóa ghi cả hai ô mới", async () => {
    const m = memory({ [legacyKey]: "broken" }),
      manager = new SaveManager(m.store);
    expect((await manager.load()).status).toBe("blocked");
    manager.markDirty(newState());
    await manager.flush();
    expect(m.writes).toHaveLength(0);
  });
  it("lần đầu tạo hai ô cùng hợp lệ", async () => {
    const m = memory(),
      manager = new SaveManager(m.store);
    expect((await manager.load()).status).toBe("new");
    manager.markDirty(sample());
    await manager.flush();
    expect(m.data.get(mainKey)).toBe(m.data.get(backupKey));
    expect(deserialize(m.data.get(mainKey)!)).toEqual(sample());
  });
  it("backup giữ phiên đã lưu trước đó", async () => {
    const m = memory(),
      manager = new SaveManager(m.store);
    await manager.load();
    manager.markDirty(sample(1));
    await manager.flush();
    manager.markDirty(sample(2));
    await manager.flush();
    expect(deserialize(m.data.get(backupKey)!).qi).toBe(1);
    expect(deserialize(m.data.get(mainKey)!).qi).toBe(2);
  });
  it("flush web ghi ngay trước khi trả promise", async () => {
    const m = memory(),
      manager = new SaveManager(m.store);
    await manager.load();
    manager.markDirty(sample(5));
    const done = manager.flush();
    expect(deserialize(m.data.get(mainKey)!).qi).toBe(5);
    await done;
  });
  it("hai flush đồng bộ cùng lượt không bỏ lần mới nhất", async () => {
    const m = memory(),
      manager = new SaveManager(m.store);
    await manager.load();
    manager.markDirty(sample(1));
    const a = manager.flush();
    manager.markDirty(sample(2));
    const b = manager.flush();
    expect(deserialize(m.data.get(mainKey)!).qi).toBe(2);
    await Promise.all([a, b]);
  });
  it("gián đoạn trước ghi main vẫn giữ bản cũ", async () => {
    const old = serialize(sample(1)),
      m = memory({ [mainKey]: old });
    const store: SaveStore = {
      get: m.store.get,
      set(key, value) {
        if (key === mainKey) throw Error("disk full");
        m.store.set(key, value);
      },
    };
    const manager = new SaveManager(store);
    await manager.load();
    manager.markDirty(sample(2));
    expect(await manager.flush()).toBe(false);
    expect(manager.blocked).toBe(true);
    expect(m.data.get(mainKey)).toBe(old);
    expect(m.data.get(backupKey)).toBe(old);
  });
  it("ghi main bị hỏng vẫn phục hồi được backup", async () => {
    const old = serialize(sample(1)),
      m = memory({ [mainKey]: old });
    const store: SaveStore = {
      get: m.store.get,
      set(key, value) {
        m.data.set(key, key === mainKey ? "partial" : value);
      },
    };
    const manager = new SaveManager(store);
    await manager.load();
    manager.markDirty(sample(2));
    expect(await manager.flush()).toBe(false);
    expect(await new SaveManager(m.store).load()).toMatchObject({
      status: "recovered",
      state: { qi: 1 },
    });
  });
  it("không rollback save phiên bản tương lai", async () => {
    const envelope = JSON.parse(serialize(sample()));
    const state = JSON.parse(envelope.payload);
    state.saveVersion = 99;
    envelope.payload = JSON.stringify(state);
    envelope.checksum = checksum(envelope.payload);
    const m = memory({
      [mainKey]: JSON.stringify(envelope),
      [backupKey]: serialize(sample(1)),
    });
    expect((await new SaveManager(m.store).load()).status).toBe("blocked");
    expect(m.writes).toHaveLength(0);
  });
  it("debounce có hạn 5 giây, tick liên tục không làm đói lần ghi", async () => {
    vi.useFakeTimers();
    const m = memory(),
      manager = new SaveManager(m.store);
    await manager.load();
    for (let i = 1; i <= 5; i++) {
      manager.markDirty(sample(i));
      await vi.advanceTimersByTimeAsync(1000);
    }
    expect(deserialize(m.data.get(mainKey)!).qi).toBe(5);
    expect(m.writes).toHaveLength(2);
  });
  it("không ghi lại khi state không đổi", async () => {
    vi.useFakeTimers();
    const m = memory(),
      manager = new SaveManager(m.store);
    await manager.load();
    const s = sample();
    manager.markDirty(s);
    await manager.flush();
    const count = m.writes.length;
    manager.markDirty(s);
    await vi.advanceTimersByTimeAsync(10000);
    expect(m.writes.length).toBe(count);
  });
  it("xếp tuần tự ghi native và giữ snapshot mới trong lúc ghi", async () => {
    let release!: () => void;
    let once = true;
    const m = memory();
    const store: SaveStore = {
      get: async (key) => m.store.get(key),
      set: async (key, value) => {
        if (once) {
          once = false;
          await new Promise<void>((r) => (release = r));
        }
        m.store.set(key, value);
      },
    };
    const manager = new SaveManager(store);
    await manager.load();
    manager.markDirty(sample(1));
    const first = manager.flush();
    manager.markDirty(sample(9));
    const second = manager.flush();
    await vi.waitFor(()=>expect(release).toBeTypeOf('function'));
    release();
    await Promise.all([first, second]);
    expect(deserialize(m.data.get(mainKey)!).qi).toBe(9);
    expect(deserialize(m.data.get(backupKey)!).qi).toBe(1);
  });
});

describe("Ngoại tuyến và vòng đời", () => {
  it("12 giờ chỉ cộng 8 giờ và lần resume trùng không cộng lại", () => {
    const s = sample(0);
    const now = s.lastSeenAt + 12 * 3600000;
    expect(applyElapsed(s, now, true)).toEqual({ seconds: 28800, gain: 41760 });
    expect(applyElapsed(s, now, true).gain).toBe(0);
    expect(s.stats.offlineSeconds).toBe(28800);
    expect(s.lastSeenAt).toBe(now);
  });
  it("đồng hồ lùi giữ mốc cao nhất, không nhân đôi lúc quay lại", () => {
    const s = sample(0);
    expect(applyElapsed(s, 900000, true).gain).toBe(0);
    expect(s.lastSeenAt).toBe(1000000);
    expect(applyElapsed(s, 1000000, true).gain).toBe(0);
    expect(applyElapsed(s, 1001000, true).gain).toBe(1.45);
  });
  it("buff hết giữa thời gian ngoại tuyến chỉ tính phần còn hiệu lực", () => {
    const s = sample(0);
    s.buffUntil = s.lastSeenAt + 5000;
    expect(applyElapsed(s, s.lastSeenAt + 10000, true).gain).toBeCloseTo(
      19.2125,
    );
  });
  it("lưu/đọc lại mốc mới không cộng lại khoảng đã tính", () => {
    const s = sample(0);
    applyElapsed(s, 1010000, true);
    const restored = deserialize(serialize(s));
    expect(applyElapsed(restored, 1010000, true).gain).toBe(0);
    expect(restored.qi).toBe(14.5);
  });
  it("hidden + appStateChange + pagehide chỉ pause/resume một lần", () => {
    const pause = vi.fn(),
      resume = vi.fn(),
      a = createActivity(pause, resume);
    a.document(false);
    a.native(false);
    a.page(false);
    expect(pause).toHaveBeenCalledTimes(1);
    a.native(true);
    a.page(true);
    expect(resume).not.toHaveBeenCalled();
    a.document(true);
    a.document(true);
    expect(resume).toHaveBeenCalledTimes(1);
  });
  it("khởi động khi ẩn chỉ resume khi hiện", () => {
    const pause = vi.fn(),
      resume = vi.fn(),
      a = createActivity(pause, resume, false);
    expect(a.active).toBe(false);
    a.document(true);
    expect(resume).toHaveBeenCalledTimes(1);
    expect(pause).not.toHaveBeenCalled();
  });
});
