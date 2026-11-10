export interface Plot {
  seed: string;
  startedAt: number;
  endsAt: number;
}
export interface Brew {
  recipe: string;
  startedAt: number;
  endsAt: number;
}
export interface Travel {
  title: string;
  reward: string;
  at: number;
}
export interface GameState {
  version: 1;
  saveVersion: 2;
  lastSeenAt: number;
  createdAt: number;
  lastSeen: number;
  stage: number;
  qi: number;
  stones: number;
  caveLevel: number;
  manuals: Record<string, number>;
  herbs: Record<string, number>;
  inventory: Record<string, number>;
  plots: (Plot | null)[];
  brewing: Brew | null;
  buffUntil: number;
  breakthroughBoost: number;
  travelHistory: Travel[];
  lastEvent: { title: string; lines: string[]; reward: string } | null;
  journal: { at: number; text: string }[];
  achievements: Record<string, number>;
  stats: {
    taps: number;
    breakthroughs: number;
    failures: number;
    travels: number;
    totalQi: number;
    planted: number;
    harvested: number;
    elixirs: number;
    potionsUsed: number;
    calamities: number;
    offlineSeconds: number;
  };
  settings: {
    theme: "dark" | "light";
    fontScale: number;
    music: boolean;
    haptics: boolean;
    batterySaver: boolean;
  };
}
export interface Realm {
  name: string;
  levels: number;
  rate: number;
  lifespan: number;
  boon: string;
  feature: string;
}
export interface Stage {
  realmIndex: number;
  level: number;
  realm: Realm;
}
export interface Manual {
  id: string;
  name: string;
  grade: string;
  icon: string;
  minStage: number;
  boost: number;
  baseCost: number;
  costScale: number;
  maxLevel: number;
  desc: string;
}
export interface Seed {
  id: string;
  name: string;
  icon: string;
  minStage: number;
  cost: number;
  grow: number;
  minYield: number;
  maxYield: number;
  desc: string;
}
export interface Recipe {
  id: string;
  name: string;
  icon: string;
  minStage: number;
  seconds: number;
  stones: number;
  herbs: Record<string, number>;
  desc: string;
  effect: "rate" | "success" | "instant";
}
export interface GameConfig {
  saveKey: string;
  maxOfflineSeconds: number;
  realms: Realm[];
  costs: number[];
  unlocks: { manuals: number; travel: number; cave: number; alchemy: number };
  manuals: Manual[];
  seeds: Seed[];
  recipes: Recipe[];
  events: { title: string; lines: string[] }[];
  achievements: {
    id: string;
    icon: string;
    name: string;
    desc: string;
    test: (state: GameState) => boolean;
  }[];
}
