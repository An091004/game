import { describe, expect, it, vi } from "vitest";
import { newState } from "../src/state/create";
import { migrateSave } from "../src/save/migrations";
import { serialize, deserialize } from "../src/save/codec";
import { createBackHandler } from "../src/engine/back";
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
function harness() {
  let page = "practice",
    now = 0;
  const deps = {
    closeDialog: vi.fn(() => false),
    page: () => page,
    navigate: vi.fn((next: string) => {
      page = next;
    }),
    hint: vi.fn(),
    flush: vi.fn(async () => true),
    exit: vi.fn(async () => {}),
    failed: vi.fn(),
    now: () => now,
  };
  return {
    deps,
    back: createBackHandler(deps),
    page: (value: string) => {
      page = value;
    },
    time: (value: number) => {
      now = value;
    },
  };
}
describe("Back Android", () => {
  it("đóng modal trước và bỏ lần Back đã đếm", async () => {
    const h = harness();
    await h.back.press();
    h.deps.closeDialog.mockReturnValueOnce(true);
    await h.back.press();
    await h.back.press();
    expect(h.deps.exit).not.toHaveBeenCalled();
    expect(h.deps.hint).toHaveBeenCalledTimes(2);
  });
  it.each(MORE_PAGES)(
    "%s quay về Thêm rồi Tu luyện, không thoát",
    async (page) => {
      const h = harness();
      h.page(page);
      await h.back.press();
      await h.back.press();
      expect(h.deps.navigate.mock.calls).toEqual([["more"], ["practice"]]);
      expect(h.deps.exit).not.toHaveBeenCalled();
    },
  );
  it("tab chính quay về Tu luyện, cần hai Back mới để thoát", async () => {
    const h = harness();
    h.page("travel");
    await h.back.press();
    await h.back.press();
    expect(h.deps.exit).not.toHaveBeenCalled();
    await h.back.press();
    expect(h.deps.exit).toHaveBeenCalledOnce();
  });
  it("Back quá 2 giây chỉ nhắc lại", async () => {
    const h = harness();
    await h.back.press();
    h.time(2001);
    await h.back.press();
    expect(h.deps.exit).not.toHaveBeenCalled();
    expect(h.deps.hint).toHaveBeenCalledTimes(2);
  });
  it("xuống nền/điều hướng reset lần Back trước", async () => {
    const h = harness();
    await h.back.press();
    h.back.reset();
    await h.back.press();
    expect(h.deps.exit).not.toHaveBeenCalled();
  });
  it("chờ lưu hoàn tất, chống bấm liên tiếp khi đang lưu", async () => {
    const h = harness();
    let resolve!: (value: boolean) => void;
    h.deps.flush.mockImplementationOnce(
      () =>
        new Promise<boolean>((r) => {
          resolve = r;
        }),
    );
    await h.back.press();
    const pending = h.back.press();
    await h.back.press();
    expect(h.deps.exit).not.toHaveBeenCalled();
    expect(h.deps.flush).toHaveBeenCalledOnce();
    resolve(true);
    await pending;
    expect(h.deps.exit).toHaveBeenCalledOnce();
  });
  it("lỗi lưu không gọi thoát", async () => {
    const h = harness();
    h.deps.flush.mockResolvedValue(false);
    await h.back.press();
    await h.back.press();
    expect(h.deps.exit).not.toHaveBeenCalled();
    expect(h.deps.failed).toHaveBeenCalledOnce();
  });
  it("lỗi native được báo và cho thử lại", async () => {
    const h = harness();
    h.deps.exit.mockRejectedValueOnce(Error("native"));
    await h.back.press();
    await h.back.press();
    await h.back.press();
    await h.back.press();
    expect(h.deps.failed).toHaveBeenCalledOnce();
    expect(h.deps.exit).toHaveBeenCalledTimes(2);
  });
  it("đồng hồ lùi không bị coi là lần Back thứ hai", async () => {
    const h = harness();
    h.time(100);
    await h.back.press();
    h.time(0);
    await h.back.press();
    expect(h.deps.exit).not.toHaveBeenCalled();
  });
});
it("điều hướng dưới tối đa 5 mục, màn phụ thuộc Thêm", () => {
  expect(BOTTOM_PAGES.length).toBeLessThanOrEqual(5);
  for (const page of MORE_PAGES) expect(bottomPage(page)).toBe("more");
  for (const page of BOTTOM_PAGES) expect(bottomPage(page)).toBe(page);
});
