import { BALANCE } from "../data/balance";
import { startAmbience } from "./ambience";
import { createProgression } from "../engine/progression";
import { createRenderer } from "./render";
import { $ } from "./dom";
import { format, money, esc, dur, clock } from "./format";
import { TEXT } from "../data/text";
import { CONFIG, STAGES, NAV } from "../data/config";
import { newState } from "../state/create";
import type { Manual } from "../state/types";
import { normalize } from "../save/normalize";
import { SaveManager } from "../save/manager";
import { createSaveStore, localStore } from "../save/ports";
import { serialize, deserialize } from "../save/codec";
import { migrateSave } from "../save/migrations";
import { applyElapsed } from "../engine/elapsed";
import { SAVE_TEXT } from "../data/save";
import { showSaveBlocked, showSaveWarning, showOffline } from "./save-notice";
import { bindLifecycle } from "./lifecycle";
import { num, clamp, plotCapacity, calculateQiGain } from "../engine/math";
export async function startGame() {
  const site = document.querySelector<HTMLElement>(".site")!;
  site.inert = true;
  const manager = new SaveManager(createSaveStore(), localStore, () =>
    showSaveWarning(SAVE_TEXT.writeFailed),
  );
  const loaded = await manager.load();
  if (loaded.status === "blocked") {
    showSaveBlocked(loaded.error);
    return;
  }

  const rand = (a: number, b: number) =>
    Math.floor(a + Math.random() * (b - a + 1));

  /* Chỉ nhận các trường dữ liệu hợp lệ, không đưa dữ liệu HTML lạ vào giao diện. */

  let ambient: {
    ctx: AudioContext;
    interval: ReturnType<typeof setInterval>;
  } | null = null;
  let pendingGrand: {
    next: number;
  } | null = null;
  let state = loaded.state ?? newState();
  let activePage = "practice",
    soundOn = false,
    holdValue = 0,
    holdStart = 0,
    holdFrame = 0;
  const progression = createProgression(() => state);
  const {
    currentCost,
    powerMultiplier,
    caveMultiplier,
    realmBonus,
    baseRate,
    boostedNow,
    rate,
    successChance,
    manualPrice,
    cavePrice,
  } = progression;
  const {
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
  } = createRenderer({
    ...progression,
    state: () => state,
    activePage: () => activePage,
    soundOn: () => soundOn,
    stageName,
    minorName,
  });
  if (!state.journal.length) record(TEXT.message004);
  function persist(silent = true) {
    manager.markDirty(state);
    if (!silent) return manager.flush();
    return Promise.resolve(!manager.blocked);
  }
  function record(text: string) {
    state.journal.unshift({
      at: Date.now(),
      text,
    });
    if (state.journal.length > 120) state.journal.length = 120;
  }
  function addQi(amount: number) {
    const v = Math.max(0, amount);
    state.qi += v;
    state.stats.totalQi += v;
    return v;
  }
  function addStones(amount: number) {
    state.stones += Math.max(0, Math.floor(amount));
  }
  function stageName(idx = state.stage) {
    const st = STAGES[idx];
    return st.realmIndex === 0 ? TEXT.message007(st.level) : st.realm.name;
  }
  function minorName(idx = state.stage) {
    return STAGES[idx].realmIndex === 0
      ? TEXT.message008(STAGES[idx].level)
      : STAGES[idx].realm.name;
  }
  function ensurePlots(s = state) {
    let n = plotCapacity(s.stage);
    while (s.plots.length < n) s.plots.push(null);
    if (s.plots.length > n) s.plots = s.plots.slice(0, n);
  }
  function awardAchievements() {
    let found: string[] = [];
    for (const a of CONFIG.achievements) {
      if (!state.achievements[a.id] && a.test(state)) {
        state.achievements[a.id] = Date.now();
        record(TEXT.message009(a.name));
        found.push(a.name);
      }
    }
    if (found.length === 1) toast(TEXT.message010(esc(found[0])));
    else if (found.length > 1) toast(TEXT.message011(found.length));
  }
  /* Tick chỉ nhận delta time thực, không phụ thuộc requestAnimationFrame. */
  function finishBrew() {
    if (!state.brewing) return;
    const recipe = CONFIG.recipes.find((r) => r.id === state.brewing!.recipe)!;
    state.brewing = null;
    if (!recipe) return;
    state.inventory[recipe.id]++;
    state.stats.elixirs++;
    record(TEXT.message012(recipe.name));
    toast(TEXT.message013(recipe.name));
  }
  function advanceRealtime(offline = false) {
    const result = applyElapsed(state, Date.now(), offline);
    if (state.brewing && state.brewing.endsAt <= Date.now()) finishBrew();
    if (offline && result.seconds >= 4) {
      record(TEXT.message014(dur(result.seconds), format(result.gain)));
      showOffline(format(result.gain));
    }
    return result;
  }
  function toast(html: string) {
    const box = document.createElement("div");
    box.className = "toast";
    box.innerHTML = html;
    $("toastArea").appendChild(box);
    while ($("toastArea").children.length > 4)
      $("toastArea").firstElementChild?.remove();
    setTimeout(() => {
      box.style.opacity = "0";
      box.style.transition = "opacity .4s";
      setTimeout(() => box.remove(), 450);
    }, 3900);
  }
  function doMeditate() {
    const v = Math.max(
      BALANCE.meditateMinimum,
      baseRate() * BALANCE.meditateSeconds,
    );
    addQi(v);
    state.stats.taps++;
    toast(TEXT.message016(format(v)));
    commit();
  }
  function commit() {
    awardAchievements();
    renderAll();
    persist();
  }
  function animateRise() {
    const f = $("flash");
    f.classList.remove("animate");
    void f.offsetWidth;
    f.classList.add("animate");
    setTimeout(() => f.classList.remove("animate"), 1100);
  }
  function doBreakthrough() {
    if (currentCost() === null) {
      toast(TEXT.message017);
      return;
    }
    const cost = currentCost();
    if (state.qi + 1e-9 < cost) {
      toast(TEXT.message018(format(cost - state.qi)));
      return;
    }
    const chance = successChance();
    if (state.breakthroughBoost > 0) state.breakthroughBoost--;
    if (Math.random() > chance) {
      const setback = Math.max(1, cost * BALANCE.failureCostFraction);
      state.qi = Math.max(0, state.qi - setback);
      state.stats.failures++;
      record(TEXT.message019(stageName(state.stage + 1), format(setback)));
      toast(TEXT.message020);
      commit();
      return;
    }
    const next = state.stage + 1;
    if (STAGES[next].realmIndex !== STAGES[state.stage].realmIndex) {
      pendingGrand = {
        next,
      };
      $("stormHeading").textContent = TEXT.message021(stageName(next));
      $("stormDesc").textContent = TEXT.message022;
      $("stormOverlay").hidden = false;
      holdValue = 0;
      $("holdButton").style.setProperty("--hold", "0%");
      $("holdLabel").textContent = TEXT.message023;
    } else finishBreakthrough(next, false);
  }
  function finishBreakthrough(next: number, grand: boolean) {
    if (next !== state.stage + 1 || state.qi < currentCost()) return;
    state.qi -= currentCost();
    state.stage = next;
    state.stats.breakthroughs++;
    let gift =
      BALANCE.breakthroughGift +
      Math.floor(next * BALANCE.breakthroughGiftPerStage);
    if (grand) {
      gift += BALANCE.grandGift + next * BALANCE.grandGiftPerStage;
      state.stats.calamities++;
    }
    addStones(gift);
    ensurePlots();
    record(TEXT.message024(stageName(), gift));
    if (grand) record(TEXT.message025(STAGES[next].realm.feature));
    animateRise();
    toast(TEXT.message026(stageName(), gift));
    if (grand) {
      $("stormOverlay").hidden = true;
      pendingGrand = null;
      stopHold();
    }
    commit();
  }
  function upgradeManual(id: string) {
    const m = CONFIG.manuals.find((x) => x.id === id);
    if (!m || state.stage < m.minStage || state.manuals[id] >= m.maxLevel)
      return;
    const cost = manualPrice(m);
    if (state.stones < cost) return toast(TEXT.message027);
    state.stones -= cost;
    state.manuals[id]++;
    record(TEXT.message028(m.name, state.manuals[id]));
    toast(TEXT.message029(esc(m.name), state.manuals[id]));
    commit();
  }
  function upgradeCave() {
    if (
      state.stage < CONFIG.unlocks.cave ||
      state.caveLevel >= BALANCE.caveMaxLevel
    )
      return;
    const cost = cavePrice();
    if (state.stones < cost) return toast(TEXT.message030);
    state.stones -= cost;
    state.caveLevel++;
    record(TEXT.message031(state.caveLevel));
    toast(TEXT.message032(state.caveLevel));
    commit();
  }
  function plant(seedId: string, plot: number) {
    const h = CONFIG.seeds.find((x) => x.id === seedId);
    if (
      !h ||
      state.stage < h.minStage ||
      !Number.isInteger(plot) ||
      plot < 0 ||
      plot >= state.plots.length ||
      state.plots[plot]
    )
      return;
    if (state.stones < h.cost) return toast(TEXT.message033);
    state.stones -= h.cost;
    const now = Date.now();
    state.plots[plot] = {
      seed: h.id,
      startedAt: now,
      endsAt: now + h.grow * 1000,
    };
    state.stats.planted++;
    record(TEXT.message034(h.name, plot + 1));
    toast(TEXT.message035(h.name));
    commit();
  }
  function harvest(plot: number) {
    if (!Number.isInteger(plot) || plot < 0 || plot >= state.plots.length)
      return;
    const p = state.plots[plot];
    if (!p || Date.now() < p.endsAt) return;
    const h = CONFIG.seeds.find((x) => x.id === p.seed);
    if (!h) return;
    let n = rand(h.minYield, h.maxYield);
    state.herbs[h.id] += n;
    state.plots[plot] = null;
    state.stats.harvested++;
    record(TEXT.message036(n, h.name, plot + 1));
    toast(TEXT.message037(n, h.name));
    commit();
  }
  function brew(id: string) {
    const r = CONFIG.recipes.find((x) => x.id === id);
    if (!r || state.stage < r.minStage || state.brewing) return;
    if (
      state.stones < r.stones ||
      Object.entries(r.herbs).some(([k, v]) => state.herbs[k] < v)
    )
      return toast(TEXT.message038);
    state.stones -= r.stones;
    for (const [k, v] of Object.entries(r.herbs)) state.herbs[k] -= v;
    let now = Date.now();
    state.brewing = {
      recipe: id,
      startedAt: now,
      endsAt: now + r.seconds * 1000,
    };
    record(TEXT.message039(r.name));
    toast(TEXT.message040(r.name));
    commit();
  }
  function usePotion(id: string) {
    if (!state.inventory[id]) return;
    const r = CONFIG.recipes.find((x) => x.id === id);
    if (!r) return;
    if (r.effect === "success" && state.breakthroughBoost > 0)
      return toast(TEXT.message041);
    state.inventory[id]--;
    state.stats.potionsUsed++;
    if (r.effect === "rate") {
      state.buffUntil =
        Math.max(Date.now(), state.buffUntil) +
        BALANCE.potionDurationSeconds * 1000;
      toast(TEXT.message042);
    } else if (r.effect === "success") {
      state.breakthroughBoost++;
      toast(TEXT.message043);
    } else {
      const gained = addQi(
        (currentCost() ?? BALANCE.ascendedPotionReference) *
          BALANCE.instantQiFraction,
      );
      toast(TEXT.message044(format(gained)));
    }
    record(TEXT.message045(r.name));
    commit();
  }
  function travel() {
    if (state.stage < CONFIG.unlocks.travel) return;
    const e = CONFIG.events[rand(0, CONFIG.events.length - 1)],
      stones =
        rand(BALANCE.travelStonesMin, BALANCE.travelStonesMax) +
        Math.floor(state.stage * BALANCE.travelStonesPerStage),
      qiBonus =
        baseRate() *
        rand(BALANCE.travelQiSecondsMin, BALANCE.travelQiSecondsMax);
    addStones(stones);
    addQi(qiBonus);
    let extra = "";
    if (Math.random() < BALANCE.travelHerbChance) {
      const possible = CONFIG.seeds.filter((h) => h.minStage <= state.stage),
        h = possible[rand(0, possible.length - 1)];
      state.herbs[h.id]++;
      extra = ` · 1 ${h.name}`;
    }
    const reward = TEXT.message046(stones, format(qiBonus), extra);
    state.lastEvent = {
      title: e.title,
      lines: e.lines,
      reward,
    };
    state.travelHistory.unshift({
      title: e.title,
      reward,
      at: Date.now(),
    });
    state.travelHistory = state.travelHistory.slice(0, 12);
    state.stats.travels++;
    if (state.stats.travels === 1 || state.stats.travels % 10 === 0)
      record(TEXT.message047(state.stats.travels, e.title));
    toast(TEXT.message048(esc(e.title)));
    commit();
  }
  function changePage(id: string) {
    const n = NAV.find((n) => n.id === id);
    if (!n) return;
    if (state.stage < n.unlock) {
      toast(TEXT.message049(stageName(n.unlock)));
      return;
    }
    activePage = id;
    document
      .querySelectorAll<HTMLElement>(".content-page")
      .forEach((e) => (e.hidden = e.id !== `page-${id}`));
    renderAll();
    const m = $("main");
    if (window.innerWidth < 851)
      m.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    else
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
  }
  /* =====================================================================
   RENDER: chỉ đọc state, không thực hiện logic tích lũy.
   ===================================================================== */

  /* =====================================================================
   SAO LƯU BASE64: UTF-8 -> byte, tránh lỗi chữ tiếng Việt.
   Import kiểm tra cấu trúc trước khi thay thế state hiện tại.
   ===================================================================== */
  function exportString() {
    advanceRealtime();
    const bytes = new TextEncoder().encode(serialize(state));
    let bin = "";
    for (let i = 0; i < bytes.length; i += 8192)
      bin += String.fromCharCode(...bytes.subarray(i, i + 8192));
    return btoa(bin);
  }
  function parseImport(input: string) {
    const b64 = input.replace(/\s/g, "");
    if (!b64 || b64.length > 1200000 || !/^[A-Za-z0-9+/]*={0,2}$/.test(b64))
      throw Error(TEXT.message121);
    const decoded = atob(b64),
      bytes = Uint8Array.from(decoded, (c) => c.charCodeAt(0));
    const loaded = JSON.parse(
      new TextDecoder("utf-8", {
        fatal: true,
      }).decode(bytes),
    );
    const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    return loaded?.format ? deserialize(text) : migrateSave(loaded);
  }
  function openBackup() {
    $("exportText").value = exportString();
    $("importText").value = "";
    $("backupOverlay").hidden = false;
    $("exportText").focus();
  }
  async function copyBackup() {
    const text = $("exportText").value;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        $("exportText").focus();
        $("exportText").select();
        if (!document.execCommand("copy")) throw Error("copy");
      }
      toast(TEXT.message122);
    } catch (e) {
      $("exportText").focus();
      $("exportText").select();
      toast(TEXT.message123);
    }
  }
  function downloadBackup() {
    const blob = new Blob([$("exportText").value], {
        type: "text/plain;charset=utf-8",
      }),
      u = URL.createObjectURL(blob),
      a = document.createElement("a");
    a.href = u;
    a.download = "nhan-van-tu-tien-save.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(u), 2000);
  }
  async function importSave() {
    try {
      const imported = parseImport($("importText").value);
      if (manager.blocked) throw Error(SAVE_TEXT.writeFailed);
      if (!window.confirm(SAVE_TEXT.confirmImport)) return;
      state = imported;
      activePage = "practice";
      $("backupOverlay").hidden = true;
      advanceRealtime(true);
      ensurePlots();
      awardAchievements();
      const saved = await persist(false);
      document
        .querySelectorAll<HTMLElement>(".content-page")
        .forEach((e) => (e.hidden = e.id !== "page-practice"));
      renderAll();
      toast(saved ? TEXT.message125 : SAVE_TEXT.writeFailed);
    } catch (e) {
      toast(TEXT.message126(esc(e instanceof Error ? e.message : String(e))));
    }
  }
  /* =====================================================================
   ÂM THANH: Web Audio tổng hợp tiếng gió và tiếng chuông êm.
   Mặc định tắt. Không tải nhạc bản quyền, không tự phát.
   ===================================================================== */
  function ringBell(ctx: AudioContext, destination: AudioNode) {
    const now = ctx.currentTime;
    [1, 2.01, 3.95].forEach((harmonic, i) => {
      const osc = ctx.createOscillator(),
        gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(440 * harmonic, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(
        [0.044, 0.018, 0.006][i],
        now + 0.05,
      );
      gain.gain.exponentialRampToValueAtTime(0.0001, now + [3.5, 2.3, 1.3][i]);
      osc.connect(gain).connect(destination);
      osc.start(now);
      osc.stop(now + 3.7);
    });
  }
  async function toggleSound() {
    if (soundOn) {
      stopSound();
      renderShell();
      toast(TEXT.message127);
      return;
    }
    try {
      const Audio =
        window.AudioContext ||
        (
          window as Window & {
            webkitAudioContext?: typeof AudioContext;
          }
        ).webkitAudioContext;
      if (!Audio) throw Error(TEXT.message128);
      const ctx = new Audio();
      await ctx.resume();
      const master = ctx.createGain();
      master.gain.value = 0.35;
      master.connect(ctx.destination);
      const len = ctx.sampleRate * 3,
        buffer = ctx.createBuffer(1, len, ctx.sampleRate),
        data = buffer.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * 0.17;
      const wind = ctx.createBufferSource(),
        filter = ctx.createBiquadFilter(),
        windGain = ctx.createGain();
      wind.buffer = buffer;
      wind.loop = true;
      filter.type = "lowpass";
      filter.frequency.value = 220;
      windGain.gain.value = 0.18;
      wind.connect(filter).connect(windGain).connect(master);
      wind.start();
      const lfo = ctx.createOscillator(),
        lfoGain = ctx.createGain();
      lfo.frequency.value = 0.07;
      lfoGain.gain.value = 0.065;
      lfo.connect(lfoGain).connect(windGain.gain);
      lfo.start();
      ringBell(ctx, master);
      const interval = setInterval(() => {
        if (soundOn && ctx.state === "running") ringBell(ctx, master);
      }, 17000);
      ambient = {
        ctx,
        interval,
      };
      soundOn = true;
      renderShell();
      toast(TEXT.message129);
    } catch (e) {
      soundOn = false;
      toast(TEXT.message130);
    }
  }
  function stopSound() {
    soundOn = false;
    if (ambient) {
      clearInterval(ambient.interval);
      ambient.ctx.close().catch(() => {});
      ambient = null;
    }
  }
  /* Thiên kiếp: giữ nút 1,35 giây, không giới hạn lượt thử. */
  function stopHold() {
    if (holdFrame) cancelAnimationFrame(holdFrame);
    holdFrame = 0;
    holdStart = 0;
  }
  function startHold(e: PointerEvent | KeyboardEvent) {
    if (!pendingGrand) return;
    e.preventDefault();
    if ("pointerId" in e) {
      try {
        $("holdButton").setPointerCapture(e.pointerId);
      } catch (_) {}
    }
    stopHold();
    holdStart = performance.now() - holdValue * 1350;
    const step = () => {
      if (!holdStart || !pendingGrand) return;
      holdValue = clamp((performance.now() - holdStart) / 1350, 0, 1);
      $("holdButton").style.setProperty("--hold", `${holdValue * 100}%`);
      $("holdLabel").textContent =
        holdValue >= 1 ? TEXT.message131 : TEXT.message132;
      if (holdValue >= 1) {
        stopHold();
        finishBreakthrough(pendingGrand!.next, true);
      } else holdFrame = requestAnimationFrame(step);
    };
    holdFrame = requestAnimationFrame(step);
  }
  function endHold() {
    if (!holdStart) return;
    stopHold();
    holdValue = 0;
    $("holdButton").style.setProperty("--hold", "0%");
    $("holdLabel").textContent = TEXT.message133;
  }
  $("holdButton").addEventListener("pointerdown", startHold);
  ["pointerup", "pointercancel", "lostpointercapture"].forEach((ev) =>
    $("holdButton").addEventListener(ev, endHold),
  );
  $("holdButton").addEventListener("keydown", (e) => {
    if ((e.key === " " || e.key === "Enter") && !holdStart) startHold(e);
  });
  $("holdButton").addEventListener("keyup", (e) => {
    if (e.key === " " || e.key === "Enter") endHold();
  });
  document.addEventListener("click", (e) => {
    const b =
      e.target instanceof Element
        ? e.target.closest<HTMLButtonElement>("[data-action]")
        : null;
    if (!b) return;
    const act = b.dataset.action;
    switch (act) {
      case "meditate":
        doMeditate();
        break;
      case "breakthrough":
        doBreakthrough();
        break;
      case "goto":
        changePage(b.dataset.id!);
        break;
      case "upgrade-manual":
        upgradeManual(b.dataset.id!);
        break;
      case "upgrade-cave":
        upgradeCave();
        break;
      case "plant":
        plant(b.dataset.seed!, Number(b.dataset.plot));
        break;
      case "harvest":
        harvest(Number(b.dataset.plot));
        break;
      case "brew":
        brew(b.dataset.id!);
        break;
      case "use-potion":
        usePotion(b.dataset.id!);
        break;
      case "travel":
        travel();
        break;
      case "open-backup":
        openBackup();
        break;
      case "close-backup":
        $("backupOverlay").hidden = true;
        break;
      case "copy-save":
        copyBackup();
        break;
      case "download-save":
        downloadBackup();
        break;
      case "import-save":
        importSave();
        break;
      case "close-storm":
        $("stormOverlay").hidden = true;
        pendingGrand = null;
        endHold();
        break;
      case "toggle-theme":
        state.settings.theme =
          state.settings.theme === "dark" ? "light" : "dark";
        renderAll();
        persist();
        break;
      case "toggle-sound":
        toggleSound();
        break;
      case "font-up": {
        const sizes = [0.9, 1, 1.1, 1.2],
          i = sizes.indexOf(state.settings.fontScale);
        state.settings.fontScale = sizes[Math.min(sizes.length - 1, i + 1)];
        renderAll();
        persist();
        break;
      }
      case "font-down": {
        const sizes = [0.9, 1, 1.1, 1.2],
          i = sizes.indexOf(state.settings.fontScale);
        state.settings.fontScale = sizes[Math.max(0, i - 1)];
        renderAll();
        persist();
        break;
      }
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!$("backupOverlay").hidden) $("backupOverlay").hidden = true;
      if (!$("stormOverlay").hidden) {
        $("stormOverlay").hidden = true;
        pendingGrand = null;
        endHold();
      }
    }
  });

  const pause = () => {
    advanceRealtime();
    manager.markDirty(state);
    void manager.flush();
    stopSound();
    endHold();
  };
  const resume = () => {
    advanceRealtime(true);
    awardAchievements();
    manager.markDirty(state);
    void manager.flush();
    renderAll();
  };
  site.inert = false;
  advanceRealtime(true);
  awardAchievements();
  manager.markDirty(state);
  await manager.flush();
  const activity = await bindLifecycle(pause, resume);
  if (loaded.status === "recovered" && !manager.blocked)
    showSaveWarning(SAVE_TEXT.recovered);
  if (loaded.status === "migrated") toast(SAVE_TEXT.migrated);
  setInterval(() => {
    if (!activity.active) return;
    advanceRealtime();
    awardAchievements();
    manager.markDirty(state);
    renderAll();
  }, 1000);
  startAmbience();
  renderAll();
}
