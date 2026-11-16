import type { CharacterProfile } from "../state/types";
import { CHARACTER } from "../data/character";
import { WORLD_NPCS, WORLD_SCENES, WORLD_TEXT } from "../data/world";
import { esc } from "../ui/format";
import { renderActor } from "./actors";
import { landscapeLayers, type SceneId } from "./scenery";

export function worldScene(sceneId: SceneId, profile: CharacterProfile | null) {
  const scene = WORLD_SCENES.find((item) => item.id === sceneId)!;
  const prefix = `nv-world-${sceneId}`;
  const positions = [230, 875];
  return `<svg class="nv-world-scene" viewBox="0 0 1200 720" role="img" aria-labelledby="${prefix}-title" xmlns="http://www.w3.org/2000/svg"><title id="${prefix}-title">${esc(scene.name)}. ${esc(scene.subtitle)}. ${esc(WORLD_TEXT.hero)}: ${esc((profile ?? CHARACTER.defaultProfile).name)}.</title>
  ${landscapeLayers(sceneId, `${prefix}-land`)}
  <g class="nv-scene-people">${scene.npcs
    .map((id, index) => {
      const npc = WORLD_NPCS.find((person) => person.id === id)!;
      return `<g transform="translate(${positions[index]} 425) scale(.59)">${renderActor(npc.kind, `${prefix}-${id}`)}</g>`;
    })
    .join("")}
  <g transform="translate(507 393) scale(.71)">${renderActor("hero", `${prefix}-hero`, profile ?? CHARACTER.defaultProfile)}</g></g>
  </svg>`;
}

export function worldPortrait(npcId: string, slot: string) {
  const npc = WORLD_NPCS.find((person) => person.id === npcId)!;
  return `<svg viewBox="0 0 240 340" aria-hidden="true" focusable="false">${renderActor(npc.kind, `nv-portrait-${slot}-${npcId}`)}</svg>`;
}
