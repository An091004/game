# Nhàn Vân · Tu Tiên Ký

Game tu tiên idle một người chơi, giao diện tiếng Việt, phong cách thủy mặc xanh đen và vàng đồng. Linh khí tự tích lũy, có 10 đại cảnh giới, 36 sự kiện du ngoạn và 26 thành tựu.

Repository: [An091004/game](https://github.com/An091004/game).

## Chạy web

Cài Node.js 24, mở terminal tại thư mục repo:

```sh
npm ci
npm run dev
```

Mở địa chỉ Vite in trong terminal. Bản mới dùng Vite nên cần chạy qua HTTP; không mở trực tiếp file HTML ở gốc. Bản HTML v1 độc lập được giữ tại `legacy/index.html` để tham chiếu và kiểm tra tương thích.

## Kiểm chứng và build

```sh
npx tsc --noEmit
npx vitest run
npm run build
npm run preview
```

Build tạo thư mục `dist/`. Font Noto Serif và Be Vietnam Pro (Latin + tiếng Việt) đi kèm bản build từ npm, không cần CDN. Không commit `dist/`, font nhị phân, `node_modules/` hoặc thư mục `android/`.

Nếu triển khai website, phục vụ **nội dung dist/** bằng hosting tĩnh. Không dùng chế độ GitHub Pages đọc trực tiếp nhánh main như bản HTML cũ. `base: './'` cho phép phục vụ dưới đường dẫn con như `/game/`. Hiện chỉ có CI kiểm tra, chưa thêm workflow triển khai Pages.

## Mã nguồn

- `src/data/`: cảnh giới, hệ số cân bằng, công pháp, sự kiện, thành tựu và chuỗi hiển thị.
- `src/state/`: kiểu dữ liệu và state ban đầu.
- `src/engine/`: công thức tu luyện, chi phí và tính linh khí theo thời gian.
- `src/save/`: SaveManager hai ô, checksum CRC32, migration v1 → v2 và adapter Preferences/localStorage.
- `src/ui/`: điều phối thao tác, render, định dạng và hiệu ứng nền.
- `src/main.ts`, `src/styles.css`, `index.html`: điểm vào, giao diện và khung HTML.
- `tests/`: đối chiếu với HTML v1 và kiểm tra bảo vệ save.
- `legacy/index.html`: bản gốc bất biến dùng làm mốc đối chiếu; không được đưa vào dist.
- `docs/PLAN.md`, `docs/PROGRESS.md`: kế hoạch đầy đủ và trạng thái từng giai đoạn.

Module nhân vật sẽ thêm ở giai đoạn 5. Các thao tác game hiện vẫn được điều phối trong `src/ui/game.ts`; những giai đoạn tiếp theo tách tiếp tại nơi có thay đổi, tránh thay toàn bộ logic một lượt.

## Bản lưu và chuyển từ web cũ

Giai đoạn 2 dùng hai khóa `nhan_van_save_main` và `nhan_van_save_backup`. Mỗi ô chứa payload JSON cùng checksum CRC32; payload có `saveVersion: 2` và `lastSeenAt`. CRC32 phát hiện dữ liệu hỏng, không chống người chơi tự sửa save.

Trên Android, adapter dùng Capacitor Preferences. Trên web, adapter dùng localStorage trực tiếp để có thể flush đồng bộ khi pagehide. Nếu Preferences lỗi, game khóa ghi; không tự đổi sang một kho rỗng.

Game đọc ô chính, hỏng thì đọc backup. Nếu cả hai không hợp lệ hoặc lệnh đọc lỗi, game dừng khởi tạo và giữ nguyên dữ liệu. Save từ phiên bản mới hơn cũng khóa ghi, tránh tự hạ phiên bản bằng backup cũ. Mỗi lần ghi giữ bản hợp lệ trước ở backup rồi ghi ô chính, đọc lại xác nhận và xếp tuần tự các lần ghi bất đồng bộ.

Khi chưa có hai ô mới, game tìm khóa v1 `nhan_van_tu_tien_ky_v1`, nâng cấp và giữ nguyên khóa cũ. Khi đã có dữ liệu mới bị hỏng, game không tự quay về khóa v1 có thể đã lỗi thời. Nếu đổi origin (file HTML/website/cổng dev/ứng dụng Android), cần xuất và nhập thủ công; dữ liệu local của các origin không tự chia sẻ.

Tự lưu gom thay đổi trong tối đa 5 giây; tick liên tục không kéo dài mãi hạn lưu. Flush ngay khi xuống nền, visibilitychange hidden và pagehide. Khi mở hoặc quay lại, cộng tối đa 8 giờ bằng công thức, không lặp từng giây. Mốc lastSeenAt không lùi khi đồng hồ bị chỉnh về trước; sự kiện resume trùng không cộng hai lần.

Sao lưu Base64 hiện xuất cả envelope/checksum, vẫn nhập được Base64 v1 và hỏi xác nhận trước khi thay thế. Save mới không nhập ngược vào HTML v1. Xuất/nhập file qua Filesystem + Share để giai đoạn 6.

Nếu gặp cảnh báo không ghi được, hãy xuất giữ tiến độ đang có trước khi tải lại. Nếu cả hai ô hỏng, đừng xóa dữ liệu ứng dụng: giữ nguyên các giá trị hai khóa để kiểm tra. Khi đã phát hiện ô chính thay đổi từ phiên khác, phiên hiện tại dừng ghi. Hai ô và checksum không thay thế bản sao lưu ngoài thiết bị, không đảm bảo khôi phục sau gỡ app/xóa dữ liệu.

## Android

Giai đoạn 2 đã có plugin core/preferences/app cho lưu và vòng đời, nhưng chưa sinh dự án Android hoặc APK. APK debug đầu tiên dự kiến ở giai đoạn 3 và chỉ build bằng GitHub Actions. Xem [tiến độ](docs/PROGRESS.md) trước khi làm tiếp. Chủ repo duyệt và merge từng PR; agent không merge main.

## Kiểm thử và giấy phép

Xem [kết quả kiểm tra](TESTING.md). Chưa gán giấy phép mã nguồn mở cho code dự án. Giấy phép OFL của hai font được giữ trong `public/licenses/` và sao chép vào bản build.
