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
| 3. Capacitor + APK debug | PR #3 đang mở; đã triển khai, APK tạm hoãn theo yêu cầu ngày 10/11/2026 |
| 4. Giao diện Android | Đã triển khai và kiểm chứng web; chờ duyệt PR và thử Android khi có APK |
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

1. Chủ repo duyệt PR #3 và PR giai đoạn 4. PR giai đoạn 4 đặt base vào nhánh giai đoạn 3 để diff chỉ chứa giao diện; sau khi merge #3, chuyển base PR giai đoạn 4 về main và kiểm tra lại diff trước khi merge. Agent chưa merge các PR này.
2. APK tiếp tục tạm hoãn. Khi sẵn sàng, xử lý việc Actions không khởi chạy và chạy thủ công workflow đúng nhánh; theo docs/ANDROID-DEBUG.md. Không cần đổi billing/Secrets/cài đặt repo trong giai đoạn 4.
3. Giữ bản xuất Base64 trước khi cài đè/đổi nơi chơi; thử Back, safe area và giao diện sáng/tối trên điện thoại khi có APK.
4. Bước phát triển tiếp theo là giai đoạn 5: nhân vật SVG và tab Nhân vật, chỉ triển khai khi người dùng yêu cầu.

## Giai đoạn 3

- Nhánh codex/giai-doan-3-capacitor-debug. Capacitor config JSON: com.nhanvan.game, tên Nhàn Vân, webDir dist, không remote server. JSON được CLI đọc trực tiếp; game vẫn TypeScript.
- Bổ sung CLI/android 8.6.0, assets 4.0.0, splash-screen 8.0.2 từ npm stable ngày 05/11/2026. JDK 21, Node 24; Gradle/AGP/SDK theo template khóa trong lockfile.
- patch-android.mjs đặt versionName/versionCode, portrait, Auto Backup chỉ Preferences (Android trước/sau 12), quyền POST_NOTIFICATIONS trong manifest, status/splash và script ký đọc env. Kiểm mẫu trước ghi, chạy lại an toàn; không sửa logic game.
- Icon 雲 là SVG path tự vẽ. Công cụ assets sinh PNG trên runner; wrapper xác nhận đầu ra thay vì bỏ qua lỗi CLI exit 0. Không đưa PNG/JAR/android/ vào Git.
- Workflow android-debug.yml chạy khi push nhánh và chạy tay khi workflow đã hiện trên main; build web, sinh Android, vá, tạo asset, sync, assembleDebug, kiểm chữ ký, upload APK + SHA-256 giữ 14 ngày. Cache npm/Gradle và khóa debug; không thêm Secrets hay cấu hình phát hành.
- Thêm 15 test vá template Android thực, tổng 86/86 test đạt; npm ci, tsc, build web và actionlint đạt. Render xem trước icon SVG đạt. Không chạy cap add, Gradle hoặc SDK trong sandbox.
- npm audit báo 4 moderate trong chuỗi dev assets → trapezedev → xcode → uuid; npm audit --omit=dev báo 0. Không dùng audit fix --force để hạ assets về bản cũ. Cần theo dõi upstream, không coi audit toàn bộ là sạch.
- Tài liệu cài thử ở docs/ANDROID-DEBUG.md. Bản APK đầu tiên và kiểm thử Android thật còn phụ thuộc Actions chạy thành công; không đánh dấu giai đoạn 3 hoàn tất nghiệm thu chỉ dựa vào test cục bộ.
- [PR #3](https://github.com/An091004/game/pull/3) đang mở để chủ repo duyệt. [Lần build APK đầu tiên](https://github.com/An091004/game/actions/runs/41955524774) ngày 05/11/2026 kết thúc failure nhưng job có 0 bước: GitHub báo tài khoản bị khóa vì billing. Chưa chạy Gradle, chưa có artifact. CI web cùng commit cũng bị chặn tương tự.

## Giới hạn

Hai ô cùng hỏng sẽ dừng khởi tạo, chưa có màn nhập file phục hồi riêng. Callback lưu native không bảo đảm hoàn tất nếu hệ điều hành cưỡng bức dừng ngay lập tức. Kiểm tra adapter giả lập không thay thế thử force-stop/cài đè/Auto Backup trên Android. Native/web khác origin không tự chia sẻ save. CRC32 không phải chữ ký chống sửa dữ liệu. Nhân vật và hiệu ứng rung vẫn chờ đúng giai đoạn tương ứng.

## Giai đoạn 4

- Ngày 10/11/2026 người dùng yêu cầu bỏ qua bước build app và tiếp tục bước kế tiếp. Yêu cầu này cho phép làm giai đoạn 4 dù giai đoạn 3 chưa có APK; không thay nội dung kế hoạch gốc và không đánh dấu APK đã nghiệm thu.
- Nhánh `codex/giai-doan-4-mobile-ui` nối từ `codex/giai-doan-3-capacitor-debug` tại 2dcdea2. PR #3 còn mở khi bắt đầu; main vẫn chứa giai đoạn 1 và 2.
- Bốn mục dưới đáy, Thêm chứa các trang phụ và Sao lưu; icon SVG nội bộ, font npm tiếng Việt sẵn có. Không thêm tab Nhân vật trước giai đoạn 5.
- Safe area bốn cạnh, modal cuộn trong chiều cao màn hình, vùng chạm tối thiểu 44px. Màn hình lớn giữ thanh bên. Giữ phong cách xanh đen/vàng đồng và toàn bộ cân bằng, nội dung gốc.
- Quản lý lớp hộp thoại, chặn thao tác nền bằng inert, giữ Tab trong modal và trả focus khi đóng. Back Android đóng lớp trên cùng trước; màn phụ → Thêm → Tu luyện; Back hai lần trong 2 giây ở Tu luyện mới thoát và chờ flush thành công. Reset khi đổi trang/xuống nền; chống gọi thoát lặp trong khi đang lưu.
- Cài đặt lưu cùng save: sáng/tối, cỡ chữ, nhạc, cho phép rung, tiết kiệm pin. Thêm trường tùy chọn tương thích v1/v2, không đổi saveVersion; dữ liệu sai kiểu bị từ chối. Hiệu ứng rung thực tế thuộc giai đoạn 6.
- Tách music/mobile/dialogs/native thành module. Nhạc khởi động sau thao tác, dừng khi ở nền; hiệu ứng nền tối đa 40 hạt, tối đa 30fps, hủy RAF khi ở nền/tiết kiệm pin/reduced-motion. SystemBars của Capacitor 8 đổi biểu tượng theo theme; portrait và splash giữ cấu hình giai đoạn 3.
- `android-debug.yml` chỉ chạy tay để hoãn APK; không đổi Secrets, billing hoặc cài đặt GitHub. CI web vẫn chạy theo push/PR.
- Kiểm chứng: 108/108 Vitest trong 6 file, typecheck/build đạt; 10 nhóm kiểm tra Edge 157.0.4341.42 đạt, gồm 320/390/844/850/1280px, cỡ chữ 120%, modal chồng nhau, save cũ, âm thanh và tiết kiệm pin. Chi tiết và kết quả chuỗi lệnh cuối ở TESTING.md.
- Chưa build hay thử APK. Safe area mô phỏng và adapter Back/SystemBars không thay thế kiểm thử WebView/điện thoại thật; đặc biệt cần kiểm tra màu thanh hệ thống ở WebView cũ.
