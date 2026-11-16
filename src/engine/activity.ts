/** Gộp visibility/pagehide để không tính ngoại tuyến hai lần. */
export function createActivity(
  onPause: () => void,
  onResume: () => void,
  visible = true,
) {
  let documentVisible = visible,
    pageVisible = true,
    active = visible;
  function update() {
    const next = documentVisible && pageVisible;
    if (next === active) return;
    active = next;
    if (active) onResume();
    else onPause();
  }
  return {
    get active() {
      return active;
    },
    document(value: boolean) {
      documentVisible = value;
      update();
    },
    page(value: boolean) {
      pageVisible = value;
      update();
    },
  };
}
