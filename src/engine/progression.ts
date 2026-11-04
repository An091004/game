import { BALANCE } from "../data/balance";
import { CONFIG, STAGES } from "../data/config";
import type { GameState, Manual } from "../state/types";
export function createProgression(getState: () => GameState) {
  function currentCost() {
    return CONFIG.costs[getState().stage] ?? null;
  }
  function powerMultiplier() {
    let result = 1;
    for (const m of CONFIG.manuals)
      result += getState().manuals[m.id] * m.boost;
    return result;
  }
  function caveMultiplier() {
    return 1 + (getState().caveLevel - 1) * BALANCE.caveBonus;
  }
  function realmBonus() {
    return BALANCE.realmBonuses.reduce(
      (value, bonus) =>
        value * (getState().stage >= bonus.stage ? bonus.multiplier : 1),
      1,
    );
  }
  function baseRate() {
    const s = STAGES[getState().stage];
    return (
      BALANCE.baseQiPerSecond *
      s.realm.rate *
      (1 + (s.level - 1) * BALANCE.minorLevelBonus) *
      powerMultiplier() *
      caveMultiplier() *
      realmBonus()
    );
  }
  function boostedNow() {
    return getState().buffUntil > Date.now();
  }
  function rate() {
    return baseRate() * (boostedNow() ? 1 + BALANCE.potionRateBonus : 1);
  }
  function successChance() {
    return Math.min(
      1,
      BALANCE.baseSuccess +
        (getState().breakthroughBoost > 0 ? BALANCE.potionSuccessBonus : 0) +
        (getState().stage >= BALANCE.realmBonuses[2].stage
          ? BALANCE.lateSuccessBonus
          : 0),
    );
  }
  function manualPrice(m: Manual) {
    return Math.floor(
      m.baseCost * Math.pow(m.costScale, getState().manuals[m.id]),
    );
  }
  function cavePrice() {
    return Math.floor(
      BALANCE.caveBaseCost *
        Math.pow(BALANCE.caveCostScale, getState().caveLevel - 1),
    );
  }
  return {
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
  };
}
