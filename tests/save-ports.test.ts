import { afterEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  native: vi.fn(),
  get: vi.fn(),
  set: vi.fn(),
}));
vi.mock("@capacitor/core", () => ({
  Capacitor: { isNativePlatform: mocks.native },
}));
vi.mock("@capacitor/preferences", () => ({
  Preferences: { get: mocks.get, set: mocks.set },
}));
import {
  createSaveStore,
  preferencesStore,
  localStore,
} from "../src/save/ports";
afterEach(() => {
  vi.resetAllMocks();
  vi.unstubAllGlobals();
});
describe("Chọn nơi lưu", () => {
  it("web dùng trực tiếp localStorage, đồng bộ để flush khi pagehide", () => {
    mocks.native.mockReturnValue(false);
    const getItem = vi.fn(() => "web"),
      setItem = vi.fn();
    vi.stubGlobal("window", { localStorage: { getItem, setItem } });
    const store = createSaveStore();
    expect(store).toBe(localStore);
    expect(store.get("key")).toBe("web");
    expect(store.set("key", "value")).toBeUndefined();
    expect(setItem).toHaveBeenCalledWith("key", "value");
  });
  it("native dùng Preferences get/set đúng khóa", async () => {
    mocks.native.mockReturnValue(true);
    mocks.get.mockResolvedValue({ value: "native" });
    mocks.set.mockResolvedValue(undefined);
    const store = createSaveStore();
    expect(store).toBe(preferencesStore);
    expect(await store.get("key")).toBe("native");
    await store.set("key", "value");
    expect(mocks.get).toHaveBeenCalledWith({ key: "key" });
    expect(mocks.set).toHaveBeenCalledWith({ key: "key", value: "value" });
  });
  it("Preferences lỗi không đổi sang localStorage rỗng", async () => {
    mocks.native.mockReturnValue(true);
    mocks.get.mockRejectedValue(Error("native denied"));
    const getItem = vi.fn();
    vi.stubGlobal("window", { localStorage: { getItem } });
    await expect(createSaveStore().get("key")).rejects.toThrow("native denied");
    expect(getItem).not.toHaveBeenCalled();
  });
});
