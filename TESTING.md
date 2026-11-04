# Kiểm chứng giai đoạn 1

Ngày: 04/11/2026. Môi trường chạy thực tế: Windows, Node 24.22.1, npm 12.2.1. Các lệnh npm/npx dùng CLI npm chính thức tải tạm trong repo vì máy chạy tác vụ không có npm sẵn trên PATH.

| Lệnh | Kết quả |
| --- | --- |
| npm ci | Đạt; cài 41 packages, audit 42 packages, 0 vulnerabilities |
| npx tsc --noEmit | Đạt, strict mode, không bỏ kiểm tra bằng ts-nocheck |
| npx vitest run | Đạt 30/30 test |
| npm run build | Đạt; Vite tạo dist với HTML/CSS/JS và font cục bộ |

Vitest đối chiếu cấu hình, nội dung và công thức ở toàn bộ 18 bước tiến trình với bản HTML v1; kiểm tra giữ save v1, mốc linh điền, delta time, giới hạn 8 giờ, buff và khóa ghi khi dữ liệu/lệnh đọc save lỗi.

Kiểm tra bổ sung bằng Edge 156.0.4314.58 trong hồ sơ tạm: bản build phục vụ dưới /game/, tĩnh tọa/tick, nhập save v1, giữ nút thiên kiếp, 7 tab, nâng công pháp, du ngoạn, lưu sau tải lại, sáng/tối, thu hoạch và dùng đan. Timer thu hoạch/luyện đan được giả lập bằng save thử.

Đã kiểm tra bố cục 1440px, 390px và 320px; hai khổ điện thoại không tràn ngang toàn trang. Thanh tab ngang v1 vẫn cuộn trong vùng riêng, sẽ đổi ở giai đoạn 4. Không có lỗi JavaScript và không có yêu cầu HTTP ra ngoài máy chủ cục bộ.

Kiểm tra save hỏng trên trình duyệt: giữ nguyên chuỗi lỗi trong localStorage sau khởi động và tĩnh tọa, không ghi đè state rỗng.

Chưa xác nhận kết quả GitHub Actions; chủ repo kiểm tra sau khi PR được tạo. Chưa chạy Android/Gradle, chưa cài APK hoặc thử trên điện thoại thật. Âm thanh chưa kiểm tra bằng nghe thực tế. SaveManager hai ô/migrations và phục hồi Android không nằm trong giai đoạn này.
