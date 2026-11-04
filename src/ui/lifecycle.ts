import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { createActivity } from "../engine/activity";

export async function bindLifecycle(onPause: () => void, onResume: () => void) {
  const activity = createActivity(onPause, onResume, !document.hidden);
  document.addEventListener("visibilitychange", () =>
    activity.document(!document.hidden),
  );
  window.addEventListener("pagehide", () => activity.page(false));
  window.addEventListener("pageshow", () => activity.page(true));
  if (Capacitor.isNativePlatform()) {
    await App.addListener("appStateChange", ({ isActive }) =>
      activity.native(isActive),
    );
    activity.native((await App.getState()).isActive);
  }
  return activity;
}
