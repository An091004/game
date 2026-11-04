# NHIỆM VỤ: Chuyển game web "Nhàn Vân" thành ứng dụng Android (APK)

Bạn là kỹ sư phần mềm làm việc trong Codex cloud, trên đúng một repo GitHub. Mục tiêu cuối: từ game web tu tiên "Nhàn Vân" (HTML/CSS/JS), tạo ra ứng dụng Android và build ra file APK đã ký bằng GitHub Actions để tôi tải về cài lên điện thoại. Đây là game chơi một mình để thư giãn: không áp lực, không hình phạt.

Chỉ làm đúng giai đoạn này. Đọc `AGENTS.md` và `docs/PROGRESS.md` (nếu đã có) để biết các giai đoạn trước đã xong chưa. Nếu giai đoạn trước chưa xong thì dừng lại và báo tôi.

Repo: `<OWNER>/<REPO>`. Nhánh chính: `main`. Code web hiện tại nằm ở: `<ĐƯỜNG_DẪN>`.

## 0. Phạm vi và cách làm việc (RÀNG BUỘC BẮT BUỘC)
Phạm vi:
- Chỉ thêm, sửa, xóa file bên trong repo này. Không làm gì ngoài repo, không giả định có quyền truy cập máy của tôi.
- Mọi thay đổi nằm trong nhánh và PR do bạn tạo. KHÔNG tự merge vào `main`; tôi sẽ merge.
- Chỉ xóa file do dự án này tạo ra hoặc không còn dùng, ghi lý do trong mô tả PR. Code web cũ chỉ được xóa hoặc di chuyển sau khi bản mới đã build thành công.
- Không đụng vào cài đặt repo, Secrets/Variables, hay repo khác. Không commit bí mật (keystore, mật khẩu, token, khóa API). Không yêu cầu tôi dán token vào bất cứ đâu.
- Không force-push, không viết lại lịch sử.

Môi trường:
- Trong sandbox của bạn, được chạy lệnh để kiểm chứng: `npm ci` (hoặc `npm install` nếu chưa có lockfile), `npx tsc --noEmit`, `npx vitest run`, `npm run build`. Chạy đủ trước khi kết thúc và ghi kết quả thật vào mô tả PR. Nếu sandbox không có mạng tới npm thì nói rõ, đừng giả vờ đã chạy.
- KHÔNG build Android (Gradle, Android SDK) trong sandbox. Việc đó do GitHub Actions làm sau khi PR được tạo.
- Repo chỉ chứa file văn bản. Không commit file nhị phân (PNG, `.jar`, `.jks`, `.apk`, font...). Thư mục `android/` KHÔNG commit: CI sinh ra bằng `npx cap add android` rồi vá bằng `scripts/patch-android.mjs`. Icon và splash sinh trong CI từ `assets/icon.svg`. Font lấy từ npm (`@fontsource`).
- Nếu không tạo/sửa được file trong `.github/workflows/` (thiếu quyền), đặt file vào `ci-pending/`, kèm hướng dẫn để tôi chép tay lên GitHub, và nêu rõ ở đầu mô tả PR.
- Bạn không thấy kết quả của GitHub Actions. Nếu ở lần chạy sau tôi dán log lỗi, hãy sửa theo log đó, đừng đoán.
- Bạn không thấy giao diện thật trên điện thoại. Tôi sẽ cài APK debug và gửi ảnh chụp màn hình để bạn chỉnh. Tùy chọn: job CI chụp ảnh màn hình bản web (khổ 390x844) bằng Playwright rồi upload làm artifact.
- PR nhỏ, tập trung. Tiêu đề và mô tả bằng tiếng Việt, gồm: đã làm gì, đã kiểm chứng gì (kèm kết quả lệnh), việc tôi cần tự làm, rủi ro.
- Viết TypeScript đơn giản, tránh cấu hình phức tạp. Không ghi cứng số phiên bản: dùng bản stable mới nhất của từng thư viện, theo tài liệu chính thức để chọn đúng Node, JDK, Gradle, Android SDK.
- Cuối mỗi giai đoạn, cập nhật `docs/PROGRESS.md` (đã xong gì, còn gì, quyết định đã chốt).

## 1. Giữ nguyên bản sắc hiện tại
Giữ phong cách thủy mặc tối xanh đen + vàng đồng, font serif, toàn bộ logic, số liệu cân bằng và nội dung chữ. Giao diện hiện có gồm: header (logo "雲", NHÀN VÂN, số linh thạch, nút sáng/tối, nhạc, A−/A+, sao lưu), các tab (Tu luyện, Công pháp, Du ngoạn, Động phủ, Luyện đan, Nhật ký tu hành), thẻ hero có núi + trăng + chữ dọc "VÂN DU TỰ TẠI", thẻ cảnh giới với thanh linh khí, tỉ lệ thành công, thọ nguyên, tâm pháp cộng hưởng.

