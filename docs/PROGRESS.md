# Tiến độ Nhàn Vân

## Bối cảnh đã chốt

- Repo: An091004/game; nhánh chính main.
- Bản nguồn: index.html tại commit 473f97f; giữ bản nguyên gốc ở legacy/index.html sau khi build Vite đầu tiên thành công.
- Lần chạy đầu hoàn tất giai đoạn 1; lần hiện tại thực hiện giai đoạn 2 theo xác nhận của người dùng.
- Giai đoạn 2 ở codex/giai-doan-2-save-manager, ban đầu nối tiếp PR #1. Ngày 04/11/2026 người dùng cho phép agent merge riêng cả PR giai đoạn 1 và 2 sau khi hoàn tất kiểm chứng; không áp dụng quyền này cho giai đoạn sau. Trạng thái merge thực tế xem trên GitHub.

## Trạng thái

| Giai đoạn | Trạng thái |
| --- | --- |
| 1. Vite + TypeScript + CI + tài liệu | Hoàn tất triển khai và kiểm chứng cục bộ (PR #1) |
| 2. SaveManager + ngoại tuyến + tests | Hoàn tất triển khai và kiểm chứng cục bộ; người dùng yêu cầu merge |
| 3. Capacitor + APK debug | Chưa bắt đầu |
| 4. Giao diện Android | Chưa bắt đầu |
| 5. Nhân vật SVG | Chưa bắt đầu |
| 6. Notifications/haptics/save file | Chưa bắt đầu |
| 7. Ký và phát hành APK | Chưa bắt đầu |
| 8. Đồng bộ (tùy chọn) | Chưa bắt đầu |

## Giai đoạn 1

- Vite + TypeScript strict; tách state, công thức engine, bộ đọc save v1, giao diện và data. Toàn bộ cấu hình/nội dung gốc được giữ, các chuỗi nội suy UI ở src/data/text.ts.
- Không framework UI. Dùng phiên bản stable lấy từ npm khi thực hiện: Vite 8.3.5, TypeScript 7.0.2, Vitest 5.1.0; lockfile chốt bản đã kiểm tra, npm ci tái tạo cùng dependency tree.
- Node 24 trong .nvmrc và CI, tương thích engines của các package. Nguồn tham khảo: [Vite](https://vite.dev/guide/), [Vitest](https://vitest.dev/guide/), metadata npm của các package.
- CI push/PR với quyền contents: read, concurrency và cache npm; checkout/setup-node chốt SHA của release stable chính thức. Không workflow Android ở giai đoạn này.
- Font npm tự chứa Latin + tiếng Việt, không có CDN trong bản production. Font nhị phân chỉ được tạo trong node_modules/dist; public/licenses giữ văn bản OFL đi kèm.
- Giữ save v1 và khóa cũ. Bổ sung chốt khóa ghi khi đọc lỗi để tuân thủ AGENTS; chưa thay giao thức lưu, chưa có saveVersion mới, checksum, backup hoặc migrations.
- Xóa hai PNG xem trước đã được dự án tạo khỏi cây file nhánh này để đáp ứng chỉ commit văn bản; không viết lại lịch sử Git. Bản HTML cũ vẫn được giữ làm fixture đối chiếu.
- Kết quả: npm ci đạt; npx tsc --noEmit đạt; npx vitest run 30/30; npm run build đạt. Xem TESTING.md cho kiểm tra trình duyệt và giới hạn.

## Giai đoạn 2

- SaveManager dùng Preferences trên native, localStorage trên web; bổ sung core 8.6.0, preferences 8.0.1, app 8.1.2 theo bản stable npm. API theo [Preferences](https://capacitorjs.com/docs/apis/preferences) và [App](https://capacitorjs.com/docs/apis/app).
- Hai ô chính/backup có checksum CRC32; backup giữ bản hợp lệ trước; đọc lại xác nhận; hàng đợi ghi tránh đảo thứ tự. Không coi lỗi đọc là save mới và không fallback từ Preferences lỗi sang localStorage.
- Mảng migrations chuyển v1 sang saveVersion 2 với lastSeenAt, giữ khóa v1. Xác minh đủ dữ liệu trước chuẩn hóa, giới hạn journal/travel theo schema v1 (không quá 500). Save phiên bản tương lai khóa ghi.
- Gom thay đổi 5 giây có hạn chờ; flush trên nền/visibilitychange/pagehide. Web ghi đồng bộ; native dùng Promise và xử lý lỗi. Nếu phát hiện ô chính bị phiên khác sửa, dừng ghi.
- Dùng một công thức elapsed cho khởi động và resume, cap 8 giờ, giữ mốc khi đồng hồ lùi. Gộp trạng thái native/document/page tránh tính hai lần. Hộp thoại bế quan hiện khi vắng ít nhất 4 giây.
- Base64 mới chứa envelope; vẫn nhập v1, có xác nhận thay thế. Chưa thêm Filesystem/Share (giai đoạn 6).
- Xóa LegacyStorage của giai đoạn 1 vì đã thay bằng SaveManager; các test bảo vệ được thay bằng test sâu hơn. Giữ nguyên legacy/index.html làm fixture hồi quy.
- Kiểm chứng: npm ci, tsc, 71/71 Vitest, build đều đạt; 8 nhóm kiểm tra Edge đạt. Xem TESTING.md.
- Chưa sinh android/, chưa build Gradle. Auto Backup/backup rules sẽ thực hiện trong patch-android.mjs ở giai đoạn 3. Không tự nhận đã kiểm chứng trên điện thoại thật.

## Việc tiếp theo

1. Kiểm tra trạng thái merge hai PR trên GitHub; agent thực hiện theo yêu cầu rõ ràng trong chat.
2. Xử lý khóa tài khoản GitHub do billing issue rồi chạy lại CI; annotation hiện tại cho biết job chưa khởi chạy. Không cần dán token vào chat.
3. Khi muốn làm tiếp, yêu cầu giai đoạn 3 (Capacitor + APK debug). Chưa cần secrets ký release.
4. Giữ bản xuất Base64 trước khi đổi nơi chơi hoặc kiểm tra khôi phục.

## Giới hạn

Hai ô cùng hỏng sẽ dừng khởi tạo, chưa có màn nhập file phục hồi riêng. Callback lưu native không bảo đảm hoàn tất nếu hệ điều hành cưỡng bức dừng ngay lập tức. Kiểm tra adapter giả lập không thay thế thử force-stop/cài đè/Auto Backup trên Android. Native/web khác origin không tự chia sẻ save. CRC32 không phải chữ ký chống sửa dữ liệu. Thanh điều hướng và nhân vật vẫn chờ đúng giai đoạn tương ứng.
