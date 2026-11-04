import { TEXT } from "../data/text";
export const format = (n: number) =>
  new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: n < 10 ? 1 : 0,
  }).format(Math.max(0, n));
export const money = (n: number) =>
  new Intl.NumberFormat("vi-VN").format(Math.max(0, Math.floor(n)));
export const esc = (x: unknown) =>
  String(x == null ? "" : x).replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c]!,
  );
export const dur = (s: number) => {
  s = Math.max(0, Math.ceil(s));
  if (s >= 3600)
    return TEXT.message001(Math.floor(s / 3600), Math.floor((s % 3600) / 60));
  if (s >= 60) return TEXT.message002(Math.floor(s / 60), s % 60);
  return TEXT.message003(s);
};
export const clock = (t: number) =>
  new Date(t).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
