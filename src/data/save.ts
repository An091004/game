export const SAVE_CONFIG = {
  version: 2,
  mainKey: "nhan_van_save_main",
  backupKey: "nhan_van_save_backup",
  legacyKey: "nhan_van_tu_tien_ky_v1",
  format: "nhanvan.save",
  autosaveMs: 5000,
  maxLength: 1_000_000,
} as const;

export const SAVE_TEXT = {
  loading: "Đang mở sổ tu hành…",
  blockedTitle: "Bản lưu cần được kiểm tra",
  blocked:
    "Không đọc được bản lưu an toàn. Game đã dừng khởi tạo và giữ nguyên dữ liệu; không có bản lưu rỗng nào được ghi. Hãy giữ lại dữ liệu trình duyệt và thử tải lại. Nếu lỗi tiếp diễn, xuất giữ hai khóa nhan_van_save_main và nhan_van_save_backup để kiểm tra.",
  writeFailed:
    "Chưa lưu được tiến độ. Tự lưu đã tạm khóa để bảo vệ bản trước; hãy xuất Sao lưu rồi tải lại để kiểm tra.",
  recovered:
    "Ô chính không dùng được. Đã khôi phục từ bản lưu dự phòng gần nhất.",
  migrated: "Đã đọc bản lưu cũ và nâng cấp định dạng; bản gốc vẫn được giữ.",
  reload: "Thử tải lại",
  continue: "Tiếp tục tu hành",
  offlineTitle: "Bế quan trở về",
  offline: (amount: string) =>
    `Trong lúc bế quan, ngươi hấp thu được ${amount} linh khí.`,
  confirmImport:
    "Khôi phục sẽ thay thế tiến độ hiện tại. Bạn đã xuất bản lưu để giữ riêng và muốn tiếp tục?",
  invalid: "Bản lưu thiếu dữ liệu hoặc không đúng cấu trúc.",
  checksum: "Checksum bản lưu không khớp.",
  future:
    "Bản lưu thuộc phiên bản mới hơn. Hãy mở bằng bản game mới; dữ liệu hiện tại được giữ nguyên.",
  incomplete:
    "Không thể xác nhận dữ liệu đã lưu. Bản hợp lệ trước vẫn được giữ nếu có.",
  conflict:
    "Bản lưu đã thay đổi ở phiên khác. Phiên này dừng ghi để giữ dữ liệu mới hơn; hãy xuất tiến độ hiện tại trước khi tải lại.",
  lifecycle:
    "Chưa đăng ký được sự kiện vòng đời ứng dụng. Hãy sao lưu trước khi thoát.",
};
