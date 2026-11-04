import { BALANCE } from "../data/balance";
import { TEXT } from "../data/text";
import { CONFIG, STAGES, NAV } from "../data/config";
import type { GameState } from "../state/types";
import type { createProgression } from "../engine/progression";
import { clamp } from "../engine/math";
import { $ } from "./dom";
import { format, money, esc, dur, clock } from "./format";
type Dependencies = ReturnType<typeof createProgression> & {
  state: () => GameState;
  activePage: () => string;
  soundOn: () => boolean;
  stageName: (idx?: number) => string;
  minorName: (idx?: number) => string;
};
export function createRenderer(deps: Dependencies) {
  /* =====================================================================
   RENDER: chỉ đọc state, không thực hiện logic tích lũy.
   ===================================================================== */
  function renderNav() {
    const state = deps.state();
    $("navigation").innerHTML = NAV.map(
      (n) =>
        `<button type="button" class="nav-item ${deps.activePage() === n.id ? "active" : ""} ${state.stage < n.unlock ? "locked" : ""}" data-action="goto" data-id="${n.id}" ${deps.activePage() === n.id ? 'aria-current="page"' : ""}><span class="nav-icon">${n.icon}</span>${n.label}${state.stage < n.unlock ? '<span class="lock-mark">♙</span>' : ""}</button>`,
    ).join("");
  }
  function renderShell() {
    const state = deps.state();
    document.documentElement.dataset.theme = state.settings.theme;
    document.documentElement.style.setProperty(
      "--font-scale",
      String(state.settings.fontScale),
    );
    $("topStones").textContent = money(state.stones);
    $("sideQi").textContent = format(state.qi);
    $("sideStones").textContent = money(state.stones);
    $("sideCave").textContent = TEXT.message050(state.caveLevel);
    $("sideRealm").textContent = deps.minorName();
    $("sideBlessing").textContent = STAGES[state.stage].realm.boon;
    $("soundToggle").textContent = deps.soundOn() ? "♫" : "♪";
    $("soundToggle").title = deps.soundOn() ? TEXT.message051 : TEXT.message052;
    let effects = [];
    if (state.buffUntil > Date.now())
      effects.push(TEXT.message053(dur((state.buffUntil - Date.now()) / 1000)));
    if (state.breakthroughBoost > 0) effects.push(TEXT.message054());
    $("buffStatus").innerHTML = effects.length
      ? effects.join("<br>")
      : TEXT.message055;
    $("journalPeek").innerHTML =
      deps
        .state()
        .journal.slice(0, 4)
        .map((j) => `<li>${esc(j.text)}<small>${clock(j.at)}</small></li>`)
        .join("") || TEXT.message056;
  }
  function renderPractice() {
    const state = deps.state();
    const cost = deps.currentCost(),
      pct = cost === null ? 100 : clamp((state.qi / cost) * 100, 0, 100);
    $("currentRealm").textContent = deps.stageName();
    $("realmBlessing").textContent = STAGES[state.stage].realm.feature;
    $("qiValue").textContent = format(state.qi);
    $("qiTarget").textContent =
      cost === null ? TEXT.message057 : TEXT.message058(money(cost));
    $("qiFill").style.width = pct + "%";
    $("qiProgress").setAttribute("aria-valuenow", String(Math.round(pct)));
    $("progressPercent").textContent = `${Math.floor(pct)}%`;
    $("progressInfo").textContent =
      cost === null
        ? TEXT.message059
        : pct >= 100
          ? TEXT.message060
          : TEXT.message061;
    $("qiRate").textContent = TEXT.message062(format(deps.rate()));
    $("lifespan").textContent =
      STAGES[state.stage].realm.lifespan === 99999
        ? TEXT.message063
        : TEXT.message064(money(STAGES[state.stage].realm.lifespan));
    $("bonusMultiplier").textContent = TEXT.message065(
      deps.powerMultiplier().toFixed(2).replace(".", ","),
    );
    $("successRate").textContent = TEXT.message066(
      Math.round(deps.successChance() * 100),
    );
    $("breakthroughButton").disabled = cost === null || state.qi < cost;
    $("breakthroughButton").textContent =
      cost === null ? TEXT.message067 : TEXT.message068;
    $("qiHint").innerHTML =
      cost === null
        ? TEXT.message069
        : state.qi >= cost
          ? TEXT.message070
          : TEXT.message071(
              format(
                Math.max(
                  BALANCE.meditateMinimum,
                  deps.baseRate() * BALANCE.meditateSeconds,
                ),
              ),
            );
    const before = Math.max(0, state.stage - 2),
      after = Math.min(STAGES.length - 1, state.stage + 2);
    $("pathList").innerHTML = Array.from(
      {
        length: after - before + 1,
      },
      (_, i) => {
        const st = before + i;
        return `<span class="path-pill ${st === state.stage ? "current" : st < state.stage ? "passed" : ""}">${st === state.stage ? "✦ " : ""}${esc(deps.stageName(st))}</span>`;
      },
    ).join('<span style="color:var(--muted)">···</span>');
    $("recentTitle").textContent = state.lastEvent
      ? state.lastEvent.title
      : TEXT.message072;
    $("recentText").textContent = state.lastEvent
      ? state.lastEvent.lines[0]
      : TEXT.message073;
    const quotes = [
      [TEXT.message074, TEXT.message075],
      [TEXT.message076, TEXT.message077],
      [TEXT.message078, TEXT.message079],
      [TEXT.message080, TEXT.message081],
      [TEXT.message082, TEXT.message083],
    ];
    const q = quotes[Math.floor(Date.now() / 86400000) % quotes.length];
    $("dailyTitle").textContent = q[0];
    $("dailyText").textContent = q[1];
  }
  function renderManuals() {
    const state = deps.state();
    $("manualSummary").innerHTML = TEXT.message084(
      deps.powerMultiplier().toFixed(2).replace(".", ","),
      Object.values(state.manuals).reduce((a, b) => a + b, 0),
      money(state.stones),
    );
    $("manualCards").innerHTML = CONFIG.manuals
      .map((m) => {
        const locked = state.stage < m.minStage,
          lv = state.manuals[m.id],
          max = lv >= m.maxLevel,
          cost = deps.manualPrice(m);
        return TEXT.message090(
          locked ? "locked-card" : "",
          m.icon,
          m.name,
          m.grade,
          m.desc,
          Math.round(m.boost * 100),
          lv,
          m.maxLevel,
          locked
            ? TEXT.message085(esc(deps.stageName(m.minStage)))
            : `<div class="item-bottom"><span class="item-meta">${max ? TEXT.message086 : TEXT.message087(money(cost))}</span><button type="button" class="little-button" data-action="upgrade-manual" data-id="${m.id}" ${max || state.stones < cost ? "disabled" : ""}>${max ? TEXT.message088 : TEXT.message089}</button></div>`,
        );
      })
      .join("");
  }
  function renderCave() {
    const state = deps.state();
    $("caveTitle").textContent = TEXT.message091(state.caveLevel);
    $("caveStats").innerHTML = TEXT.message092(
      deps.caveMultiplier().toFixed(2).replace(".", ","),
      state.plots.length,
    );
    const cost = deps.cavePrice();
    $("caveUpgrade").disabled =
      state.stones < cost || state.caveLevel >= BALANCE.caveMaxLevel;
    $("caveUpgrade").textContent =
      state.caveLevel >= BALANCE.caveMaxLevel
        ? TEXT.message093
        : TEXT.message094(money(cost));
    $("plotCards").innerHTML = deps
      .state()
      .plots.map((p, i) => {
        if (!p)
          return TEXT.message095(
            i + 1,
            CONFIG.seeds
              .filter((h) => state.stage >= h.minStage)
              .map(
                (h) =>
                  `<button type="button" class="little-button" data-action="plant" data-seed="${h.id}" data-plot="${i}" title="${h.desc}" ${state.stones < h.cost ? "disabled" : ""}>${h.icon} ${h.name} · ◇${h.cost}</button>`,
              )
              .join(""),
          );
        const h = CONFIG.seeds.find((x) => x.id === p.seed)!,
          remaining = Math.max(0, (p.endsAt - Date.now()) / 1000),
          ready = remaining === 0,
          pct = clamp(
            ((Date.now() - p.startedAt) / (p.endsAt - p.startedAt)) * 100,
            0,
            100,
          );
        return TEXT.message100(
          h.icon,
          i + 1,
          h.name,
          h.desc,
          h.icon,
          pct,
          ready ? TEXT.message096 : TEXT.message097(dur(remaining)),
          ready ? "primary-button" : "little-button",
          i,
          ready ? "" : "disabled",
          ready ? TEXT.message098 : TEXT.message099,
        );
      })
      .join("");
    $("herbInventory").innerHTML = TEXT.message101(
      CONFIG.seeds
        .map(
          (h) =>
            `<span class="inventory-token">${h.icon} ${h.name}: <b>${money(state.herbs[h.id])}</b></span>`,
        )
        .join(""),
    );
  }
  function renderAlchemy() {
    const state = deps.state();
    if (state.brewing) {
      const r = CONFIG.recipes.find((r) => r.id === state.brewing!.recipe)!;
      let remain = Math.max(0, (state.brewing.endsAt - Date.now()) / 1000),
        pct = clamp(
          ((Date.now() - state.brewing.startedAt) /
            (state.brewing.endsAt - state.brewing.startedAt)) *
            100,
          0,
          100,
        );
      $("brewStatus").innerHTML = TEXT.message102(r.name, dur(remain), pct);
    } else $("brewStatus").innerHTML = TEXT.message103;
    $("recipeCards").innerHTML = CONFIG.recipes
      .map((r) => {
        const locked = state.stage < r.minStage,
          materials = Object.entries(r.herbs)
            .map(([k, v]) =>
              TEXT.message104(CONFIG.seeds.find((h) => h.id === k)!.name, v),
            )
            .join(" · "),
          enough =
            state.stones >= r.stones &&
            Object.entries(r.herbs).every(([k, v]) => state.herbs[k] >= v);
        return TEXT.message110(
          locked ? "locked-card" : "",
          r.icon,
          r.name,
          r.desc,
          dur(r.seconds),
          r.stones,
          materials,
          locked
            ? TEXT.message105(esc(deps.stageName(r.minStage)))
            : TEXT.message109(
                state.brewing
                  ? TEXT.message106
                  : enough
                    ? TEXT.message107
                    : TEXT.message108,
                r.id,
                state.brewing || !enough ? "disabled" : "",
              ),
        );
      })
      .join("");
    $("potionCards").innerHTML = CONFIG.recipes
      .map((r) =>
        TEXT.message113(
          r.icon,
          r.name,
          money(state.inventory[r.id]),
          r.desc,
          state.inventory[r.id] ? TEXT.message111 : TEXT.message112,
          r.id,
          state.inventory[r.id] ? "" : "disabled",
        ),
      )
      .join("");
  }
  function renderTravel() {
    const state = deps.state();
    const e = state.lastEvent;
    $("adventureStory").innerHTML = e
      ? TEXT.message114(
          esc(e.title),
          e.lines.map((l) => `<p>${esc(l)}</p>`).join(""),
          esc(e.reward),
        )
      : TEXT.message115;
    $("travelCount").textContent = TEXT.message116(money(state.stats.travels));
    $("travelHistory").innerHTML = state.travelHistory.length
      ? deps
          .state()
          .travelHistory.slice(0, 8)
          .map(
            (v) =>
              `<div class="trail">${esc(v.title)}<small>${clock(v.at)} · ${esc(v.reward)}</small></div>`,
          )
          .join("")
      : TEXT.message117;
  }
  function renderJournal() {
    const state = deps.state();
    $("journalCount").textContent = TEXT.message118(state.journal.length);
    $("journalList").innerHTML =
      deps
        .state()
        .journal.map(
          (j) => `<li><time>${clock(j.at)}</time><p>${esc(j.text)}</p></li>`,
        )
        .join("") || TEXT.message119;
  }
  function renderAchievements() {
    const state = deps.state();
    const earned = CONFIG.achievements.filter(
      (a) => state.achievements[a.id],
    ).length;
    $("achievementCount").textContent =
      `${earned}/${CONFIG.achievements.length}`;
    $("achievementFill").style.width =
      `${(earned / CONFIG.achievements.length) * 100}%`;
    $("achievementCards").innerHTML = CONFIG.achievements
      .map(
        (a) =>
          `<div class="card ach-card ${state.achievements[a.id] ? "earned" : ""}"><span class="ach-icon">${a.icon}</span><div><h3 class="ach-title">${a.name}</h3><p>${a.desc}</p>${state.achievements[a.id] ? `<time>✧ ${clock(state.achievements[a.id])}</time>` : TEXT.message120}</div></div>`,
      )
      .join("");
  }
  function renderAll() {
    const state = deps.state();
    renderNav();
    renderShell();
    renderPractice();
    if (deps.activePage() === "manuals") renderManuals();
    if (deps.activePage() === "cave") renderCave();
    if (deps.activePage() === "alchemy") renderAlchemy();
    if (deps.activePage() === "travel") renderTravel();
    if (deps.activePage() === "journal") renderJournal();
    if (deps.activePage() === "achievements") renderAchievements();
  }
  /* =====================================================================
   SAO LƯU BASE64: UTF-8 -> byte, tránh lỗi chữ tiếng Việt.
   Import kiểm tra cấu trúc trước khi thay thế state hiện tại.
   ===================================================================== */
  return {
    renderNav,
    renderShell,
    renderPractice,
    renderManuals,
    renderCave,
    renderAlchemy,
    renderTravel,
    renderJournal,
    renderAchievements,
    renderAll,
  };
}
