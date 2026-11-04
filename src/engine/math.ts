import { BALANCE } from "../data/balance";
export const num = (n: unknown, fallback = 0) =>
  Number.isFinite(Number(n)) ? Math.max(0, Number(n)) : fallback;
export const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));
export function plotCapacity(idx: number) {
  return 1 + BALANCE.plotUnlocks.filter((stage) => idx >= stage).length;
}
export function calculateQiGain(
  base: number,
  buffUntil: number,
  dt: number,
  now: number,
  maxSeconds: number,
) {
  const seconds = clamp(dt, 0, maxSeconds);
  if (seconds <= 0) return 0;
  const old = now - seconds * 1000;
  const boostedSeconds = Math.max(0, Math.min(now, buffUntil) - old) / 1000;
  return base * seconds + base * BALANCE.potionRateBonus * boostedSeconds;
}
