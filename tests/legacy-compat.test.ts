import { readFileSync } from "node:fs";
import vm from "node:vm";
import { describe, expect, it } from "vitest";
import { CONFIG, STAGES } from "../src/data/config";
import { newState } from "../src/state/create";
import type { GameState } from "../src/state/types";
import { createProgression } from "../src/engine/progression";
import { calculateQiGain, plotCapacity } from "../src/engine/math";
import { normalize } from "../src/save/normalize";

const source = readFileSync(
  new URL("../legacy/index.html", import.meta.url),
  "utf8",
).match(/<script>([\s\S]*?)<\/script>/)![1];
const fn = (name: string) =>
  source.match(new RegExp("^function " + name + "\\b[^\\n]*", "m"))![0];
const baselineCode = source.slice(
  source.indexOf("const CONFIG ="),
  source.indexOf("const $"),
);
function baseline(state: GameState) {
  const names = [
    "powerMultiplier",
    "caveMultiplier",
    "realmBonus",
    "baseRate",
    "boostedNow",
    "rate",
    "successChance",
    "currentCost",
    "manualPrice",
    "cavePrice",
  ];
  return vm.runInNewContext(
    baselineCode +
      "\n" +
      names.map(fn).join("\n") +
      "\n({CONFIG," +
      names.join(",") +
      "})",
    { state, Date },
  ) as ReturnType<typeof createProgression> & { CONFIG: typeof CONFIG };
}

describe("Tương thích bản HTML v1", () => {
  it("giữ toàn bộ cấu hình và nội dung, 36 sự kiện, 26 thành tựu", () => {
    expect(JSON.stringify(CONFIG)).toBe(
      JSON.stringify(baseline(newState()).CONFIG),
    );
    expect(CONFIG.events).toHaveLength(36);
    expect(CONFIG.achievements).toHaveLength(26);
  });
  it.each(STAGES.map((s, i) => [i, s.realm.name] as const))(
    "giữ công thức stage %i (%s)",
    (stage) => {
      const s = newState();
      Object.assign(s, {
        stage,
        caveLevel: 5,
        breakthroughBoost: 1,
        buffUntil: Date.now() + 600000,
      });
      s.manuals.thanhPhong = 3;
      const next = createProgression(() => s),
        old = baseline(s);
      for (const key of [
        "powerMultiplier",
        "caveMultiplier",
        "realmBonus",
        "baseRate",
        "rate",
        "successChance",
        "currentCost",
        "cavePrice",
      ] as const)
        if (old[key]() === null) expect(next[key]()).toBeNull();
        else expect(next[key]()).toBeCloseTo(old[key]()!, 10);
      for (const m of CONFIG.manuals)
        expect(next.manualPrice(m)).toBe(old.manualPrice(m));
    },
  );
  it("đọc lại save v1 không mất cảnh giới, nội dung tiếng Việt và tài nguyên", () => {
    const s = newState();
    s.stage = 4;
    s.qi = 1234.5;
    s.stones = 88;
    s.journal = [{ at: Date.now(), text: "Mây đến bên hiên 雲" }];
    expect(normalize(JSON.parse(JSON.stringify(s)))).toEqual(s);
  });
  it("giới hạn linh điền đúng mốc cũ", () =>
    expect([0, 9, 13, 15].map(plotCapacity)).toEqual([1, 2, 3, 4]));
});
describe("Tích lũy theo delta time", () => {
  it("không cộng khi đồng hồ lùi", () =>
    expect(calculateQiGain(1.45, 0, -5, 10000, 28800)).toBe(0));
  it("chặn giới hạn 8 giờ", () =>
    expect(calculateQiGain(1.45, 0, 43200, 100000000, 28800)).toBe(41760));
  it("chỉ cộng buff trong khoảng buff còn hiệu lực", () =>
    expect(calculateQiGain(10, 105000, 10, 110000, 28800)).toBe(132.5));
  it("chia tick không đổi tổng linh khí", () =>
    expect(
      calculateQiGain(10, 0, 2, 100000, 28800) +
        calculateQiGain(10, 0, 3, 103000, 28800),
    ).toBe(calculateQiGain(10, 0, 5, 103000, 28800)));
});
