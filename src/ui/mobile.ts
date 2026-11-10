import { NAV } from "../data/config";
import { MOBILE, BOTTOM_PAGES, MORE_PAGES, bottomPage } from "../data/mobile";
import type { GameState } from "../state/types";
import { $ } from "./dom";
import { icon } from "./icons";

function markup(id: string, html: string) {
  const element = $(id);
  // Giữ focus của nút khi tick không thay đổi cấu trúc điều hướng.
  if (element.dataset.markup !== html) {
    const focused = element.contains(document.activeElement)
      ? (document.activeElement as HTMLElement)?.dataset.id
      : undefined;
    element.innerHTML = html;
    element.dataset.markup = html;
    if (focused)
      element
        .querySelector<HTMLElement>(`[data-id="${focused}"]`)
        ?.focus({ preventScroll: true });
  }
}
export function renderNavigation(state: GameState, page: string) {
  const button = (n: (typeof NAV)[number], selected: boolean) => {
    const locked = state.stage < n.unlock;
    return `<button type="button" class="nav-item ${selected ? "active" : ""} ${locked ? "locked" : ""}" data-action="goto" data-id="${n.id}" ${selected ? 'aria-current="page"' : ""} ${locked ? `aria-disabled="true" aria-label="${n.label}: ${MOBILE.locked}"` : ""}><span class="nav-icon">${icon(n.id)}</span><span>${n.label}</span>${locked ? `<span class="lock-mark">${icon("lock")}</span>` : ""}</button>`;
  };
  markup(
    "navigation",
    NAV.filter((n) => n.id !== "more")
      .map((n) => button(n, page === n.id))
      .join(""),
  );
  markup(
    "bottomNavigation",
    BOTTOM_PAGES.map((id) => NAV.find((n) => n.id === id)!)
      .map((n) => button(n, bottomPage(page) === n.id))
      .join(""),
  );
  markup(
    "moreLinks",
    MORE_PAGES.map((id) => NAV.find((n) => n.id === id)!)
      .map((n) => button(n, false))
      .join(""),
  );
}
export function setupMobile() {
  $("page-more").innerHTML =
    `<h1 class="page-heading">${MOBILE.moreTitle}</h1><p class="page-intro">${MOBILE.moreIntro}</p><div class="card more-links" id="moreLinks"></div><button class="secondary-button" data-action="open-backup">${MOBILE.backup}</button>`;
  $("page-settings").innerHTML =
    `<h1 class="page-heading">${MOBILE.settingsTitle}</h1><p class="page-intro">${MOBILE.settingsIntro}</p><div class="card settings-card">${[
      ["theme", MOBILE.theme, MOBILE.themeHint],
      ["music", MOBILE.music, MOBILE.musicHint],
      ["haptics", MOBILE.haptics, MOBILE.hapticsHint],
      ["batterySaver", MOBILE.battery, MOBILE.batteryHint],
    ]
      .map(
        ([key, label, hint]) =>
          `<label class="setting-row"><span><strong>${label}</strong><small>${hint}</small></span><input type="checkbox" role="switch" id="setting-${key}" data-setting="${key}"></label>`,
      )
      .join("")}
  <div class="setting-row"><strong>${MOBILE.font} <span id="fontValue"></span></strong><div class="font-buttons"><button data-action="font-down" aria-label="${MOBILE.fontDown}">A−</button><button data-action="font-up" aria-label="${MOBILE.fontUp}">A+</button></div></div></div><button class="secondary-button" data-action="open-backup">${MOBILE.backup}</button>`;
  document.querySelectorAll<HTMLElement>(".content-page").forEach((page) => {
    page.tabIndex = -1;
    if (!MORE_PAGES.includes(page.id.slice(5))) return;
    const back = document.createElement("button");
    back.className = "more-back little-button";
    back.dataset.action = "goto";
    back.dataset.id = "more";
    back.textContent = MOBILE.backMore;
    page.prepend(back);
  });
}
export function renderSettings(state: GameState) {
  const settings = state.settings;
  for (const key of ["theme", "music", "haptics", "batterySaver"] as const) {
    (document.getElementById(`setting-${key}`) as HTMLInputElement).checked =
      key === "theme" ? settings.theme === "light" : settings[key];
  }
  $("fontValue").textContent = `${Math.round(settings.fontScale * 100)}%`;
  document.documentElement.dataset.battery = String(settings.batterySaver);
  document
    .querySelectorAll<HTMLButtonElement>(
      '[data-action="font-up"], [data-action="font-down"]',
    )
    .forEach((button) => {
      button.disabled =
        settings.fontScale ===
        (button.dataset.action === "font-up"
          ? MOBILE.fontSizes.at(-1)
          : MOBILE.fontSizes[0]);
    });
  $("soundToggle").setAttribute("aria-pressed", String(settings.music));
}
