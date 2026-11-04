type DomMap = {
  sky: HTMLCanvasElement;
  exportText: HTMLTextAreaElement;
  importText: HTMLTextAreaElement;
  breakthroughButton: HTMLButtonElement;
  caveUpgrade: HTMLButtonElement;
};
export function $<K extends string>(
  id: K,
): K extends keyof DomMap ? DomMap[K] : HTMLElement {
  const el = document.getElementById(id);
  if (!el) throw Error("Missing DOM element: " + id);
  return el as K extends keyof DomMap ? DomMap[K] : HTMLElement;
}
