import { CONFIG } from "../data/config";
import type { GameState } from "../state/types";
import { calculateQiGain, clamp } from "./math";
import { createProgression } from "./progression";

export function applyElapsed(state: GameState, now: number, offline = false) {
  const seconds = clamp(
    (now - state.lastSeenAt) / 1000,
    0,
    CONFIG.maxOfflineSeconds,
  );
  const gain = calculateQiGain(
    createProgression(() => state).baseRate(),
    state.buffUntil,
    seconds,
    now,
    CONFIG.maxOfflineSeconds,
  );
  state.qi += gain;
  state.stats.totalQi += gain;
  if (offline) state.stats.offlineSeconds += seconds;
  // Không hạ mốc nếu người dùng chỉnh đồng hồ lùi; tránh nhận lại cùng khoảng thời gian.
  state.lastSeenAt = Math.max(state.lastSeenAt, now);
  state.lastSeen = state.lastSeenAt;
  return { seconds, gain };
}
