import type { GameState } from "../state/types";
import { WORLD_NPCS, WORLD_SCENES, WORLD_TEXT as T } from "../data/world";
import { worldPortrait, worldScene } from "../graphics/world";
import { esc } from "./format";

/** Chuyến thưởng cảnh chỉ đọc nhân vật. Không ghi state/save hoặc tạo phần thưởng. */
export function setupWorld(getState: () => GameState) {
  const page = document.createElement("section");
  page.id = "page-world";
  page.className = "content-page nv-world";
  page.hidden = true;
  document.getElementById("main")!.append(page);
  let selectedScene = WORLD_SCENES[0];
  let selectedNpc = selectedScene.npcs[0];
  let profileKey = "";
  let paused = false;
  page.innerHTML = `<header class="nv-world-heading"><p class="nv-eyebrow">${T.eyebrow}</p><h1>${T.title}</h1><p>${T.intro}</p></header>
    <div class="nv-region-tabs" role="group" aria-label="${T.scenes}">${WORLD_SCENES.map((scene) => `<button type="button" data-region="${scene.id}" aria-pressed="${scene === selectedScene}" style="--region-accent:${scene.accent}"><span class="nv-region-number">${scene.number}</span><span><strong>${scene.name}</strong><small>${scene.subtitle}</small></span><span class="nv-palette" aria-hidden="true">${scene.colors.map((color) => `<i style="background:${color}"></i>`).join("")}</span></button>`).join("")}</div>
    <div class="nv-scene-frame"><div id="worldCanvas"></div><div class="nv-scene-caption"><span id="worldMood"></span><p id="worldPoem"></p></div><button class="nv-motion" type="button" id="worldMotion" aria-pressed="false">${T.still}</button><div class="nv-scene-marker" id="worldMarkers"></div><div class="nv-scene-bottom"><span>${T.illustration}</span><span id="worldSceneName"></span></div></div>
    <p class="nv-world-hint">${T.npcHint}</p>
    <div class="nv-story-strip"><span>${T.chapter}</span><p id="worldRumor"></p></div>
    <div class="nv-encounter"><div class="nv-people"><h2>${T.people}</h2><div id="worldPeople"></div><div class="nv-traveler"><span aria-hidden="true">✧</span><p><strong id="worldHeroName"></strong><small>${T.heroHint}</small></p><button type="button" data-action="goto" data-id="character">${T.edit}</button></div></div>
    <section class="nv-conversation" aria-labelledby="worldNpcName"><div id="worldPortrait" class="nv-portrait"></div><div class="nv-dialogue"><p class="nv-eyebrow">${T.dossier}</p><h2 id="worldNpcName"></h2><p class="nv-npc-title" id="worldNpcTitle"></p><p class="nv-npc-detail" id="worldNpcDetail"></p><blockquote id="worldSpeech" aria-live="polite" aria-atomic="true"></blockquote><div class="nv-topic-buttons" id="worldTopics"></div></div></section></div><p class="nv-world-footnote">${T.journey}</p>`;

  const find = <E extends HTMLElement = HTMLElement>(id: string) =>
    page.querySelector<E>(`#${id}`)!;
  const launch = document.createElement("div");
  launch.className = "nv-world-invitation";
  launch.innerHTML = `<div><small>${T.invitation}</small><p>${T.invitationBody}</p></div><button type="button" data-action="goto" data-id="world">${T.open} <span aria-hidden="true">↗</span></button>`;
  document.querySelector("#page-practice .hero")!.after(launch);

  function drawHero() {
    const profile = getState().character;
    const key = JSON.stringify([profile, selectedScene.id]);
    if (profileKey === key) return;
    profileKey = key;
    find("worldCanvas").innerHTML = worldScene(selectedScene.id, profile);
    find("worldHeroName").textContent = profile?.name ?? T.emptyName;
  }
  function talk(id: string) {
    if (!selectedScene.npcs.includes(id)) return;
    selectedNpc = id;
    const npc = WORLD_NPCS.find((person) => person.id === id)!;
    find("worldPortrait").innerHTML = worldPortrait(id, "dialogue");
    find("worldNpcName").textContent = npc.name;
    find("worldNpcTitle").textContent = npc.title;
    find("worldNpcDetail").textContent = npc.detail;
    find("worldSpeech").textContent = npc.greeting;
    page.style.setProperty("--npc-accent", npc.accent);
    find("worldTopics").innerHTML = npc.topics
      .map(
        (topic, index) =>
          `<button type="button" data-topic="${index}" aria-pressed="false">${esc(topic.label)} <span aria-hidden="true">↗</span></button>`,
      )
      .join("");
    page
      .querySelectorAll<HTMLButtonElement>("[data-npc]")
      .forEach((button) =>
        button.setAttribute("aria-pressed", String(button.dataset.npc === id)),
      );
  }
  function showScene() {
    page.dataset.region = selectedScene.id;
    page.style.setProperty("--world-accent", selectedScene.accent);
    find("worldMood").textContent = selectedScene.mood;
    find("worldPoem").textContent = selectedScene.poem;
    find("worldSceneName").textContent = selectedScene.name;
    find("worldRumor").textContent = selectedScene.rumor;
    page
      .querySelectorAll<HTMLButtonElement>("[data-region]")
      .forEach((button) =>
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.region === selectedScene.id),
        ),
      );
    find("worldMarkers").innerHTML = selectedScene.npcs
      .map((id, index) => {
        const npc = WORLD_NPCS.find((person) => person.id === id)!;
        return `<button type="button" data-npc="${id}" class="nv-npc-marker nv-marker-${index}" aria-pressed="false" aria-label="${T.talk}: ${npc.name}"><span aria-hidden="true">◇</span> ${npc.name}</button>`;
      })
      .join("");
    find("worldPeople").innerHTML = selectedScene.npcs
      .map((id) => {
        const npc = WORLD_NPCS.find((person) => person.id === id)!;
        return `<button type="button" class="nv-person-card" data-npc="${id}" aria-pressed="false"><span class="nv-person-thumbnail">${worldPortrait(id, "card")}</span><span><strong>${npc.name}</strong><small>${npc.title}</small></span><span aria-hidden="true">↗</span></button>`;
      })
      .join("");
    drawHero();
    talk(selectedScene.npcs[0]);
  }
  page.addEventListener("click", (event) => {
    const button =
      event.target instanceof Element
        ? event.target.closest<HTMLButtonElement>("button")
        : null;
    if (!button) return;
    const region = WORLD_SCENES.find(
      (scene) => scene.id === button.dataset.region,
    );
    if (region) {
      selectedScene = region;
      showScene();
    } else if (button.dataset.npc) {
      talk(button.dataset.npc);
      if (button.classList.contains("nv-npc-marker")) {
        const heading = find("worldNpcName");
        heading.tabIndex = -1;
        heading.scrollIntoView({ block: "center", behavior: "instant" });
        heading.focus({ preventScroll: true });
      }
    } else if (button.dataset.topic !== undefined) {
      const npc = WORLD_NPCS.find((person) => person.id === selectedNpc)!;
      const topic = npc.topics[Number(button.dataset.topic)];
      if (!topic) return;
      find("worldSpeech").textContent = topic.reply;
      find("worldTopics")
        .querySelectorAll("button")
        .forEach((item) =>
          item.setAttribute("aria-pressed", String(item === button)),
        );
    } else if (button.id === "worldMotion") {
      paused = !paused;
      page.dataset.paused = String(paused);
      button.setAttribute("aria-pressed", String(paused));
      button.textContent = paused ? T.moving : T.still;
    }
  });
  showScene();
  return {
    render(activePage: string) {
      document.querySelector<HTMLElement>(".site")!.dataset.world = String(
        activePage === "world",
      );
      if (activePage === "world") drawHero();
    },
  };
}
