type Dialog = {
  element: HTMLElement;
  restore: HTMLElement | null;
  onClose?: () => void;
};
const stack: Dialog[] = [];
const focusable =
  'button:not(:disabled), textarea:not(:disabled), input:not(:disabled), [tabindex="0"]';
function targets(element: HTMLElement) {
  return Array.from(element.querySelectorAll<HTMLElement>(focusable)).filter(
    (e) => e.getClientRects().length > 0,
  );
}
function sync() {
  const site = document.querySelector<HTMLElement>(".site");
  if (site) site.inert = stack.length > 0;
  document.body.classList.toggle("dialog-open", stack.length > 0);
  stack.forEach((entry, i) => {
    entry.element.inert = i !== stack.length - 1;
    entry.element.style.zIndex = String(100 + i);
  });
}
export function closeDialog(element: HTMLElement) {
  const index = stack.findIndex((d) => d.element === element);
  if (index < 0) return false;
  const wasTop = index === stack.length - 1;
  const [entry] = stack.splice(index, 1);
  element.hidden = true;
  element.inert = false;
  entry.onClose?.();
  sync();
  if (wasTop) {
    const top = stack.at(-1)?.element;
    const restore = entry.restore;
    if (
      restore?.isConnected &&
      (!top || top.contains(restore)) &&
      restore.getClientRects().length
    )
      restore.focus({ preventScroll: true });
    else
      (top
        ? (targets(top)[0] ?? top)
        : document.querySelector<HTMLElement>(
            "#main .content-page:not([hidden])",
          )
      )?.focus({ preventScroll: true });
  }
  return true;
}
export function closeTopDialog() {
  const top = stack.at(-1);
  return top ? closeDialog(top.element) : false;
}
export function openDialog(element: HTMLElement, onClose?: () => void) {
  if (stack.some((d) => d.element === element)) return;
  stack.push({
    element,
    onClose,
    restore:
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null,
  });
  element.hidden = false;
  element.tabIndex = -1;
  sync();
  (targets(element)[0] ?? element).focus({ preventScroll: true });
}
document.addEventListener("keydown", (e) => {
  const top = stack.at(-1)?.element;
  if (!top) return;
  if (e.key === "Escape") {
    e.preventDefault();
    closeTopDialog();
  }
  if (e.key === "Tab") {
    const items = targets(top),
      first = items[0] ?? top,
      last = items.at(-1) ?? top;
    if (
      !top.contains(document.activeElement) ||
      (e.shiftKey && document.activeElement === first) ||
      (!e.shiftKey && document.activeElement === last) ||
      !items.length
    ) {
      e.preventDefault();
      (e.shiftKey ? last : first).focus();
    }
  }
});
