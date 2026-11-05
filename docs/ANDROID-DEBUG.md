# APK debug · Giai đoạn 3

Ứng dụng: **Nhàn Vân**, package **com.nhanvan.game**, web đóng gói từ `dist/`. Game, font và plugin đã nằm trong app; không cấu hình server tải web từ xa.

## Tải bản cài thử

1. Mở [Actions của repo](https://github.com/An091004/game/actions), chọn **APK debug Nhàn Vân** và lần chạy đúng nhánh/commit. Workflow tự chạy khi push nhánh, kể cả nhánh PR.
2. Đợi job `apk` thành công. Ở cuối trang lần chạy, tải artifact **NhanVan-debug.apk** (giữ 14 ngày). GitHub tải artifact dưới dạng ZIP; giải nén lấy `NhanVan-debug.apk` và file SHA-256 đi kèm.
3. Chép APK vào điện thoại Android 7 trở lên. Mở file, cho phép ứng dụng đang mở file cài từ nguồn này nếu Android yêu cầu, rồi cài **Nhàn Vân**.
4. Khi workflow đã vào `main`, có thể vào **Actions → APK debug Nhàn Vân → Run workflow**, chọn nhánh rồi chạy lại. Trước khi merge, nếu chưa thấy nút chạy tay thì dùng lần chạy tự động từ push của PR; không cần thêm Secrets.

Nếu job không có bước thực thi và báo `The job was not started because your account is locked due to a billing issue.`, chủ tài khoản cần xử lý vấn đề billing trên GitHub, sau đó chọn **Re-run all jobs**. Repo không tự thay đổi billing hay cài đặt. Khi job chưa chạy thành công thì chưa có APK để tải.

## Quy trình build trên runner

`npm ci → typecheck → Vitest → Vite build → cap add android → patch-android → sinh asset → cap sync android → patch-android lần hai → assembleDebug → kiểm chữ ký → upload APK`.

- Node 24 theo `.nvmrc`, JDK Temurin 21. CLI/core/android stable 8.6.0, assets 4.0.0, splash-screen 8.0.2 được tra npm ngày 05/11/2026; `package-lock.json` khóa cây dependency.
- Gradle/Android Gradle Plugin lấy từ template Capacitor đang khóa: hiện Gradle 8.14.3, AGP 8.13.0; `minSdkVersion=24`, compile/target SDK 36. Workflow đọc `compileSdkVersion` trong template để cài SDK phù hợp. Đối chiếu [hướng dẫn Capacitor 8](https://capacitorjs.com/docs/updating/8-0).
- `android/`, JAR, PNG, APK và keystore chỉ sinh trong CI, không đưa vào Git. `assets/icon.svg` vẽ chữ 雲 bằng path, không cần font chữ Hán trên runner.
- `scripts/generate-android-assets.mjs` dùng `@capacitor/assets` với SVG theo [hướng dẫn chính thức](https://github.com/ionic-team/capacitor-assets). Kiểm tra kết quả để lỗi sinh ảnh không bị CLI exit 0 che mất. API nội bộ của công cụ được khóa bằng lockfile; cần kiểm lại khi nâng phiên bản.
- `scripts/patch-android.mjs` chỉ xử lý văn bản, kiểm các mẫu trước khi ghi, chạy lại an toàn. Đặt tên/ID, portrait, backup, quyền thông báo trong manifest, nền status/splash và cấu hình ký đọc biến môi trường. Chưa xin quyền hay lên lịch thông báo; đó là giai đoạn 6.
- `ANDROID_VERSION_NAME` lấy từ môi trường nếu có, mặc định `package.json.version`. `ANDROID_VERSION_CODE` dùng `github.run_number`, phải là số nguyên dương trong giới hạn Android. Chạy lại cùng run giữ versionCode; lần chạy mới tăng số.
- Cache npm và Gradle; quyền workflow chỉ `contents: read`; các Actions được chốt SHA của release chính thức. Mỗi nhánh hủy build cũ khi có push mới.

## Save, cài đè và khóa debug

Auto Backup gồm `CapacitorStorage.xml` chứa Preferences với hai ô save, cho cả Android 11 trở xuống và Android 12 trở lên, gồm cloud backup và chuyển thiết bị. Chỉ cấu hình khả năng sao lưu: việc khôi phục còn phụ thuộc tài khoản, cài đặt, lịch backup và thiết bị. Xem [Android Auto Backup](https://developer.android.com/identity/data/autobackup).

APK dùng khóa **debug** sinh trong runner, mật khẩu debug mặc định của Android. Workflow cache riêng khóa này để lần sau cùng nhánh có thể ký cùng chứng chỉ. Khóa debug chỉ dành cho cài thử, không dùng phát hành. Không có khóa release hoặc bí mật nào trong Git hay artifact APK.

Android chỉ chấp nhận cập nhật khi package/chứng chỉ phù hợp. Cache GitHub có phạm vi nhánh và có thể bị xóa; chuyển từ nhánh PR sang `main`, đổi nhánh khác hoặc mất cache có thể tạo khóa debug khác. Vì vậy **chưa đảm bảo cài đè giữa mọi lần build**. Nếu báo không cài được bản cập nhật, giữ app hiện tại và xuất save Base64 trước; không gỡ app/xóa dữ liệu khi chưa sao lưu. Tới giai đoạn 7 sẽ dùng khóa release bền vững. Tham khảo [ký ứng dụng Android](https://developer.android.com/studio/publish/app-signing) và [phạm vi cache GitHub](https://docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching).

Script Gradle đã có điểm đọc `ANDROID_KEYSTORE_PATH`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`; thiếu cấu hình sẽ chặn task release. Chưa có workflow release, giải mã base64 hay thao tác thêm Secrets ở giai đoạn này.

## Cần kiểm tra trên điện thoại

1. Tu luyện, đợi trên 5 giây, vuốt tắt và mở lại: tài nguyên còn, thông báo bế quan hợp lý.
2. Bật chế độ máy bay: mở/chơi được, font tiếng Việt đúng.
3. Ra màn hình chính, nhận cuộc gọi rồi quay lại: không cộng linh khí hai lần.
4. Xuất save trước; cài đè APK mới có cùng chứng chỉ, kiểm tra tiến trình.
5. Gửi ảnh màn Tu luyện và Sao lưu, kèm phiên bản Android, model máy, tên nhánh và số run.

Đây là khung native đầu tiên. Thanh điều hướng dưới, safe area hoàn chỉnh và nút Back hai lần để thoát thuộc giai đoạn 4. Chưa đo thời gian khởi động, dung lượng APK hoặc kiểm thử khôi phục Auto Backup thực tế. Không build Gradle/SDK trong sandbox.
