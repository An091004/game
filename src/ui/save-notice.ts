import { openDialog, closeDialog } from "./dialogs";
import { SAVE_TEXT } from "../data/save";

let status: HTMLElement | null = null;
export function showSaveWarning(text: string) {
  if (!status) {
    status = document.createElement("div");
    status.className = "save-warning";
    status.role = "alert";
    document.body.append(status);
  }
  status.textContent = text;
}
export function showSaveBlocked(error?: unknown) {
  document.querySelector<HTMLElement>(".site")!.inert = true;
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  overlay.role = "alertdialog";
  overlay.setAttribute("aria-modal", "true");
  const card = document.createElement("div");
  card.className = "modal";
  const title = document.createElement("h2");
  title.textContent = SAVE_TEXT.blockedTitle;
  const message = document.createElement("p");
  message.textContent = SAVE_TEXT.blocked;
  const detail = document.createElement("p");
  detail.textContent = error instanceof Error ? error.message : "";
  const button = document.createElement("button");
  button.className = "primary-button";
  button.textContent = SAVE_TEXT.reload;
  button.onclick = () => location.reload();
  card.append(title, message, detail, button);
  overlay.append(card);
  document.body.append(overlay);
  button.focus();
}
export function showOffline(amount: string) {
  const previous = document.getElementById("offlineOverlay");
  if (previous) closeDialog(previous);
  const overlay = document.createElement("div");
  overlay.id = "offlineOverlay";
  overlay.className = "overlay";
  overlay.role = "dialog";
  overlay.setAttribute("aria-modal", "true");
  const card = document.createElement("div");
  card.className = "modal";
  const title = document.createElement("h2");
  title.textContent = SAVE_TEXT.offlineTitle;
  const message = document.createElement("p");
  message.textContent = SAVE_TEXT.offline(amount);
  const button = document.createElement("button");
  button.className = "primary-button";
  button.textContent = SAVE_TEXT.continue;
  title.id = "offlineHeading";
  overlay.setAttribute("aria-labelledby", title.id);
  button.onclick = () => closeDialog(overlay);
  card.append(title, message, button);
  overlay.append(card);
  document.body.append(overlay);
  openDialog(overlay, () => overlay.remove());
}