## 2. Công nghệ
- Capacitor (Android) bọc web app. Không viết lại bằng React Native hay Flutter.
- Vite + TypeScript, không framework UI nặng. Tách module: `state`, `engine` (tick, đột phá, tính ngoại tuyến), `save`, `ui`, `character`, `data` (cấu hình cảnh giới, công pháp, sự kiện).
- Thư viện: `@capacitor/core`, `@capacitor/cli`, `@capacitor/android`, `@capacitor/preferences` (lưu save), `@capacitor/app` (vòng đời, nút Back), `@capacitor/local-notifications`, `@capacitor/haptics`, `@capacitor/status-bar`, `@capacitor/splash-screen`, `@capacitor/filesystem` + `@capacitor/share` (xuất/nhập save), `@capacitor/assets` (sinh icon/splash), `@fontsource/*` cho font đang dùng kèm subset `vietnamese`, `typescript`, `vite`, `vitest`. `playwright` chỉ nếu dùng job chụp ảnh.
- Không tải font hay script từ CDN: mọi thứ đóng gói vào app, chạy được khi tắt mạng.

## 3. Lưu tiến trình (sửa lỗi tắt mở là reset)
- Viết `SaveManager`:
  - Lưu bằng Capacitor Preferences; khi chạy dev trên trình duyệt thì fallback localStorage.
  - Có `saveVersion` và mảng `migrations` để save cũ luôn nâng cấp được.
  - Ghi theo kiểu 2 ô: ô chính + ô backup xoay vòng, kèm checksum.
  - Tự lưu mỗi 5 giây khi có thay đổi (debounce).
  - Lưu ngay (flush) khi app xuống nền (`appStateChange` isActive=false), khi `visibilitychange` sang hidden và khi `pagehide`.
- Khi mở app: đọc ô chính; hỏng thì đọc ô backup; cả hai hỏng thì báo rõ cho tôi và KHÔNG ghi đè bằng state rỗng. Tuyệt đối không để lỗi đọc dẫn tới ghi đè mất save.
- Tiến trình ngoại tuyến: lưu `lastSeenAt`. Khi mở lại hoặc quay về từ nền, tính `dt = clamp(now - lastSeenAt, 0, giớiHạn)`; đồng hồ bị lùi (dt âm) thì coi như 0. Tính bằng công thức đóng, không lặp từng giây. Hiện hộp thoại "Trong lúc bế quan, ngươi hấp thu được X linh khí".
- Nhật ký và các danh sách dài giới hạn số mục (ví dụ 500 mục mới nhất) để save không phình to.
- Xuất/nhập save: nút "Sao lưu" xuất file JSON qua Filesystem + Share; nhập bằng chọn file; kiểm tra hợp lệ và hỏi xác nhận trước khi ghi đè.
- Bật Android Auto Backup (`allowBackup` + backup rules gồm dữ liệu Preferences) để save có cơ hội khôi phục khi đổi máy.
- Viết test Vitest cho: serialize/deserialize, migration từ save cũ, tính ngoại tuyến (kể cả đồng hồ lùi), fallback khi ô chính hỏng. Test chạy trong `ci.yml`.

## 4. Giao diện di động
- Khung hình dọc, khóa portrait (qua `patch-android.mjs`).
- Thay thanh tab ngang (đang tràn và có thanh cuộn) bằng thanh điều hướng dưới đáy, tối đa 5 mục (gợi ý: Tu luyện, Nhân vật, Du ngoạn, Động phủ, Thêm; "Thêm" chứa Công pháp, Luyện đan, Nhật ký, Cài đặt).
- Thay emoji ở tab bằng bộ icon SVG nhúng sẵn, nét mảnh, màu vàng đồng, để đồng nhất trên mọi máy.
- Tôn trọng safe area (`viewport-fit=cover`, `env(safe-area-inset-*)`), vùng chạm tối thiểu 44px, không cuộn ngang.
- Xử lý nút Back của Android: đóng hộp thoại/modal trước; ở màn chính thì bấm Back hai lần để thoát.
- Cài đặt (lưu cùng save): sáng/tối, cỡ chữ A−/A+, nhạc, rung, chế độ tiết kiệm pin.
- Thanh trạng thái hòa màu với nền; splash nền xanh đen với chữ 雲.

