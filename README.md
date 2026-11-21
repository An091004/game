# Nhàn Vân · Tu Tiên Ký

Game tu tiên idle một người chơi, tiếng Việt, phong cách thủy mặc xanh đen/vàng đồng. Có 10 đại cảnh giới, 36 sự kiện, 26 thành tựu, nhân vật SVG tùy chỉnh và tiến trình ngoại tuyến tối đa 8 giờ.

**Dự án đã chuyển sang web ngày 16/11/2026. Không cần APK, Android Studio hoặc Gradle.**

- Mã nguồn: [An091004/game](https://github.com/An091004/game).
- Địa chỉ GitHub Pages: [Nhàn Vân](https://an091004.github.io/game/) — chỉ chơi được khi deployment đã thành công; trạng thái mới nhất ở PR/Actions.
- Hướng dẫn triển khai và giới hạn: [docs/WEB.md](docs/WEB.md).

## Chạy và build

Cài Node.js 24, chạy trong repo:

```sh
npm ci
npm run dev
```

Build để đưa lên hosting hoặc chơi bản production:

```sh
npx tsc --noEmit
npx vitest run
npm run build
npm run start:web
```

Mở http://127.0.0.1:4173/. Không mở index.html trực tiếp bằng file://. Trên Windows, chạy `npm run package:web` để tạo `release/NhanVan-web.zip`; giải nén rồi mở Chay-Web.cmd. Bản ZIP chỉ cần Node.js, không cần npm install. Muốn dừng server, nhấn Ctrl+C.

## Chơi và lưu

Thanh dưới trên điện thoại có Tu luyện, Nhân vật, Du ngoạn, Động phủ, Thêm. Công pháp, Luyện đan, Nhật ký, Thành tựu, Cài đặt và Sao lưu nằm trong Thêm. Trên máy tính dùng thanh bên. Nhân vật có tên, ba giới tính lựa chọn, ba kiểu tóc và năm màu áo; ngoại hình không làm đổi cân bằng game.

Tiến trình/ngoại hình/cài đặt lưu trong localStorage, hai ô chính/backup kèm checksum. Save cũ v1/v2 vẫn đọc được. Nếu cả hai ô hỏng, game dừng ghi để bảo vệ dữ liệu. Tự lưu tối đa 5 giây và flush khi rời/ẩn tab; khi quay lại chỉ cộng bế quan một lần, tối đa 8 giờ. Đồng hồ lùi không làm cộng lại thời gian cũ.

**Trước khi đổi máy, trình duyệt hoặc chuyển từ localhost sang GitHub Pages, xuất Base64 ở Thêm → Sao lưu hành trình rồi nhập ở nơi mới.** Các origin không tự chia sẻ save. Không xóa dữ liệu trình duyệt nếu chưa sao lưu. CRC32 phát hiện hỏng dữ liệu, không phải chữ ký chống sửa save.

Font Latin/tiếng Việt được nhúng trong CSS, icon và nhân vật SVG không tải tài nguyên ngoài. Sau khi trang tải xong có thể tiếp tục chơi khi mất mạng; mở lại trang cần mạng hoặc server cục bộ. Chưa có PWA/service worker, tài khoản, cloud sync hay thông báo nền.

## Xuất bản

Bản web tĩnh ở `dist/`, dùng asset tương đối nên hoạt động ở `/game/`. Chỉ đưa **nội dung dist/** lên nhánh `gh-pages` rồi chọn Pages → Deploy from a branch → gh-pages → /(root). Không đưa mã Vite/TypeScript ở nhánh nguồn thẳng lên Pages.

Build diễn ra cục bộ. GitHub vẫn phải chạy bước triển khai Pages; nếu run bị khóa billing thì website chưa sẵn sàng dù đã có nhánh. Không cần thêm Secrets hoặc chuyển sang gói trả phí chỉ để chuẩn bị bản web. Chi tiết ở [WEB.md](docs/WEB.md).

Repo chỉ commit file văn bản; font được nhúng dạng data URL. dist/release/node_modules và dữ liệu save riêng tư không nằm trong nhánh nguồn. Mỗi thay đổi nguồn có PR riêng, không tự merge main; xuất bản lên gh-pages tách khỏi việc merge PR.

## Mã nguồn

- `src/state/` và `src/save/`: schema, ngoại hình, migrations, lưu/khôi phục.
- `src/engine/`: công thức game và tiến trình theo thời gian.
- `src/ui/`: thao tác, render, modal, âm thanh và vòng đời trình duyệt.
- `src/character/`: SVG nhân vật chỉ đọc state; `src/data/`: cân bằng/nội dung.
- `legacy/index.html`: bản HTML đầu tiên, giữ làm fixture hồi quy.
- `scripts/`: kiểm tra văn bản, kiểm tra bản web, server cục bộ và đóng gói ZIP.

Xem [TESTING.md](TESTING.md) và [tiến độ](docs/PROGRESS.md). [GDD Nghịch Mệnh](docs/GDD.md) là đề xuất redesign đang chờ duyệt, chưa phải các cơ chế đã có trong bản chơi. Kế hoạch/hướng dẫn Android cũ được giữ để tra lịch sử, không còn áp dụng. Chưa gán giấy phép mã nguồn mở; giấy phép OFL của font nằm trong public/licenses và bản build.
