# Kiểm chứng giai đoạn 2

Ngày 04/11/2026; Windows, Node 24.22.1, npm 12.2.1. CLI npm chạy từ thư mục tạm trong repo.

| Lệnh | Kết quả thực tế |
| --- | --- |
| npm ci | Đạt; cài 45 packages, audit 46, 0 vulnerabilities |
| npx tsc --noEmit | Đạt, strict mode |
| npx vitest run | Đạt 71/71 test trong 3 file |
| npm run build | Đạt |

Các test bao gồm hồi quy cấu hình/công thức v1, serialize/deserialize tiếng Việt, checksum, migration v1 → v2 và tính lặp an toàn; khóa ghi với save thiếu/hỏng/phiên bản tương lai/lỗi đọc; backup xoay vòng; ghi bị gián đoạn; flush đồng bộ web; hàng đợi native giả lập; debounce 5 giây; chọn Preferences/localStorage; phát hiện phiên khác thay ô chính; giới hạn 8 giờ, buff và đồng hồ lùi; gộp sự kiện vòng đời.

Kiểm tra bản production bằng Edge 156.0.4314.58 với dữ liệu thử riêng: tự lưu 5 giây, đóng/mở giữ tiến độ, migration v1, hộp thoại ngoại tuyến giới hạn 8 giờ, xuất/nhập Base64 có xác nhận, phục hồi main từ backup, dừng khởi tạo khi hai ô hỏng dù khóa v1 còn tồn tại. Giả lập xuống nền và resume trùng chỉ cộng khoảng 20 giây một lần. Không có lỗi JavaScript; màn hình 390px không tràn ngang.

Native Preferences và appStateChange được kiểm tra ở mức adapter/mô phỏng. Chưa build Android, thử tắt cưỡng bức app, Auto Backup hoặc cài đè APK trên máy thật. Những kiểm tra đó cần dự án Android ở giai đoạn 3. Callback flush được gọi ngay khi xuống nền nhưng hệ điều hành vẫn có thể kết thúc tiến trình trước khi I/O native hoàn tất; backup và chu kỳ 5 giây giảm rủi ro, không đảm bảo không mất giây cuối.

CI PR #1 trên GitHub không khởi chạy do tài khoản bị khóa vì billing issue (annotation GitHub, job không có bước thực thi). Đây không phải kết quả kiểm thử mã nguồn trên runner. Người dùng đã yêu cầu merge cả giai đoạn 1 và 2 sau kiểm chứng cục bộ; không thay đổi billing, Secrets hoặc cài đặt repo. Cần xử lý vấn đề tài khoản và chạy lại CI trước khi dựa vào GitHub Actions để build APK.
