// SVG nội bộ: cùng nét mảnh, kế thừa màu của giao diện, không tải tài nguyên ngoài.
const paths: Record<string, string> = {
  practice:
    '<circle cx="12" cy="12" r="9"/><path d="M12 3a4.5 4.5 0 0 1 0 9 4.5 4.5 0 0 0 0 9"/><circle cx="12" cy="7.5" r=".8"/><circle cx="12" cy="16.5" r=".8"/>',
  manuals:
    '<path d="M4 4h6q2 0 2 2 0-2 2-2h6v15h-6q-2 0-2 2 0-2-2-2H4Z M12 6v15 M7 8h2 M15 8h2 M7 12h2 M15 12h2"/>',
  travel:
    '<path d="M5 17h14a3 3 0 0 0 0-6h-1a6 6 0 0 0-11-2 4 4 0 0 0-2 8Z M8 21h8"/>',
  cave: '<path d="m2 12 10-9 10 9 M5 10v11h14V10 M10 21v-7h4v7"/>',
  alchemy:
    '<path d="M9 3h6 M10 3v7L4 19q-1 2 2 2h12q3 0 2-2l-6-9V3 M7 16h10"/>',
  journal: '<path d="M10 4H4v17h16v-7 M9 16l1-5L19 2l3 3-9 9-4 2Z M17 4l3 3"/>',
  achievements: '<path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z"/>',
  more: '<circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>',
  settings: '<path d="M4 6h16 M4 12h16 M4 18h16 M8 3v6 M16 9v6 M10 15v6"/>',
  lock: '<rect x="6" y="10" width="12" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3 M12 14v3"/>',
};
export function icon(id: string) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths[id] ?? paths.more}</svg>`;
}
