import { expect, it, vi } from "vitest";
const native = vi.hoisted(() => ({
  platform: "web",
  listener: vi.fn(),
  exit: vi.fn(),
  style: vi.fn(),
}));
vi.mock("@capacitor/core", () => ({
  Capacitor: {
    getPlatform: () => native.platform,
    isNativePlatform: () => native.platform !== "web",
  },
  SystemBars: { setStyle: native.style },
  SystemBarsStyle: { Dark: "DARK", Light: "LIGHT" },
}));
vi.mock("@capacitor/app", () => ({
  App: { addListener: native.listener, exitApp: native.exit },
}));
import { bindAndroidBack, exitAndroid, setSystemTheme } from "../src/ui/native";

it("web không gọi plugin native", async () => {
  native.platform = "web";
  native.listener.mockClear();
  native.style.mockClear();
  await bindAndroidBack(vi.fn());
  await setSystemTheme("dark");
  expect(native.listener).not.toHaveBeenCalled();
  expect(native.style).not.toHaveBeenCalled();
});
it("Android nối đúng sự kiện Back, đổi biểu tượng hệ thống và thoát", async () => {
  native.platform = "android";
  const press = vi.fn(async () => {});
  await bindAndroidBack(press);
  expect(native.listener.mock.lastCall?.[0]).toBe("backButton");
  native.listener.mock.lastCall?.[1]();
  expect(press).toHaveBeenCalledOnce();
  await setSystemTheme("dark");
  expect(native.style).toHaveBeenLastCalledWith({ style: "DARK" });
  await setSystemTheme("light");
  expect(native.style).toHaveBeenLastCalledWith({ style: "LIGHT" });
  await exitAndroid();
  expect(native.exit).toHaveBeenCalledOnce();
});
