import { afterEach, describe, expect, it, vi } from "vitest";
import { createSaveStore, localStore } from "../src/save/ports";
afterEach(() => {
  vi.resetAllMocks();
  vi.unstubAllGlobals();
});
describe("Chọn nơi lưu", () => {
  it("web dùng trực tiếp localStorage, đồng bộ để flush khi pagehide", () => {
    const getItem = vi.fn(() => "web"),
      setItem = vi.fn();
    vi.stubGlobal("window", { localStorage: { getItem, setItem } });
    const store = createSaveStore();
    expect(store).toBe(localStore);
    expect(store.get("key")).toBe("web");
    expect(store.set("key", "value")).toBeUndefined();
    expect(setItem).toHaveBeenCalledWith("key", "value");
  });
  it("lỗi đọc không bị biến thành kho rỗng", () => {
    vi.stubGlobal("window", {
      get localStorage() {
        throw Error("SecurityError");
      },
    });
    expect(() => createSaveStore().get("key")).toThrow("SecurityError");
  });
  it("hết dung lượng được chuyển cho SaveManager xử lý", () => {
    vi.stubGlobal("window", {
      localStorage: {
        setItem: () => {
          throw Error("QuotaExceededError");
        },
      },
    });
    expect(() => createSaveStore().set("key", "value")).toThrow(
      "QuotaExceededError",
    );
  });
});
