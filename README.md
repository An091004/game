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

Nếu triển khai website, phục vụ **nội dung dist/** bằng hosting tĩnh. Không dùng chế độ GitHub Pages đọc trực tiếp nhánh main như bản HTML cũ. `base: './'` cho phép phục vụ dưới đường dẫn con như `/game/`. Giai đoạn 1 chỉ có CI kiểm tra, chưa thêm workflow triển khai Pages.

## Mã nguồn

- `src/data/`: cảnh giới, hệ số cân bằng, công pháp, sự kiện, thành tựu và chuỗi hiển thị.
- `src/state/`: kiểu dữ liệu và state ban đầu.
- `src/engine/`: công thức tu luyện, chi phí và tính linh khí theo thời gian.
- `src/save/`: đọc save v1, chuẩn hóa và chốt bảo vệ khi đọc lỗi.
- `src/ui/`: điều phối thao tác, render, định dạng và hiệu ứng nền.
- `src/main.ts`, `src/styles.css`, `index.html`: điểm vào, giao diện và khung HTML.
- `tests/`: đối chiếu với HTML v1 và kiểm tra bảo vệ save.
- `legacy/index.html`: bản gốc bất biến dùng làm mốc đối chiếu; không được đưa vào dist.
- `docs/PLAN.md`, `docs/PROGRESS.md`: kế hoạch đầy đủ và trạng thái từng giai đoạn.

Module nhân vật sẽ thêm ở giai đoạn 5. Các thao tác game hiện vẫn được điều phối trong `src/ui/game.ts`; những giai đoạn tiếp theo tách tiếp tại nơi có thay đổi, tránh thay toàn bộ logic một lượt.

## Bản lưu và chuyển từ web cũ

Giai đoạn 1 giữ khóa `nhan_van_tu_tien_ky_v1`, cấu trúc `version: 1` và xuất/nhập Base64 cũ. Khi đổi từ file HTML sang website, đổi tên miền hoặc đổi cổng dev, bản lưu trình duyệt có thể tách biệt: hãy **Sao lưu** ở bản cũ rồi nhập lại ở bản mới.

Nếu đọc save lỗi, game hiện cảnh báo và khóa mọi lần tự lưu trong phiên đó, giữ dữ liệu gốc. Tiến độ chơi tiếp khi đang khóa chỉ nằm trong bộ nhớ; có thể xuất Base64 để giữ riêng. Việc nhập cũng chưa mở khóa ghi trong phiên lỗi. Không xóa dữ liệu trang web trước khi sao lưu hoặc xử lý bản gốc. SaveManager hai ô, checksum, migrations và Preferences thuộc giai đoạn 2.

## Android

Giai đoạn 1 chưa có Capacitor hoặc APK. APK debug đầu tiên dự kiến ở giai đoạn 3 và chỉ build bằng GitHub Actions. Xem [tiến độ](docs/PROGRESS.md) trước khi làm tiếp. Chủ repo duyệt và merge từng PR; agent không merge main.

## Kiểm thử và giấy phép

Xem [kết quả kiểm tra](TESTING.md). Chưa gán giấy phép mã nguồn mở cho code dự án. Giấy phép OFL của hai font được giữ trong `public/licenses/` và sao chép vào bản build.
