import { describe, expect, it } from "vitest";
import { newState } from "../src/state/create";
import { migrateSave } from "../src/save/migrations";
import { serialize, deserialize } from "../src/save/codec";
import { BOTTOM_PAGES, MORE_PAGES, bottomPage } from "../src/data/mobile";

describe("Cài đặt cùng tiến trình", () => {
  it.each([1, 2])("save cũ v%s thêm mặc định mà giữ tiến trình", (version) => {
    const raw = JSON.parse(JSON.stringify(newState()));
    raw.qi = 314;
    raw.stage = 7;
    raw.settings = { theme: "light", fontScale: 1.2 };
    if (version === 1) {
      delete raw.saveVersion;
      delete raw.lastSeenAt;
    }
    expect(migrateSave(raw)).toMatchObject({
      qi: 314,
      stage: 7,
      settings: {
        theme: "light",
        fontScale: 1.2,
        music: false,
        haptics: false,
        batterySaver: false,
      },
    });
  });
  it("xuất/nhập giữ cả ba lựa chọn mới", () => {
    const state = newState();
    Object.assign(state.settings, {
      music: true,
      haptics: true,
      batterySaver: true,
    });
    expect(deserialize(serialize(state))).toEqual(state);
  });
  it.each(["music", "haptics", "batterySaver"])(
    "từ chối %s sai kiểu, không âm thầm đặt lại",
    (key) => {
      const raw = JSON.parse(JSON.stringify(newState()));
      raw.settings[key] = "true";
      expect(() => migrateSave(raw)).toThrow();
    },
  );
});
it("điều hướng dưới tối đa 5 mục, màn phụ thuộc Thêm", () => {
  expect(BOTTOM_PAGES.length).toBeLessThanOrEqual(5);
  for (const page of MORE_PAGES) expect(bottomPage(page)).toBe("more");
  for (const page of BOTTOM_PAGES) expect(bottomPage(page)).toBe(page);
});
