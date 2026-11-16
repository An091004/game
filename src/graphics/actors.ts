import { CHARACTER } from "../data/character";
import type { CharacterProfile } from "../state/types";

export type ActorKind = "hero" | "swordswoman" | "fox" | "elder" | "sentinel";

interface Palette {
  light: string;
  robe: string;
  dark: string;
  lining: string;
  metal: string;
  hair: string;
}

const palettes: Record<Exclude<ActorKind, "hero">, Palette> = {
  swordswoman: {
    light: "#f3f7e8",
    robe: "#bee4df",
    dark: "#477d8c",
    lining: "#263f64",
    metal: "#c7d9c7",
    hair: "#112c45",
  },
  fox: {
    light: "#ffd0b0",
    robe: "#e8788b",
    dark: "#8c3b69",
    lining: "#473252",
    metal: "#f8ce88",
    hair: "#633545",
  },
  elder: {
    light: "#ddc59c",
    robe: "#818b64",
    dark: "#3d5f57",
    lining: "#605344",
    metal: "#dfbb7c",
    hair: "#e5dfc8",
  },
  sentinel: {
    light: "#a36c79",
    robe: "#403f61",
    dark: "#1a263e",
    lining: "#9e3c55",
    metal: "#bdbace",
    hair: "#172239",
  },
};

