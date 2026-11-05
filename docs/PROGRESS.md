# Tiến độ Nhàn Vân

## Bối cảnh đã chốt

- Repo: An091004/game; nhánh chính main.
- Bản nguồn: index.html tại commit 473f97f; giữ bản nguyên gốc ở legacy/index.html sau khi build Vite đầu tiên thành công.
- Giai đoạn 1 và 2 đã merge vào main qua PR #1/#2, main tại 4d1c90b khi bắt đầu giai đoạn 3 ngày 05/11/2026.
- Giai đoạn 2 ở codex/giai-doan-2-save-manager, ban đầu nối tiếp PR #1. Ngày 04/11/2026 người dùng cho phép agent merge riêng cả PR giai đoạn 1 và 2 sau khi hoàn tất kiểm chứng; không áp dụng quyền này cho giai đoạn sau. Trạng thái merge thực tế xem trên GitHub.

## Trạng thái

| Giai đoạn | Trạng thái |
| --- | --- |
| 1. Vite + TypeScript + CI + tài liệu | Đã merge PR #1 |
| 2. SaveManager + ngoại tuyến + tests | Đã merge PR #2 |
| 3. Capacitor + APK debug | Đã triển khai và kiểm chứng cục bộ; chờ Actions build APK và thử trên điện thoại |
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

1. Chủ repo duyệt PR giai đoạn 3; quyền merge trước đó chỉ dành cho giai đoạn 1 và 2.
2. Xử lý khóa tài khoản GitHub do billing issue, chạy lại CI và workflow APK debug. Khi bắt đầu giai đoạn này, lần chạy gần nhất trên main vẫn không có bước thực thi vì billing.
3. Tải artifact NhanVan-debug.apk khi build thành công và làm theo docs/ANDROID-DEBUG.md; chưa cần Secrets ký release.
4. Giữ bản xuất Base64 trước khi cài đè/đổi nơi chơi. Khóa debug cache theo nhánh không thay thế khóa release bền vững.
5. Gửi ảnh/log thử APK trước khi sang giai đoạn 4.

## Giai đoạn 3

- Nhánh codex/giai-doan-3-capacitor-debug. Capacitor config JSON: com.nhanvan.game, tên Nhàn Vân, webDir dist, không remote server. JSON được CLI đọc trực tiếp; game vẫn TypeScript.
- Bổ sung CLI/android 8.6.0, assets 4.0.0, splash-screen 8.0.2 từ npm stable ngày 05/11/2026. JDK 21, Node 24; Gradle/AGP/SDK theo template khóa trong lockfile.
- patch-android.mjs đặt versionName/versionCode, portrait, Auto Backup chỉ Preferences (Android trước/sau 12), quyền POST_NOTIFICATIONS trong manifest, status/splash và script ký đọc env. Kiểm mẫu trước ghi, chạy lại an toàn; không sửa logic game.
- Icon 雲 là SVG path tự vẽ. Công cụ assets sinh PNG trên runner; wrapper xác nhận đầu ra thay vì bỏ qua lỗi CLI exit 0. Không đưa PNG/JAR/android/ vào Git.
- Workflow android-debug.yml chạy khi push nhánh và chạy tay khi workflow đã hiện trên main; build web, sinh Android, vá, tạo asset, sync, assembleDebug, kiểm chữ ký, upload APK + SHA-256 giữ 14 ngày. Cache npm/Gradle và khóa debug; không thêm Secrets hay cấu hình phát hành.
- Thêm 15 test vá template Android thực, tổng 86/86 test đạt; npm ci, tsc, build web và actionlint đạt. Render xem trước icon SVG đạt. Không chạy cap add, Gradle hoặc SDK trong sandbox.
- npm audit báo 4 moderate trong chuỗi dev assets → trapezedev → xcode → uuid; npm audit --omit=dev báo 0. Không dùng audit fix --force để hạ assets về bản cũ. Cần theo dõi upstream, không coi audit toàn bộ là sạch.
- Tài liệu cài thử ở docs/ANDROID-DEBUG.md. Bản APK đầu tiên và kiểm thử Android thật còn phụ thuộc Actions chạy thành công; không đánh dấu giai đoạn 3 hoàn tất nghiệm thu chỉ dựa vào test cục bộ.

## Giới hạn

Hai ô cùng hỏng sẽ dừng khởi tạo, chưa có màn nhập file phục hồi riêng. Callback lưu native không bảo đảm hoàn tất nếu hệ điều hành cưỡng bức dừng ngay lập tức. Kiểm tra adapter giả lập không thay thế thử force-stop/cài đè/Auto Backup trên Android. Native/web khác origin không tự chia sẻ save. CRC32 không phải chữ ký chống sửa dữ liệu. Thanh điều hướng và nhân vật vẫn chờ đúng giai đoạn tương ứng.
