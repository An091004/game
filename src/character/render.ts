import { CHARACTER, CHARACTER_TEXT } from "../data/character";
import type { GameState } from "../state/types";
import { esc } from "../ui/format";
import {
  characterView,
  type CharacterActivity,
  type CharacterSlot,
} from "./model";

/** Điểm thay thế lớp hình ảnh: chỉ trả SVG, không sửa state hoặc gắn sự kiện. */
export function renderCharacter(
  state: GameState,
  options: { activity?: CharacterActivity; slot?: CharacterSlot } = {},
) {
  const activity = options.activity ?? "practice",
    slot = options.slot ?? "profile";
  const view = characterView(state),
    p = view.profile;
  const robe = CHARACTER.robes.find((r) => r.id === p.robe)!;
  const id = `nv-${slot}`,
    walking = activity === "travel";
  const color =
    view.realm === 0 ? "#e9f3e7" : view.realm === 1 ? "#91d0b2" : "#e9c67d";
  const shoulders = p.gender === "male" ? 43 : p.gender === "female" ? 36 : 40;
  const hairBack =
    p.hair === "long"
      ? '<path d="M-24-76Q-40-20-29 37L-12 24 24 40Q40-24 23-78Z" fill="#112a2b"/><path d="M22-56Q39-2 25 32" fill="none" stroke="#6d8177" opacity=".5"/>'
      : p.hair === "short"
        ? '<path d="M-27-76Q-39-37-24-25L-19-48 25-32Q38-57 24-78Z" fill="#122a2b"/>'
        : '<path d="M-22-78Q-33-35-20-20L24-19Q34-44 23-77Z" fill="#122a2b"/>';
  const seatedRobe = `<path d="M-18-33Q-${shoulders}-33-52 9L-81 43Q-96 62-57 68L58 68Q95 62 79 42L52 8Q${shoulders}-34 18-33Z" fill="url(#${id}-robe)"/><path d="M-18-29-7 14-49 55 0 62 51 55 10 15 18-29" fill="${robe.shade}"/><path d="m-15-30 15 47 15-47M-55 49-18 30M55 49 18 30" stroke="#e3d5aa" stroke-opacity=".55" stroke-width="2" fill="none"/><path d="M-26 16Q0 22 26 16L24 27Q0 32-24 26Z" fill="#c6aa72"/><path d="M-19 35Q-8 26 0 31 8 26 19 35L11 40H-11Z" fill="#d3bea0"/>`;
  const walkingRobe = `<g class="character-leg character-leg-left"><path d="M-22 36-24 88-39 98-4 98 2 39" fill="#1c3435"/><path d="m-25 91-15 6q-5 5 4 6h31v-8" fill="#112627"/></g><g class="character-leg character-leg-right"><path d="M4 37 19 89 10 101h32L28 37Z" fill="#273f3e"/><path d="m19 94-10 7q-5 5 6 5h30l-5-11" fill="#102627"/></g><path d="M-18-33Q-46-31-56 15L-32 28-41 65Q1 83 43 65L29 23 53 13Q43-32 18-33Z" fill="url(#${id}-robe)"/><path d="m-15-30 14 46 17-46M0 18-11 72M29 30l7 31" stroke="#d9c99d" stroke-opacity=".6" stroke-width="2" fill="none"/><path d="M-29 8Q0 18 29 8L28 20Q0 28-28 20Z" fill="#c6aa72"/><path d="M-51 12-41 28-31 21-40 8M40 8 33 26 43 29 53 12" fill="#d3bea0"/>`;
  const aura = `<g class="character-aura" fill="none" stroke="${color}">
    <ellipse cx="160" cy="174" rx="91" ry="109" fill="url(#${id}-glow)" stroke="none"/>
    <ellipse cx="160" cy="197" rx="79" ry="24" stroke-width="${view.realm === 0 ? 1 : 2}" opacity=".7" class="character-qi"/>
    ${view.realm >= 1 ? '<circle cx="160" cy="164" r="86" stroke-width="1.5"/><circle cx="160" cy="164" r="80" stroke-dasharray="2 12" opacity=".65"/>' : ""}
    ${Array.from({ length: view.extraRings }, (_, i) => `<ellipse cx="160" cy="165" rx="${98 + i * 7}" ry="${70 + i * 13}" transform="rotate(${i * 30} 160 165)" opacity="${0.65 - i * 0.06}"/>`).join("")}
  </g>`;
  const furnace =
    activity === "alchemy"
      ? `<g class="character-furnace"><path d="M218 225h70l-8 13h-53Z" fill="#b69c68"/><path d="M230 238h47q20 37-9 45h-30q-27-9-8-45" fill="#596d60" stroke="#bba174"/><path d="M227 249q-20-8-13 12h13m52-12q20-8 13 12h-13M234 281l-5 12m43-12 5 12" fill="none" stroke="#bba174" stroke-width="4"/><circle cx="253" cy="263" r="9" fill="#e8b86f" opacity=".7"/><path d="M238 221q-17-16 0-30t0-28M254 217q16-20 0-32t0-29M270 221q15-13 0-25" class="character-smoke" fill="none" stroke="#c1cbb6" stroke-width="2" opacity=".4"/></g>`
      : "";
  const spirit =
    view.realm >= 3
      ? '<g class="character-spirit" fill="#e9d59d"><ellipse cx="160" cy="63" rx="15" ry="22" opacity=".12"/><circle cx="160" cy="55" r="4"/><path d="m160 60-9 15q9 5 18 0Z"/><path d="m152 64-5 5m21-5 5 5" stroke="#e9d59d" stroke-width="2"/></g>'
      : "";
  return `<svg class="character-scene" style="--aura-opacity:${view.auraOpacity.toFixed(3)}" data-activity="${activity}" data-realm="${view.realm}" viewBox="0 0 320 320" role="img" aria-labelledby="${id}-title" xmlns="http://www.w3.org/2000/svg">
    <title id="${id}-title">${esc(p.name)} · ${CHARACTER_TEXT.activities[activity]} · ${view.auraLabel}</title>
    <defs><linearGradient id="${id}-robe" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${robe.color}"/><stop offset="1" stop-color="${robe.shade}"/></linearGradient><radialGradient id="${id}-glow"><stop stop-color="${color}" stop-opacity=".18"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient></defs>
    <g class="character-scenery"><circle cx="218" cy="72" r="38" fill="#e6d8af" opacity=".08"/><circle cx="218" cy="72" r="29" fill="#e6d8af" opacity=".45"/><path d="m0 244 68-118 63 95 68-107 121 130v76H0Z" fill="#789284" opacity=".15"/><path d="m0 261 88-74 70 64 87-64 75 74v59H0Z" fill="#52796c" opacity=".2"/><path d="M10 272q70-23 146-5t154-5" fill="none" stroke="#bdcbb4" stroke-opacity=".17" stroke-width="6"/></g>
    ${walking ? '<path d="M58 293q75-30 130-10t80-8" fill="none" stroke="#b1b69d" stroke-opacity=".3"/>' : '<g class="character-rock"><ellipse cx="160" cy="278" rx="106" ry="15" fill="#041719" opacity=".35"/><path d="m66 267 25-28 57-8 65 10 33 29-41 14-101-1Z" fill="#4b655d"/><path d="m91 239 57-8 65 10-40 13-63-1Z" fill="#839286" opacity=".4"/><path d="m145 255 31 1-12 22M204 256l18 12" fill="none" stroke="#9aaa93" opacity=".25"/></g>'}
    ${aura}
    <g class="character-body" transform="translate(160 181)"><g class="character-breath">
      ${hairBack}${walking ? walkingRobe : seatedRobe}
      <path d="M-9-48v18q9 11 18 0v-18" fill="#c5ad8e"/><ellipse cx="0" cy="-64" rx="23" ry="30" fill="#d6c3a3"/>
      <path d="M-23-57q-6-33 21-37 33 0 26 38L10-77-3-69-17-74Z" fill="#132c2c"/>
      ${p.hair === "knot" ? '<ellipse cx="0" cy="-100" rx="13" ry="10" fill="#142b2c"/><path d="M-17-93h34" stroke="#c9b37a" stroke-width="3"/>' : p.hair === "long" ? '<path d="M18-82q22 24 12 59" stroke="#162e2e" stroke-width="8" fill="none"/>' : '<path d="m-22-71-8 10 4-24m48 13 8 13-5-24" fill="#132c2c"/>'}
      <path d="M-14-58q5 3 9 0m10 0q5 3 9 0M-4-43q4 2 8 0" stroke="#725e4e" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      ${p.gender === "male" ? '<path d="m-5-35 5 8 5-8" fill="#34423b" opacity=".8"/>' : p.gender === "female" ? '<circle cx="-23" cy="-49" r="2.5" fill="#d6b977"/><circle cx="23" cy="-49" r="2.5" fill="#d6b977"/>' : ""}
      ${view.realm >= 2 ? '<g class="character-core"><circle cy="26" r="15" fill="#f4d889" opacity=".14"/><circle cy="26" r="6" fill="#f4d889"/></g>' : ""}
    </g></g>${spirit}${furnace}
    <g class="character-flow" fill="none" stroke="${color}" stroke-width="1.2"><path d="M74 205q-19-36 26-43t60 45M249 195q18 42-31 40t-58-28" opacity=".4"/><circle cx="76" cy="185" r="2" fill="${color}"/><circle cx="241" cy="216" r="2" fill="${color}"/></g>
    ${activity === "breakthrough" ? '<g class="character-burst"><circle cx="160" cy="180" r="107" fill="none" stroke="#efd599" stroke-width="2"/><path d="m56 32 23 38-12 8 24 32M263 35l-23 36 11 9-19 30" fill="none" stroke="#e5d5aa" stroke-width="2"/></g>' : ""}
  </svg>`;
}