## 5. Nhân vật (vẽ bằng code)
- Vẽ bằng SVG nhiều lớp, không dùng ảnh ngoài, phong cách thủy mặc tối giản đồng nhất với cảnh núi và trăng: bóng dáng tu sĩ có tóc, áo choàng, đai lưng.
- Tham số hóa: tên, giới tính (nam/nữ/trung tính), kiểu tóc (3), màu áo (5). Chọn ở màn tạo nhân vật lần đầu, đổi được trong tab Nhân vật.
- Tư thế đổi theo hoạt động: Tu luyện = ngồi thiền trên tảng đá dưới trăng, thở nhẹ, linh khí xoáy vào đan điền; Du ngoạn = đi bộ qua núi; Luyện đan = ngồi bên lò có khói; Đột phá = ánh sáng bùng và sấm chớp nhẹ.
- Hào quang theo cảnh giới: Luyện Khí = quầng trắng mờ; Trúc Cơ = vòng xanh; Kết Đan = viên đan vàng sáng ở đan điền; Nguyên Anh = tiểu nhân phát sáng trên đỉnh đầu; các cảnh giới cao hơn thêm lớp hào quang, vòng sáng, hiệu ứng tăng dần. Độ sáng hào quang tỉ lệ với % linh khí hiện tại.
- Hoạt ảnh bằng CSS hoặc Web Animations API; tự dừng khi app xuống nền, khi bật tiết kiệm pin hoặc `prefers-reduced-motion`.
- Đặt nhân vật vào thẻ hero ở tab Tu luyện (ngồi dưới mặt trăng). Thêm tab "Nhân vật": hình nhân vật lớn, tên, cảnh giới, thọ nguyên, các chỉ số hiện có, tổng thời gian tu hành. Phần chưa có hệ thống thì hiện ô khóa mờ, không tự bịa logic mới.
- Nhân vật chỉ là lớp hiển thị đọc từ state, không thêm logic game. Thiết kế qua hàm `renderCharacter(state)` để sau này thay SVG bằng ảnh WebP theo lớp mà không sửa chỗ khác.

## 6. Thông báo và cảm giác
- Local notifications: "Đan đã luyện xong", "Linh thảo đã chín", "Trứng sắp nở" (nếu game có). Lên lịch theo mốc thời gian thật khi người chơi bắt đầu hành động. Xin quyền thông báo đúng cách cho Android 13 trở lên, có cài đặt tắt. Dùng giờ báo không quá chính xác để tránh xin quyền báo thức chính xác.
- Haptics nhẹ khi đột phá và hoàn thành đan. Âm thanh Web Audio chỉ bắt đầu sau thao tác chạm đầu tiên và tự tắt khi app xuống nền.

## 7. Hiệu năng và pin
- Hạt linh khí bằng canvas giới hạn khoảng 40 hạt, dùng `requestAnimationFrame`, dừng khi ẩn app.
- Vòng lặp game dùng delta time thực. Chế độ tiết kiệm pin: giảm hiệu ứng, hạ xuống 30fps.
- Mục tiêu: mở app dưới 2 giây trên máy tầm trung, APK dưới khoảng 15MB.

## 8. Backend (tùy chọn, chỉ giai đoạn 8)
Mặc định game là local-first, không cần mạng.
- Dùng Supabase (Auth + Postgres). Bảng `saves(user_id uuid, slot text, data jsonb, save_version int, progress_score numeric, updated_at timestamptz, device_id text)`, khóa chính (user_id, slot), bật RLS để chỉ chủ sở hữu đọc/ghi. Trong app chỉ dùng anon key, tuyệt đối không nhúng service_role key. File SQL tạo bảng và policy đặt trong repo để tôi tự chạy trong Supabase.
- Đăng nhập bằng email (magic link/OTP), không dùng anonymous login vì cài lại app sẽ mất tài khoản.
- Đồng bộ: đẩy lên khi app xuống nền và mỗi vài phút nếu có thay đổi; kéo về khi mở app. Xung đột thì so `progress_score` và `updated_at`, không bao giờ tự ghi đè bản tiến xa hơn bằng bản kém hơn: hiện hộp thoại cho tôi chọn.
- Offline vẫn chơi bình thường; lỗi đồng bộ không được làm hỏng save local.
- Nếu tôi không muốn dùng dịch vụ ngoài: thay bằng Fastify + SQLite với cùng giao thức.

