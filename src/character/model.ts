import { CHARACTER, CHARACTER_TEXT } from "../data/character";
import { STAGES } from "../data/config";
import { createProgression } from "../engine/progression";
import { clamp } from "../engine/math";
import type { GameState } from "../state/types";

export type CharacterActivity = keyof typeof CHARACTER_TEXT.activities;
export type CharacterSlot =
  "hero" | "profile" | "travel" | "alchemy" | "storm" | "editor";
/** Chỉ suy ra hình ảnh từ tiến trình; không ghi state hay thay công thức game. */
export function characterView(state: GameState) {
  const profile = state.character ?? CHARACTER.defaultProfile;
  const realm = STAGES[state.stage].realmIndex;
  const cost = createProgression(() => state).currentCost();
  const ratio = cost === null ? 1 : clamp(state.qi / cost, 0, 1);
  return {
    profile,
    realm,
    ratio,
    auraOpacity: 0.18 + ratio * 0.62,
    auraLabel: CHARACTER_TEXT.aura[realm],
    extraRings: Math.max(0, realm - 3),
    elapsedSeconds: Math.max(0, (state.lastSeenAt - state.createdAt) / 1000),
  };
}
