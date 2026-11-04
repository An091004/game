import { BALANCE } from "../data/balance";
import type { GameState } from "./types";
import { plotCapacity } from "../engine/math";
export function newState(): GameState {
  return {
    version: 1,
    createdAt: Date.now(),
    lastSeen: Date.now(),
    stage: 0,
    qi: 0,
    stones: BALANCE.startingStones,
    caveLevel: 1,
    manuals: { thanhPhong: 0, tuLinh: 0, vanTuong: 0, thaiHu: 0 },
    herbs: { thanhTam: 1, nguyetLo: 0, tuVan: 0 },
    inventory: { tuKhi: 0, anTam: 0, ngocLo: 0 },
    plots: [null],
    brewing: null,
    buffUntil: 0,
    breakthroughBoost: 0,
    travelHistory: [],
    lastEvent: null,
    journal: [],
    achievements: {},
    stats: {
      taps: 0,
      breakthroughs: 0,
      failures: 0,
      travels: 0,
      totalQi: 0,
      planted: 0,
      harvested: 0,
      elixirs: 0,
      potionsUsed: 0,
      calamities: 0,
      offlineSeconds: 0,
    },
    settings: { theme: "dark", fontScale: 1 },
  };
}
export function resizePlots(s: GameState) {
  const n = plotCapacity(s.stage);
  while (s.plots.length < n) s.plots.push(null);
  if (s.plots.length > n) s.plots = s.plots.slice(0, n);
}
