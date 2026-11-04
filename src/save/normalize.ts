import { BALANCE } from "../data/balance";
import { TEXT } from "../data/text";
import { CONFIG, STAGES } from "../data/config";
import { newState, resizePlots as ensurePlots } from "../state/create";
import type { GameState } from "../state/types";
import { num, clamp } from "../engine/math";
export function normalize(input: unknown): GameState {
  if (
    !input ||
    typeof input !== "object" ||
    Array.isArray(input) ||
    !("version" in input) ||
    input.version !== 1
  )
    throw Error(TEXT.message135);
  const raw = input as Partial<GameState>;
  const s = newState();
  s.createdAt = num(raw.createdAt, Date.now()) || Date.now();
  s.lastSeen = num(raw.lastSeen, Date.now()) || Date.now();
  s.lastSeenAt = num(raw.lastSeenAt, s.lastSeen);
  s.stage = Math.floor(clamp(num(raw.stage), 0, STAGES.length - 1));
  s.qi = clamp(num(raw.qi), 0, 1e15);
  s.stones = Math.floor(clamp(num(raw.stones), 0, 1e12));
  s.caveLevel = Math.floor(
    clamp(num(raw.caveLevel, 1), 1, BALANCE.caveMaxLevel),
  );
  for (const m of CONFIG.manuals)
    s.manuals[m.id] = Math.floor(
      clamp(num(raw.manuals?.[m.id]), 0, m.maxLevel),
    );
  for (const h of CONFIG.seeds)
    s.herbs[h.id] = Math.floor(clamp(num(raw.herbs?.[h.id]), 0, 1e8));
  for (const r of CONFIG.recipes)
    s.inventory[r.id] = Math.floor(clamp(num(raw.inventory?.[r.id]), 0, 1e7));
  s.plots = Array.isArray(raw.plots)
    ? raw.plots.slice(0, 4).map((p) =>
        p &&
        CONFIG.seeds.some((h) => h.id === p.seed) &&
        Number.isFinite(Number(p.endsAt))
          ? {
              seed: p.seed,
              startedAt: num(p.startedAt),
              endsAt: num(p.endsAt),
            }
          : null,
      )
    : [null];
  if (
    raw.brewing &&
    CONFIG.recipes.some((r) => r.id === raw.brewing!.recipe) &&
    Number.isFinite(Number(raw.brewing.endsAt))
  )
    s.brewing = {
      recipe: raw.brewing.recipe,
      startedAt: num(raw.brewing.startedAt),
      endsAt: num(raw.brewing.endsAt),
    };
  s.buffUntil = clamp(num(raw.buffUntil), 0, Date.now() + 10 * 365 * 864e5);
  s.breakthroughBoost = Math.floor(clamp(num(raw.breakthroughBoost), 0, 10));
  s.travelHistory = Array.isArray(raw.travelHistory)
    ? raw.travelHistory
        .slice(0, 16)
        .filter((v) => v && typeof v === "object")
        .map((v) => ({
          title: String(v.title || TEXT.message136).slice(0, 90),
          reward: String(v.reward || TEXT.message137).slice(0, 150),
          at: num(v.at),
        }))
    : [];
  if (raw.lastEvent && typeof raw.lastEvent === "object")
    s.lastEvent = {
      title: String(raw.lastEvent.title || TEXT.message138).slice(0, 90),
      lines: Array.isArray(raw.lastEvent.lines)
        ? raw.lastEvent.lines.slice(0, 3).map((x) => String(x).slice(0, 400))
        : [],
      reward: String(raw.lastEvent.reward || "").slice(0, 150),
    };
  s.journal = Array.isArray(raw.journal)
    ? raw.journal
        .slice(0, 140)
        .filter((x) => x && typeof x === "object")
        .map((x) => ({
          at: num(x.at),
          text: String(x.text || "").slice(0, 320),
        }))
    : [];
  if (raw.achievements && typeof raw.achievements === "object")
    for (const a of CONFIG.achievements)
      if (raw.achievements[a.id])
        s.achievements[a.id] = num(raw.achievements[a.id], Date.now());
  for (const k in s.stats)
    s.stats[k as keyof GameState["stats"]] = clamp(
      num(raw.stats?.[k as keyof GameState["stats"]]),
      0,
      1e15,
    );
  s.settings.theme = raw.settings?.theme === "light" ? "light" : "dark";
  s.settings.fontScale = [0.9, 1, 1.1, 1.2].includes(
    raw.settings?.fontScale ?? 1,
  )
    ? (raw.settings?.fontScale ?? 1)
    : 1;
  ensurePlots(s);
  return s;
}
