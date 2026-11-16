import { describe, expect, it } from "vitest";
import { CHARACTER } from "../src/data/character";
import { CONFIG, STAGES } from "../src/data/config";
import { parseCharacter } from "../src/state/character";
import { newState } from "../src/state/create";
import { migrateSave } from "../src/save/migrations";
import { checksum, deserialize, serialize } from "../src/save/codec";
import { SaveManager } from "../src/save/manager";
import { SAVE_CONFIG } from "../src/data/save";
import { characterView } from "../src/character/model";
import { renderCharacter } from "../src/character/render";

describe("Ngoại hình và save tương thích", () => {
  it.each([1, 2])(
    "save v%s chưa có nhân vật vẫn giữ toàn bộ tiến trình",
    (version) => {
      const raw = JSON.parse(JSON.stringify(newState()));
      raw.stage = 11;
      raw.qi = 9876;
      raw.stones = 89;
      raw.journal = [{ at: 100, text: "Đạo tâm" }];
      delete raw.character;
      if (version === 1) {
        delete raw.saveVersion;
        delete raw.lastSeenAt;
      }
      const result = migrateSave(raw);
      expect(result).toMatchObject({
        character: null,
        stage: 11,
        qi: 9876,
        stones: 89,
        journal: raw.journal,
      });
    },
  );
  it("xuất/nhập nhân vật với tên tiếng Việt không làm đổi dữ liệu game", () => {
    const state = newState();
    state.character = {
      name: "Mây Trắng",
      gender: "female",
      hair: "long",
      robe: "moon",
    };
    expect(deserialize(serialize(state))).toEqual(state);
    expect(migrateSave(migrateSave(state))).toEqual(state);
  });
  it("chuẩn hóa tên NFC và khoảng trắng; không đếm dấu tổ hợp thành ký tự thừa", () => {
    expect(
      parseCharacter({ ...CHARACTER.defaultProfile, name: "  Mây   Trắng  " })
        ?.name,
    ).toBe("Mây Trắng");
    expect(
      parseCharacter({ ...CHARACTER.defaultProfile, name: "雲".repeat(24) })
        ?.name,
    ).toHaveLength(24);
  });
  it.each([
    {},
    [],
    42,
    "abc",
    { name: "" },
    { name: "a".repeat(25) },
    { name: "A\u202eB" },
    { gender: "unknown" },
    { hair: "url(x)" },
    { robe: "#fff" },
  ])("từ chối ngoại hình sai: %j", (invalid) => {
    const value =
      typeof invalid === "object" &&
      !Array.isArray(invalid) &&
      Object.keys(invalid).length
        ? { ...CHARACTER.defaultProfile, ...invalid }
        : invalid;
    expect(() => parseCharacter(value)).toThrow();
  });
  it("profile lỗi trong hai ô hợp checksum vẫn khóa ghi, không tạo nhân vật/save rỗng", async () => {
    const state = newState();
    state.character = { ...CHARACTER.defaultProfile };
    const envelope = JSON.parse(serialize(state));
    const payload = JSON.parse(envelope.payload);
    payload.character.robe = "missing";
    envelope.payload = JSON.stringify(payload);
    envelope.checksum = checksum(envelope.payload);
    const raw = JSON.stringify(envelope),
      data = new Map<string, string>([
        [SAVE_CONFIG.mainKey, raw],
        [SAVE_CONFIG.backupKey, raw],
      ]);
    const writes: string[] = [];
    const manager = new SaveManager({
      get: (key) => data.get(key) ?? null,
      set: (key, value) => {
        writes.push(key);
        data.set(key, value);
      },
    });
    expect((await manager.load()).status).toBe("blocked");
    manager.markDirty(newState());
    expect(await manager.flush()).toBe(false);
    expect(writes).toEqual([]);
    expect(data.get(SAVE_CONFIG.mainKey)).toBe(raw);
  });
  it("profile ô chính lỗi phục hồi đúng ngoại hình và tiến trình trong backup", async () => {
    const state = newState();
    state.qi = 876;
    state.character = { ...CHARACTER.defaultProfile, name: "Trúc An" };
    const good = serialize(state),
      envelope = JSON.parse(good),
      raw = JSON.parse(envelope.payload);
    raw.character.hair = "invalid";
    envelope.payload = JSON.stringify(raw);
    envelope.checksum = checksum(envelope.payload);
    const data = new Map<string, string>([
      [SAVE_CONFIG.mainKey, JSON.stringify(envelope)],
      [SAVE_CONFIG.backupKey, good],
    ]);
    const manager = new SaveManager({
      get: (key) => data.get(key) ?? null,
      set: (key, value) => {
        data.set(key, value);
      },
    });
    const loaded = await manager.load();
    expect(loaded.status).toBe("recovered");
    expect(loaded.state).toEqual(state);
    expect(data.get(SAVE_CONFIG.backupKey)).toBe(good);
  });
});
describe("Nhân vật chỉ đọc trạng thái", () => {
  it("vẽ đủ 45 tổ hợp giới tính/tóc/áo, không sửa state", () => {
    const state = newState();
    for (const gender of CHARACTER.genders)
      for (const hair of CHARACTER.hairstyles)
        for (const robe of CHARACTER.robes) {
          state.character = {
            name: "Vân",
            gender: gender.id,
            hair: hair.id,
            robe: robe.id,
          } as NonNullable<typeof state.character>;
          const before = JSON.stringify(state);
          const svg = renderCharacter(state);
          expect(svg).toContain(robe.color);
          expect(svg).toContain("<svg");
          expect(svg).not.toMatch(/NaN|undefined/);
          expect(JSON.stringify(state)).toBe(before);
        }
  });
  it("tên có ký tự HTML được escape trong SVG", () => {
    const state = newState();
    state.character = {
      ...CHARACTER.defaultProfile,
      name: "<img src=x onerror=1>",
    };
    const svg = renderCharacter(state);
    expect(svg).not.toContain("<img");
    expect(svg).toContain("&lt;img");
  });
  it.each(CONFIG.realms.map((r, realm) => [realm, r.name] as const))(
    "hào quang cảnh giới %i (%s) đúng lớp và mức sáng",
    (realm) => {
      const state = newState();
      state.stage = STAGES.findIndex((stage) => stage.realmIndex === realm);
      const empty = characterView(state);
      state.qi = 1e12;
      const full = characterView(state);
      expect(full.realm).toBe(realm);
      expect(full.ratio).toBe(1);
      expect(full.auraOpacity).toBeCloseTo(0.8);
      expect(full.auraOpacity).toBeGreaterThanOrEqual(empty.auraOpacity);
      const svg = renderCharacter(state);
      expect(svg.includes('class="character-core"')).toBe(realm >= 2);
      expect(svg.includes('class="character-spirit"')).toBe(realm >= 3);
      expect(full.extraRings).toBe(Math.max(0, realm - 3));
    },
  );
  it("độ sáng theo % linh khí, không vượt trần khi tích dư", () => {
    const state = newState();
    state.qi = CONFIG.costs[0] / 2;
    expect(characterView(state).ratio).toBe(0.5);
    expect(characterView(state).auraOpacity).toBeCloseTo(0.49);
    state.qi = -1;
    expect(characterView(state).ratio).toBe(0);
  });
  it("tư thế đi bộ/lò đan/đột phá tách biệt; id SVG không trùng giữa vị trí", () => {
    const state = newState();
    const walk = renderCharacter(state, { activity: "travel", slot: "travel" });
    const brew = renderCharacter(state, {
      activity: "alchemy",
      slot: "alchemy",
    });
    const storm = renderCharacter(state, {
      activity: "breakthrough",
      slot: "storm",
    });
    expect(walk).toContain('class="character-leg');
    expect(walk).not.toContain('class="character-furnace"');
    expect(brew).toContain('class="character-furnace"');
    expect(brew).toContain('class="character-smoke"');
    expect(storm).toContain('class="character-burst"');
    const ids = [...(walk + brew + storm).matchAll(/ id="([^"]+)"/g)].map(
      (m) => m[1],
    );
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("tổng thời gian dựa vào mốc hiện có, không cộng bộ đếm hay lùi âm", () => {
    const state = newState();
    state.createdAt = 1_000;
    state.lastSeenAt = 90_001_000;
    expect(characterView(state).elapsedSeconds).toBe(90000);
    state.lastSeenAt = 500;
    expect(characterView(state).elapsedSeconds).toBe(0);
  });
});