/** SVG inner markup, 240 × 340 coordinates. The caller supplies a unique SVG-safe prefix. */
export function renderActor(
  kind: ActorKind,
  prefix: string,
  profile: CharacterProfile = CHARACTER.defaultProfile,
): string {
  if (!/^[A-Za-z][A-Za-z0-9_-]*$/.test(prefix)) {
    throw new Error("Actor prefix must be a unique SVG-safe identifier");
  }
  const selectedRobe =
    CHARACTER.robes.find((robe) => robe.id === profile.robe) ??
    CHARACTER.robes[0];
  const p: Palette =
    kind === "hero"
      ? {
          light: "#e9d9ad",
          robe: selectedRobe.color,
          dark: selectedRobe.shade,
          lining: "#183d49",
          metal: "#eac88b",
          hair: "#17333f",
        }
      : palettes[kind];
  const feminine =
    kind === "fox" ||
    kind === "swordswoman" ||
    (kind === "hero" && profile.gender === "female");
  const shoulder = feminine ? 26 : kind === "elder" ? 33 : 31;
  const hair =
    kind === "hero" ? profile.hair : kind === "sentinel" ? "short" : "long";
  const id = prefix;
  const gradient = (suffix: string) => `url(#${id}-${suffix})`;
  const defs = `<defs>
    <linearGradient id="${id}-robe" x1="0" y1="0" x2=".9" y2="1"><stop stop-color="${p.light}"/><stop offset=".28" stop-color="${p.robe}"/><stop offset="1" stop-color="${p.dark}"/></linearGradient>
    <linearGradient id="${id}-lining" x1="0" y1="0" x2="1" y2=".6"><stop stop-color="${p.lining}"/><stop offset=".5" stop-color="${p.dark}"/><stop offset="1" stop-color="${p.lining}"/></linearGradient>
    <linearGradient id="${id}-skin" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="#fae1c0"/><stop offset=".6" stop-color="#eac3a6"/><stop offset="1" stop-color="#c28f7e"/></linearGradient>
    <linearGradient id="${id}-hair" x1="0" y1="0" x2="1" y2=".3"><stop stop-color="${p.hair}"/><stop offset=".48" stop-color="${kind === "elder" ? "#f5edd7" : "#3e4b61"}"/><stop offset="1" stop-color="${p.hair}"/></linearGradient>
    <linearGradient id="${id}-steel" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#647f9d"/><stop offset=".48" stop-color="#e3f8eb"/><stop offset=".54" stop-color="#8bb7c4"/><stop offset="1" stop-color="#455c7e"/></linearGradient>
    <linearGradient id="${id}-tail" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff1d2"/><stop offset=".38" stop-color="#efb4a5"/><stop offset="1" stop-color="#ae507e"/></linearGradient>
    <radialGradient id="${id}-light"><stop stop-color="${p.metal}" stop-opacity=".32"/><stop offset="1" stop-color="${p.metal}" stop-opacity="0"/></radialGradient>
  </defs>`;

  const backAccessory =
    kind === "fox"
      ? `<g class="nv-actor-ribbon" fill="${gradient("tail")}" stroke="#f1bdab" stroke-width=".8">
        <path d="M112 261C63 283 14 257 31 196c8 27 27 25 24-5-3-30 7-55 27-67-7 32 8 48 15 75 7 24 3 45 15 62Z"/>
        <path d="M134 273c51 1 89-38 72-84-2 29-28 43-23 10 5-35-10-60-29-70 16 39-5 52-9 88-2 22 1 38-11 56Z"/>
        <path d="M99 279C54 316 19 295 22 256c7 14 21 20 29 9 8-11 20-20 33-13Z"/>
        <path d="M148 276c37 38 76 18 68-12-10 15-23 7-33-5-14-17-21-16-35 17Z"/>
        <path d="M55 205q-5 31 21 52M176 213q9 28-14 48" fill="none" opacity=".55"/>
      </g>`
      : kind === "swordswoman" || kind === "hero"
        ? `<g transform="rotate(13 70 195)">
          <path d="M64 123h12l-1 172-6 16-6-16Z" fill="${p.lining}" stroke="${p.metal}" stroke-width="1.1"/>
          <path d="M68 131v157" stroke="#8bb7c4" stroke-width="2" opacity=".65"/>
          <path d="M66 83h8v34h-8Z" fill="#39334a"/><path d="M66 88h8m-8 8h8m-8 8h8m-8 8h8" stroke="${p.metal}"/>
          <path d="m57 119 13-6 14 6-3 6H60Z" fill="${p.metal}"/>
          <circle cx="70" cy="82" r="5" fill="${p.metal}"/>
          <path class="nv-actor-ribbon" d="M73 82q-15-10-14 9t-9 22m20-30q18 3 11 21t2 19" fill="none" stroke="${kind === "swordswoman" ? "#8bdcd7" : "#dca36d"}" stroke-width="2"/>
        </g>`
        : kind === "sentinel"
          ? `<g><path d="M200 46v272" stroke="#5d637b" stroke-width="6"/><path d="M199 49v266" stroke="#c2a29d" stroke-width="1"/>
            <path d="m200 7-12 32 12 22 12-22Z" fill="${gradient("steel")}"/><path d="M200 11v39" stroke="#e8ece3"/>
            <path class="nv-actor-ribbon" d="M197 55c-23-8-21 22-43 21 16 7 28-6 35-2-4 8-14 18-25 19 16 7 33-8 33-21Z" fill="#c14b66"/>
            <path d="M194 58h12m-12 5h12m-12 5h12" stroke="#d5b48b"/>
          </g>`
          : `<g><path d="M46 315 49 111q-12-19 1-40 20-11 21 7-4 12-14 6" fill="none" stroke="#4b3a36" stroke-width="7" stroke-linecap="round"/>
            <path d="M46 314 49 111q-12-19 1-40" fill="none" stroke="#b49765" stroke-width="1.7"/>
            <path d="M47 129h9m-9 6h9m-9 6h9" stroke="#d4b477" stroke-width="2"/>
            <path d="M63 87v31" stroke="#ab7854"/><path d="M57 111h13v21H57Z" fill="#ce8d5c" stroke="#edc08b"/><path d="m62 115 5 5-6 7" fill="none" stroke="#693c40"/>
          </g>`;

  const backHair =
    hair === "long"
      ? `<path d="M99 56C83 96 89 146 75 216c19-15 22-45 29-60 3 38 12 64 23 91 3-41 12-72 16-93 3 27 8 50 27 64-15-57-8-116-26-160Z" fill="${gradient("hair")}"/>
       <path d="M98 95q-9 67-14 96m60-93q6 56 15 96m-46-41 8 71" fill="none" stroke="${kind === "elder" ? "#aaa48e" : "#72808b"}" stroke-width=".8" opacity=".6"/>`
      : hair === "knot"
        ? `<path d="M101 57q-13 30-8 51l16-13 28 6q15-24-2-44Z" fill="${gradient("hair")}"/>
         <path class="nv-actor-ribbon" d="M130 40q30 27 22 76t22 42M130 42q15 48 37 64" fill="none" stroke="${p.metal}" stroke-width="2"/>`
        : `<path d="M99 57 92 79l3 23 11-14 29 6 11 9 5-25-15-24Z" fill="${gradient("hair")}"/>`;

  const silhouette = `<g stroke-linejoin="round">
    <path d="M93 283 89 311q-10 0-13 6 13 7 35 1l7-32m16-1 1 25q17 0 23 8-10 6-31 0l-10-30" fill="#172d3a" stroke="#baad91" stroke-width="1.1"/>
    <path d="M102 154C95 190 82 244 62 299q24 16 59 8 34 14 62-8-23-53-42-145Z" fill="${gradient("lining")}" stroke="${p.dark}" stroke-width="1.1"/>
    <path d="m118 165-10 135 15 9 12-140Z" fill="${p.light}" opacity=".65"/>
    <path d="M98 95Q${120 - shoulder} 95 76 122L49 181l31 18 22-44-8 52-22 87q25 8 43 0l10-105 20 106q17 6 34-4l-23-93-15-40 25 35 28-22-25-48q-10-19-${shoulder}-28l-13 8Z" fill="${gradient("robe")}" stroke="${p.dark}" stroke-width="1.2"/>
    <path d="m102 98 18 49 18-49-13 8-5 29-7-29Z" fill="${p.light}"/>
    <path d="M101 97 122 151 142 97m-22 57-17 133m37-110 22 108" fill="none" stroke="${p.metal}" stroke-width="1.8"/>
    <path d="m80 128-16 48 14 8m82-58 18 39-14 13M94 194l-12 86m57-100 11 95" fill="none" stroke="${p.light}" stroke-opacity=".35" stroke-width="1.4"/>
    <path d="M97 148q22 7 46-1l4 13q-26 9-52 2Z" fill="${p.lining}" stroke="${p.metal}" stroke-width="1.3"/>
    <path d="M113 151h17v13h-17Z" fill="${p.metal}"/><path d="m121 153 5 5-5 4-5-4Z" fill="${p.dark}"/>
    <path class="nv-actor-ribbon" d="M132 160q23 16 44 6-7 15-34 5 29 23 41 54-20-4-27-22l-25-36Z" fill="${p.lining}" stroke="${p.metal}" stroke-width=".7"/>
    <path d="m75 275 9 6 8-5 8 6 8-5m39 0 9 6 8-5 8 6" fill="none" stroke="${p.metal}" stroke-width="1.4"/>
    <path d="m87 112-8 6 5 9 8-5-5-10m63-1 8 6-4 9-8-5 4-10" fill="none" stroke="${p.metal}" stroke-width="1.1"/>
    <path d="M58 178q-8 7-5 14 7 7 12 5l5-9m102-18q9 4 8 11-1 7-9 7l-5-7" fill="${gradient("skin")}" stroke="#ab8071" stroke-width=".8"/>
    <path d="m56 187 4 7m114-18 1 7" stroke="#ab8071" fill="none"/>
  </g>`;

  const head = `<g>
    <path d="M112 86v16l8 8 10-9-2-16" fill="${gradient("skin")}"/>
    <ellipse cx="101" cy="70" rx="4" ry="7" fill="#d8ac91"/><ellipse cx="139" cy="70" rx="4" ry="7" fill="#d8ac91"/>
    <path d="M101 56q1-19 19-19 20 0 20 21l-3 23q-5 13-17 16-13-6-17-17Z" fill="${gradient("skin")}"/>
    <path d="M101 65q-10-23 5-31 16-13 32 0 10 7 5 29l-11-17q-8 12-24 12l-7 15Z" fill="${gradient("hair")}"/>
    <path d="M107 39q9-9 20-3m-19 15 17-10m11 3 4 12" fill="none" stroke="${kind === "elder" ? "#fcf2d6" : "#8793a1"}" stroke-width=".8" opacity=".6"/>
    <path d="m106 66 8-1m13 0 8 1" stroke="${p.hair}" stroke-width="1.5" stroke-linecap="round"/>
    <path d="m106 71 8 1m13 0 8-1" stroke="#47373c" stroke-width="1.2" stroke-linecap="round"/>
    <circle cx="111" cy="71.5" r="1.3" fill="${kind === "fox" ? "#a24265" : "#315360"}"/><circle cx="130" cy="71.5" r="1.3" fill="${kind === "fox" ? "#a24265" : "#315360"}"/>
    <path d="m121 72-2 8 3 1m-6 6q4 2 8-1" fill="none" stroke="#a5726b" stroke-width=".9" stroke-linecap="round"/>
    ${feminine ? '<path d="m107 78 4 1m20 0 4-1" stroke="#d9908c" stroke-width="2" opacity=".5"/><circle cx="100" cy="79" r="1.6" fill="#f4d6a0"/><path d="M100 80v7m40-7v7" stroke="#f4d6a0"/><circle cx="140" cy="79" r="1.6" fill="#f4d6a0"/>' : ""}
    ${hair === "knot" ? `<path d="M110 34q-5-19 10-20 16 0 12 20" fill="${gradient("hair")}"/><path d="M109 31h25m-30 4 34-7" stroke="${p.metal}" stroke-width="2"/><path d="M116 19q-5 8 0 11" fill="none" stroke="#7b8a95" stroke-width=".9"/>` : ""}
    ${kind === "hero" && hair === "short" ? '<path d="m99 49-8 10 5-17m47 5 8 13-6-24" fill="#17333f"/>' : ""}
    ${kind === "hero" && profile.gender === "male" ? '<path d="m115 92 5 7 6-8" fill="#35424b" opacity=".7"/>' : ""}
  </g>`;

  const specialty =
    kind === "fox"
      ? `<g>
        <path d="M99 45 88 19q19 2 24 17m17-1q8-13 22-15l-10 27" fill="#d88c92" stroke="#653b51" stroke-width="2"/><path d="m97 35-4-10 12 11m31 0 10-9-5 13" fill="#f8d3ba"/>
        <path d="m109 49 11-7 12 7-12-3Z" fill="#eec990"/><path d="m120 47-2 9 3 4 3-4Z" fill="#d85273"/>
        <g transform="rotate(-15 169 175)"><path d="M168 180 133 134q32-26 68-2Z" fill="#f7c7ad" stroke="#e2ab84" stroke-width="1.3"/>
          <path d="m168 180-27-44m27 44-15-51m15 51-2-55m2 55 10-54m-10 54 22-48" stroke="#b86d79" stroke-width=".8"/>
          <path d="M146 143q23-18 41-7" fill="none" stroke="#d35d80" stroke-width="5"/>
          <path d="m153 142 9-8-1 10 11-7m-16 14 10-5 8 6" fill="none" stroke="#7f4564" stroke-width="1.4"/>
          <path d="m168 179-3 13" stroke="#e7c789" stroke-width="3"/>
        </g>
        <circle class="nv-actor-spark" cx="70" cy="233" r="3" fill="#f8d18f"/><path d="m67 233 3-7 3 7-3 7Z" fill="#ffe8ae"/>
      </g>`
      : kind === "elder"
        ? `<g>
          <path d="M106 79q14 17 28 0-3 26-14 45-13-19-14-45Z" fill="#ece1c6"/><path d="m111 88 9 26 9-25" fill="none" stroke="#c5b994"/>
          <path d="m102 63 14-2m10 0 13 2" fill="none" stroke="#f0e9d6" stroke-width="2.7"/>
          <path d="M57 51q36-17 65-34 25 18 60 32-23 19-61 17-43 0-64-15Z" fill="#b89665" stroke="#6b5b43" stroke-width="1.3"/>
          <path d="M67 50q52 17 104-1M80 46q43 12 78-1M94 39q28 9 48 0" fill="none" stroke="#e5c88f" stroke-width="1.2"/>
          <path d="m121 20-20 37m20-37 2 39m-1-38 25 34M72 53l20-10m66 3 16 6" stroke="#806640" stroke-width=".8"/>
          <path d="M92 61q-2 22 18 36m39-36q3 21-18 36" fill="none" stroke="#7a654c"/>
          <g transform="rotate(12 154 206)"><path d="M137 169h41v76h-41Z" fill="#dfc49a" stroke="#795c48"/><path d="M135 165h45v7h-45Zm0 77h45v7h-45Z" fill="#644d46" stroke="#b6996a"/>
            <path d="m143 188 9-10 8 16 10-7m-26 39 9-20 10 8 8-14M147 234q-5-28 17-37" fill="none" stroke="#7c8365" stroke-width="1.2"/>
            <circle cx="164" cy="185" r="3" fill="none" stroke="#b56652"/><path d="M139 230h9v9h-9Z" fill="#b56652" opacity=".75"/>
          </g>
          <path d="M94 138q-18 21-34 6l-8-3-2 11q28 28 48-4" fill="${gradient("robe")}" stroke="${p.dark}"/>
          <path d="m49 140 8 1 2 11-9 3q-8-7-1-15" fill="${gradient("skin")}"/>
        </g>`
        : kind === "sentinel"
          ? `<g>
            <path d="m91 100-21 10 6 25 21-7 10-22m35-5 23 8 7 24-24-4-17-21" fill="#41455f" stroke="#b6a9b5" stroke-width="1.3"/>
            <path d="m81 114 14-3-7 12m61-12 12 4-1 10" fill="none" stroke="#c55b6e" stroke-width="2"/>
            <path d="m105 117 15 8 16-9-5 28-11 7-11-8Z" fill="#293348" stroke="#8c91a9"/><path d="m120 128-4 10 4 6 5-6Z" fill="#d16579"/>
            <path d="M101 55q8-10 19-6l-3 16 8 9-6 16-15-11Z" fill="#d9d8d1" stroke="#abb7c1" stroke-width=".8"/>
            <path d="m104 64 12 1-4 6-7-2m7-15-3 7 5 8-3 6 6 8" fill="none" stroke="#50506b" stroke-width="1.3"/>
            <path d="m106 66 7 1" stroke="#ca536c" stroke-width="2"/>
            <path d="m146 144 28 18 23-16 5 11-31 20-25-15" fill="${gradient("robe")}" stroke="#282e47"/>
            <path d="m195 144 9-3 5 10-7 8-7-3Z" fill="#d9b39e"/>
            <path class="nv-actor-ribbon" d="M85 105Q54 141 27 133q11 19 42 9-13 20-28 28 31-3 45-31Z" fill="#a94561"/>
          </g>`
          : kind === "swordswoman"
            ? `<g>
              <path d="m106 37 14-9 17 9-16-4Z" fill="#d9e8d9"/><circle cx="120" cy="32" r="3" fill="#81ddd7"/>
              <path class="nv-actor-ribbon" d="M98 43Q70 62 59 49q1 21 31 6-9 20-29 31 26-5 39-26" fill="#87cbcf" opacity=".8"/>
              <path d="M100 168q-10 35-8 77m7-60 10 8-14 6m-1 15 10 6-13 7" fill="none" stroke="#e8f5df" stroke-width="1.2"/>
              <path d="m141 182 6 11 10 4-8 7 1 12-10-7-10 3 3-12-6-9 11-1Z" fill="none" stroke="#bdeddf" stroke-width="1"/>
              <circle class="nv-actor-spark" cx="155" cy="233" r="3" fill="#c3fff0"/>
              <path d="M124 163v31m-3-5 3 9 3-9" stroke="#d6eacb" stroke-width="1.3"/>
            </g>`
            : `<g>
              <path d="M133 161v34" stroke="${p.metal}"/><path d="m133 185-6 8 6 8 6-8Z" fill="#7cd4c3" stroke="${p.metal}"/>
              <path d="M133 201v10m-3-9v7m6-7v7" stroke="${p.metal}"/>
              <path d="M91 232q16-20 22-6-12-5-19 9m-3 9q15-13 19-2-13-3-18 7" fill="none" stroke="${p.metal}" stroke-width="1.2" opacity=".8"/>
              <path class="nv-actor-spark" d="m154 99 2-6 2 6 6 2-6 2-2 6-2-6-6-2Z" fill="#e7d5a0"/>
            </g>`;

  return `${defs}<ellipse cx="122" cy="319" rx="70" ry="9" fill="#071a2b" opacity=".28"/>
    <g class="nv-actor-breath" data-actor-kind="${kind}">
      ${backAccessory}${backHair}${silhouette}${head}${specialty}
    </g>`;
}
