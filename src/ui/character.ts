import { CHARACTER, CHARACTER_TEXT as T } from "../data/character";
import { STAGES } from "../data/config";
import {
  characterView,
  type CharacterActivity,
  type CharacterSlot,
} from "../character/model";
import { renderCharacter } from "../character/render";
import type { CharacterProfile, GameState } from "../state/types";
import { parseCharacter } from "../state/character";
import { createProgression } from "../engine/progression";
import { openDialog, closeDialog } from "./dialogs";
import { $ } from "./dom";
import { format, money } from "./format";
import { TEXT } from "../data/text";
import { icon } from "./icons";

/** Có thể thay lớp SVG; chỉ ghi ngoại hình khi người chơi xác nhận bản nháp hợp lệ. */
export function setupCharacter(
  getState: () => GameState,
  save: (profile: CharacterProfile) => void,
) {
  const page = $("page-character");
  page.innerHTML = `<p class="page-eyebrow">${T.eyebrow}</p><h1 class="page-heading">${T.title}</h1><p class="page-intro">${T.intro}</p>
    <div class="card character-card"><div id="profileCharacter" class="character-portrait"></div><div class="character-identity"><h2 id="characterName"></h2><p id="characterRealm"></p><p class="character-aura-caption" id="characterAura"></p><button type="button" class="secondary-button" data-action="edit-character">${T.customize}</button><p id="characterDefault" class="footnote">${T.defaultHint}</p></div></div>
    <dl class="card character-stats">${[
      ["realm", T.realm],
      ["lifespan", T.lifespan],
      ["rate", T.rate],
      ["qi", T.qi],
      ["stones", T.stones],
      ["multiplier", T.multiplier],
      ["success", T.success],
      ["time", T.time],
    ]
      .map(
        ([id, label]) =>
          `<div><dt>${label}</dt><dd id="character-stat-${id}"></dd></div>`,
      )
      .join("")}</dl><p class="footnote">${T.timeHint}</p>
    <h2 class="character-section-title">${T.futureTitle}</h2><p class="footnote">${T.futureHint}</p><div class="character-locked">${T.locked.map((label) => `<div class="card"><span>${icon("lock")}</span><strong>${label}</strong><small>${T.lockedLabel}</small></div>`).join("")}</div>`;
  const overlay = document.createElement("div");
  overlay.id = "characterOverlay";
  overlay.className = "overlay";
  overlay.hidden = true;
  overlay.role = "dialog";
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-labelledby", "characterHeading");
  const choices = (
    name: string,
    title: string,
    values: ReadonlyArray<{ id: string; label: string; color?: string }>,
  ) =>
    `<fieldset class="character-choices"><legend>${title}</legend><div>${values.map((v) => `<label><input type="radio" name="${name}" value="${v.id}" required><span>${v.color ? `<i style="--robe-color:${v.color}" aria-hidden="true"></i>` : ""}${v.label}</span></label>`).join("")}</div></fieldset>`;
  overlay.innerHTML = `<div class="modal character-editor"><button type="button" class="close-modal" data-character-close aria-label="${T.close}">×</button><h2 id="characterHeading"></h2><p id="characterEditorIntro"></p><div id="editorCharacter" class="character-editor-preview"></div><form id="characterForm" novalidate>
    <label for="characterNameInput">${T.name}</label><input id="characterNameInput" name="name" type="text" autocomplete="off" required aria-describedby="characterNameHint characterError"><small id="characterNameHint">${T.nameHint}</small>
    ${choices("gender", T.gender, CHARACTER.genders)}${choices("hair", T.hair, CHARACTER.hairstyles)}${choices("robe", T.robe, CHARACTER.robes)}
    <p id="characterError" class="character-error" role="alert" hidden></p><div class="modal-actions"><button type="submit" class="primary-button" id="characterSubmit"></button><button type="button" class="little-button" data-character-close>${T.cancel}</button></div></form></div>`;
  document.body.append(overlay);
  const form = overlay.querySelector<HTMLFormElement>("form")!;
  const input = overlay.querySelector<HTMLInputElement>('[name="name"]')!;
  const error = $("characterError");
  function draft() {
    return Object.fromEntries(new FormData(form));
  }
  function preview() {
    // Tên chưa hợp lệ chỉ ảnh hưởng bản nháp; tuyệt đối không ghi save.
    const values = draft();
    let profile: CharacterProfile;
    try {
      profile = parseCharacter(values)!;
    } catch {
      profile = parseCharacter({
        ...values,
        name: CHARACTER.defaultProfile.name,
      })!;
    }
    draw(
      "editorCharacter",
      { ...getState(), character: profile },
      "practice",
      "editor",
    );
  }
  form.addEventListener("input", () => {
    error.hidden = true;
    input.removeAttribute("aria-invalid");
    preview();
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    try {
      const profile = parseCharacter(draft());
      if (!profile) throw Error(T.invalid);
      save(profile);
      closeDialog(overlay);
    } catch {
      error.textContent = T.invalid;
      error.hidden = false;
      input.setAttribute("aria-invalid", "true");
      input.focus();
    }
  });
  overlay
    .querySelectorAll<HTMLButtonElement>("[data-character-close]")
    .forEach((button) => {
      button.onclick = () => closeDialog(overlay);
    });
  function openEditor(first = false) {
    const p = getState().character ?? CHARACTER.defaultProfile;
    form.reset();
    input.value = p.name;
    input.removeAttribute("aria-invalid");
    error.hidden = true;
    for (const key of ["gender", "hair", "robe"] as const)
      form.querySelector<HTMLInputElement>(
        `[name="${key}"][value="${p[key]}"]`,
      )!.checked = true;
    $("characterHeading").textContent = first ? T.createTitle : T.editTitle;
    $("characterEditorIntro").textContent = first ? T.createIntro : T.editIntro;
    $("characterSubmit").textContent = first ? T.start : T.save;
    preview();
    openDialog(overlay);
  }
  let burstUntil = 0;
  let burstTimer: ReturnType<typeof setTimeout> | undefined;
  function render(activePage: string) {
    const state = getState(),
      view = characterView(state),
      progress = createProgression(() => state);
    const bursting = performance.now() < burstUntil;
    // Chỉ cập nhật vị trí đang hiện để hạn chế thay đổi DOM.
    if (activePage === "practice")
      draw(
        "heroCharacter",
        state,
        bursting ? "breakthrough" : "practice",
        "hero",
      );
    if (activePage === "travel")
      draw("travelCharacter", state, "travel", "travel");
    if (activePage === "alchemy")
      draw("alchemyCharacter", state, "alchemy", "alchemy");
    if (!$("stormOverlay").hidden)
      draw("stormCharacter", state, "breakthrough", "storm");
    if (activePage !== "character") return;
    draw("profileCharacter", state, "practice", "profile");
    const stage = STAGES[state.stage];
    const realm =
      stage.realmIndex === 0 ? TEXT.message007(stage.level) : stage.realm.name;
    $("characterName").textContent = view.profile.name;
    $("characterRealm").textContent = realm;
    $("characterAura").textContent =
      `${view.auraLabel} · ${Math.floor(view.ratio * 100)}%`;
    $("characterDefault").hidden = state.character !== null;
    const totalMinutes = Math.floor(view.elapsedSeconds / 60);
    const values: Record<string, string> = {
      realm,
      lifespan:
        stage.realm.lifespan === 99999
          ? TEXT.message063
          : TEXT.message064(money(stage.realm.lifespan)),
      rate: TEXT.message062(format(progress.rate())),
      qi: format(state.qi),
      stones: money(state.stones),
      multiplier: TEXT.message065(
        progress.powerMultiplier().toFixed(2).replace(".", ","),
      ),
      success: `${Math.round(progress.successChance() * 100)}%`,
      time: T.days(
        Math.floor(totalMinutes / 1440),
        Math.floor((totalMinutes % 1440) / 60),
        totalMinutes % 60,
      ),
    };
    for (const [key, value] of Object.entries(values))
      $("character-stat-" + key).textContent = value;
  }
  function breakthrough() {
    clearTimeout(burstTimer);
    burstUntil = performance.now() + CHARACTER.burstMs;
    draw("heroCharacter", getState(), "breakthrough", "hero");
    burstTimer = setTimeout(() => {
      burstUntil = 0;
      draw("heroCharacter", getState(), "practice", "hero");
    }, CHARACTER.burstMs);
  }
  return { openEditor, render, breakthrough };
}
function draw(
  hostId: string,
  state: GameState,
  activity: CharacterActivity,
  slot: CharacterSlot,
) {
  const host = $(hostId),
    view = characterView(state);
  const key = JSON.stringify([view.profile, view.realm, activity]);
  if (host.dataset.characterKey !== key) {
    host.innerHTML = renderCharacter(state, { activity, slot });
    host.dataset.characterKey = key;
  }
  // Giữ SVG giữa các tick để không khởi động lại nhịp thở và bước chân.
  host
    .querySelector<SVGElement>(".character-scene")
    ?.style.setProperty("--aura-opacity", view.auraOpacity.toFixed(3));
}