## 9. Build APK trên GitHub Actions
Workflow trong `.github/workflows/`:
1. `ci.yml`: khi push và PR: cài phụ thuộc (`npm ci` nếu có `package-lock.json`, không thì `npm install`), typecheck, Vitest, `npm run build`.
2. `android-debug.yml`: khi push lên nhánh PR hoặc chạy tay: setup Node + JDK, cài phụ thuộc, `npm run build`, `npx cap add android`, `node scripts/patch-android.mjs`, sinh icon/splash bằng `@capacitor/assets` từ `assets/icon.svg` (nếu công cụ không nhận SVG thì chuyển SVG sang PNG ngay trong CI, không commit), `npx cap sync android`, `./gradlew assembleDebug`, upload artifact `NhanVan-debug.apk` (giữ 14 ngày).
3. `android-release.yml`: khi push tag `v*` hoặc chạy tay: như trên nhưng `assembleRelease` đã ký, đổi tên `NhanVan-vX.Y.Z.apk`, đính kèm GitHub Release và upload artifact. Thiếu secrets thì fail với thông báo tiếng Việt chỉ rõ tôi cần làm gì.
4. `generate-keystore.yml` (chạy tay đúng một lần): chỉ chạy khi repo là private (`github.event.repository.private == true`, nếu không thì fail). Tạo keystore bằng `keytool` với mật khẩu ngẫu nhiên, KHÔNG in mật khẩu ra log, đóng gói vào artifact giữ 1 ngày gồm `keystore.base64.txt` và `info.txt` (alias và các mật khẩu).
Chung: JDK và Node đúng phiên bản theo tài liệu Capacitor đang dùng; cache npm và Gradle; `permissions` tối thiểu; `concurrency` để hủy lần chạy cũ trên cùng nhánh; `chmod +x android/gradlew` nếu cần.

`scripts/patch-android.mjs` (Node thuần, chạy lại nhiều lần vẫn an toàn) làm: đặt `applicationId`, `versionName`, `versionCode` (từ biến môi trường), khóa portrait, bật `allowBackup` + backup rules, khai báo quyền thông báo, cấu hình ký release đọc từ biến môi trường, màu status bar và splash. Nếu không tìm thấy mẫu cần vá thì fail với thông báo rõ ràng.

Ký APK và phát hành:
- Release đọc 4 secrets: `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`.
- Hướng dẫn tôi từng bước trên giao diện web GitHub (viết vào `docs/HUONG-DAN.md`): chạy `generate-keystore`, tải artifact, thêm 4 secrets, sao lưu keystore ở nơi an toàn ngoài GitHub, xóa artifact và xóa file `generate-keystore.yml`, tạo tag phát hành, tải APK từ Actions hoặc Releases, bật cài app từ nguồn ngoài trên điện thoại.
- Package id `com.nhanvan.game`, tên app "Nhàn Vân", `versionName` theo semver, `versionCode` tăng tự động theo `github.run_number` để cài đè được mà không mất save.
- Ảnh nguồn icon: `assets/icon.svg` (chữ 雲 trên nền xanh đen, viền vàng đồng), tự vẽ bằng SVG.

## 10. Các giai đoạn (mỗi giai đoạn = một PR)
1. Dựng Vite + TypeScript, đưa code web hiện tại vào, `ci.yml`, `AGENTS.md`, `docs/PLAN.md` (lưu nguyên văn prompt này, bỏ dòng chọn giai đoạn), `docs/PROGRESS.md`, `.gitignore`. Web chạy giống hệt trước.
2. SaveManager + tiến trình ngoại tuyến + test Vitest (sửa lỗi reset).
3. Capacitor + `scripts/patch-android.mjs` + `assets/icon.svg` + `android-debug.yml`, để Actions ra APK debug đầu tiên cho tôi cài thử.
4. Giao diện di động (thanh điều hướng dưới, icon SVG, font nhúng, safe area, nút Back).
5. Nhân vật và tab Nhân vật.
6. Thông báo, haptics, xuất/nhập save.
7. `generate-keystore.yml` + `android-release.yml` + `docs/HUONG-DAN.md`.
8. (Tùy chọn) Đồng bộ đám mây.

## 11. Tiêu chí hoàn thành mỗi giai đoạn
- Đã chạy trong sandbox và báo kết quả thật: typecheck, Vitest, build web.
- PR có mô tả đầy đủ, `docs/PROGRESS.md` đã cập nhật, không có file nhị phân hay bí mật.
- Kiểm tra cuối cùng trên điện thoại do tôi làm: vuốt tắt hẳn app rồi mở lại, tiến trình còn nguyên và hiện lời chào bế quan; bật chế độ máy bay vẫn chạy, font đúng; cài đè APK mới thì save còn; nút Back đúng; không cuộn ngang.
- Cuối mô tả PR ghi rõ "Việc tôi cần làm tiếp" (merge, chạy workflow nào, thêm secrets nào, gửi ảnh chụp nào).