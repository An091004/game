export const MOBILE = {
  fontSizes: [0.9, 1, 1.1, 1.2],
  exitWindowMs: 2000,
  moreTitle: "Một góc bên hiên",
  moreIntro: "Mở trang kinh, đọc chuyện cũ, hay chỉnh một chút cho vừa ý mình.",
  settingsTitle: "Cài đặt",
  settingsIntro: "Chọn nhịp điệu thoải mái cho hành trình của ngươi.",
  backMore: "Về mục Thêm",
  locked: "Chưa mở",
  theme: "Giao diện sáng",
  themeHint: "Tắt để trở về sắc núi xanh đen.",
  font: "Cỡ chữ",
  fontDown: "Giảm cỡ chữ",
  fontUp: "Tăng cỡ chữ",
  music: "Nhạc nền",
  musicHint: "Tiếng gió và chuông nhẹ; chạm vào trò chơi để bắt đầu phát.",
  haptics: "Cho phép rung phản hồi",
  hapticsHint: "Ghi nhớ lựa chọn cho các hiệu ứng rung.",
  battery: "Tiết kiệm pin",
  batteryHint: "Tắt hạt sáng và chuyển động trang trí. Tu luyện vẫn tiếp tục.",
  backup: "Sao lưu hành trình",
  exitHint: "Bấm Back lần nữa để rời động phủ.",
  exitFailed: "Chưa thể thoát lúc này. Hãy thử lại.",
  nativeFailed: "Chưa kết nối được điều khiển Android. Hãy mở lại trò chơi.",
  barsFailed: "Chưa đổi được màu biểu tượng hệ thống. Hãy mở lại trò chơi.",
};
export const BOTTOM_PAGES = ["practice", "travel", "cave", "more"];
export const MORE_PAGES = [
  "manuals",
  "alchemy",
  "journal",
  "achievements",
  "settings",
];
export function bottomPage(page: string) {
  return BOTTOM_PAGES.includes(page) ? page : "more";
}
export function parentPage(page: string) {
  return MORE_PAGES.includes(page) ? "more" : "practice";
}
