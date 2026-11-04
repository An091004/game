import { CONFIG, STAGES } from "../data/config";
import { SAVE_TEXT } from "../data/save";
import { newState } from "../state/create";
import type { GameState } from "../state/types";
import { normalize } from "./normalize";

export class FutureSaveError extends Error {
  constructor() {
    super(SAVE_TEXT.future);
  }
}
function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw Error(SAVE_TEXT.invalid);
  return value as Record<string, unknown>;
}
function number(value: unknown): asserts value is number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0)
    throw Error(SAVE_TEXT.invalid);
}
function string(value: unknown): asserts value is string {
  if (typeof value !== "string") throw Error(SAVE_TEXT.invalid);
}
function list(value: unknown): unknown[] {
  if (!Array.isArray(value)) throw Error(SAVE_TEXT.invalid);
  return value;
}
/** Xác minh trước khi chuẩn hóa: không biến dữ liệu thiếu thành state mặc định. */
function validate(raw: Record<string, unknown>) {
  if (raw.version !== 1) throw Error(SAVE_TEXT.invalid);
  for (const key of [
    "createdAt",
    "lastSeen",
    "stage",
    "qi",
    "stones",
    "caveLevel",
    "buffUntil",
    "breakthroughBoost",
  ])
    number(raw[key]);
  if (
    !Number.isInteger(raw.stage) ||
    Number(raw.stage) >= STAGES.length ||
    Number(raw.caveLevel) < 1
  )
    throw Error(SAVE_TEXT.invalid);
  for (const [key, ids] of [
    ["manuals", CONFIG.manuals],
    ["herbs", CONFIG.seeds],
    ["inventory", CONFIG.recipes],
  ] as const) {
    const map = object(raw[key]);
    for (const item of ids) number(map[item.id]);
  }
  const stats = object(raw.stats);
  for (const key of Object.keys(newState().stats)) number(stats[key]);
  const settings = object(raw.settings);
  if (
    !["dark", "light"].includes(String(settings.theme)) ||
    ![0.9, 1, 1.1, 1.2].includes(Number(settings.fontScale))
  )
    throw Error(SAVE_TEXT.invalid);
  for (const entry of list(raw.journal)) {
    const row = object(entry);
    number(row.at);
    string(row.text);
  }
  for (const entry of list(raw.travelHistory)) {
    const row = object(entry);
    number(row.at);
    string(row.title);
    string(row.reward);
  }
  for (const entry of list(raw.plots)) {
    if (entry === null) continue;
    const row = object(entry);
    number(row.startedAt);
    number(row.endsAt);
    if (!CONFIG.seeds.some((s) => s.id === row.seed))
      throw Error(SAVE_TEXT.invalid);
  }
  if (raw.brewing !== null) {
    const row = object(raw.brewing);
    number(row.startedAt);
    number(row.endsAt);
    if (!CONFIG.recipes.some((r) => r.id === row.recipe))
      throw Error(SAVE_TEXT.invalid);
  }
  if (raw.lastEvent !== null) {
    const row = object(raw.lastEvent);
    string(row.title);
    string(row.reward);
    for (const line of list(row.lines)) string(line);
  }
  for (const value of Object.values(object(raw.achievements))) number(value);
}
export const migrations = [
  {
    from: 1,
    to: 2,
    migrate: (raw: Record<string, unknown>) => ({
      ...raw,
      saveVersion: 2,
      lastSeenAt: raw.lastSeen,
    }),
  },
];

export function migrateSave(input: unknown): GameState {
  let raw = object(input);
  const declaredVersion = raw.saveVersion ?? raw.version;
  if (typeof declaredVersion !== "number" || !Number.isInteger(declaredVersion))
    throw Error(SAVE_TEXT.invalid);
  let version: number = declaredVersion;
  if (version > 2) throw new FutureSaveError();
  validate(raw);
  while (version < 2) {
    const step = migrations.find((m) => m.from === version);
    if (!step) throw Error(SAVE_TEXT.invalid);
    raw = step.migrate(raw);
    version = step.to;
  }
  number(raw.lastSeenAt);
  const state = normalize(raw);
  state.saveVersion = 2;
  state.lastSeenAt = raw.lastSeenAt;
  state.lastSeen = raw.lastSeenAt;
  return state;
}
