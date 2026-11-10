import { Capacitor, SystemBars, SystemBarsStyle } from "@capacitor/core";
import { App } from "@capacitor/app";

export async function bindAndroidBack(press: () => Promise<void>) {
  if (Capacitor.getPlatform() !== "android") return;
  await App.addListener("backButton", () => {
    void press();
  });
}
export async function exitAndroid() {
  await App.exitApp();
}
export async function setSystemTheme(theme: "dark" | "light") {
  if (!Capacitor.isNativePlatform()) return;
  await SystemBars.setStyle({
    style: theme === "dark" ? SystemBarsStyle.Dark : SystemBarsStyle.Light,
  });
}
