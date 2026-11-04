# Tiến độ Nhàn Vân

## Bối cảnh đã chốt

- Repo: An091004/game; nhánh chính main.
- Bản nguồn: index.html tại commit 473f97f; giữ bản nguyên gốc ở legacy/index.html sau khi build Vite đầu tiên thành công.
- Lần chạy này thực hiện giai đoạn 1 vì main chưa có nền Vite/TypeScript. Không thực hiện trước các giai đoạn 2–8.
- Mọi thay đổi nằm trên codex/giai-doan-1-vite-typescript, đưa vào PR; chủ repo tự merge.

## Trạng thái

| Giai đoạn | Trạng thái |
| --- | --- |
| 1. Vite + TypeScript + CI + tài liệu | Đã triển khai và kiểm chứng cục bộ; chờ chủ repo duyệt PR và merge |
| 2. SaveManager + ngoại tuyến + tests | Chưa bắt đầu; cần giai đoạn 1 được xác nhận |
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

## Việc chủ repo cần làm tiếp

1. Mở PR, xem diff và kết quả CI thực tế trên GitHub.
2. Chạy npm ci và npm run dev nếu muốn thử; xuất save từ bản cũ trước khi đổi địa chỉ chơi.
3. Tự merge khi đã đồng ý, rồi yêu cầu giai đoạn 2. Nếu CI lỗi, gửi log; nếu có khác biệt giao diện, gửi ảnh.
4. Chưa cần Secrets hoặc thay đổi cài đặt repo. APK cài thử chỉ có từ giai đoạn 3.

## Giới hạn cần giữ ở giai đoạn sau

Save lỗi được bảo vệ nhưng chưa tự phục hồi; khóa ghi tồn tại hết phiên. File gốc dùng file:// và dev server dùng origin khác nhau nên cần xuất/nhập nếu đổi nơi chơi. Tab vẫn theo bố cục v1; thay bottom navigation và thử thiết bị thật ở giai đoạn 4. src/ui/game.ts còn điều phối thao tác cũ; tiếp tục tách module khi triển khai tính năng tương ứng.
