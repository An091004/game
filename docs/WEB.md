# Nhàn Vân trên web

Ngày 16/11/2026 người dùng chọn **GitHub Pages của repo An091004/game, có link chơi online**. Đây là hướng phát triển hiện tại, thay cho lộ trình APK trong PLAN.md. Giữ game/nhân vật của giai đoạn 1–5, không tiếp tục các bước Android.

## Phát triển và kiểm chứng

```sh
npm ci
npx tsc --noEmit
npx vitest run
npm run build
npm run start:web
```

Mở `http://127.0.0.1:4173/`. Script server chỉ nghe loopback, không cần Java/Android Studio. `npm run dev` vẫn dùng cho sửa code. Bản ZIP có thể chạy bằng Node.js 24 mà không cài npm package.

## Đóng gói

Trên Windows chạy `npm run package:web`, nhận `release/NhanVan-web.zip` và `.sha256`. ZIP gồm bản dist, công cụ chạy web cục bộ và hướng dẫn. `release/` bị Git bỏ qua, không commit ZIP.

`npm run build` chạy thêm kiểm tra đầu ra: file UTF-8, không nhị phân/symlink, đủ font/license/icon/.nojekyll và đường dẫn asset tương đối. Font được nhúng dạng data URL bằng cấu hình Vite để nhánh xuất bản chỉ có văn bản. Không có CDN hoặc backend. `build-info.json` cho biết commit nguồn và nguồn có đang sửa dở khi build hay không.

## GitHub Pages

- Repository: `An091004/game`; website: `https://an091004.github.io/game/` **khi deployment đã thành công**.
- Source code ở các nhánh PR, không tự merge main. Nhánh riêng `gh-pages` chỉ chứa nội dung dist đã kiểm chứng, không chứa save, .env, công cụ phát triển hoặc file riêng tư.
- Cấu hình Pages: **Deploy from a branch → gh-pages → /(root)**. Dùng `.nojekyll` vì HTML/CSS/JS đã build trên máy. Không cần Secrets, workflow APK hoặc build Vite trên runner.
- GitHub vẫn dùng workflow nội bộ để phát hành Pages, kể cả xuất bản từ nhánh. Nếu tài khoản đang bị khóa billing, deployment cũng có thể bị chặn: kiểm tra run thực tế, không coi có nhánh/URL là website đã chạy.
- Khi cập nhật: duyệt thay đổi, kiểm chứng, commit nguồn, build lại từ commit sạch; kiểm tra `build-info.json`; chép nội dung dist vào checkout gh-pages, tạo commit mới và push bình thường. Không force-push hoặc viết lại lịch sử. Chỉ xóa các asset cũ do bản build trước tạo, sau khi xác minh đúng checkout gh-pages.
- Chờ Pages báo built/deployment success rồi mở URL và đối chiếu `build-info.json` với commit nguồn mới. Nếu chưa có success, báo rõ website chưa sẵn sàng.

Tham khảo chính thức: [nguồn xuất bản GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), [Pages REST API](https://docs.github.com/en/rest/pages/pages), [Vite assetsInlineLimit](https://vite.dev/config/build-options.html#build-assetsinlinelimit).

## Tiến trình và giới hạn

- Lưu ngay trong localStorage của trình duyệt bằng hai ô/checksum; vẫn đọc save v1/v2 và ngoại hình cũ. Lỗi đọc/ghi không đổi sang kho rỗng. Flush khi tab ẩn, pagehide; cộng bế quan khi quay lại, tối đa 8 giờ.
- Localhost và `an091004.github.io` là hai origin khác nhau. Trước khi chuyển nơi chơi vào **Thêm → Sao lưu hành trình**, xuất Base64 rồi nhập ở nơi mới. Không tự chuyển dữ liệu giữa thiết bị hoặc trình duyệt.
- Các project Pages cùng `an091004.github.io` chung origin/localStorage. Trò chơi tiếp tục giữ tên khóa cũ để bảo toàn hành trình; không đồng thời mở hai bản Nhàn Vân cùng origin rồi nhập save khác nhau.
- Không có service worker/PWA hoặc đồng bộ đám mây. Sau khi tải xong trang vẫn chạy khi mất mạng; mở lại trang cần mạng hoặc server cục bộ. Không quảng cáo khả năng cài app/chơi offline khi chưa có.
- Cài đặt rung cũ vẫn được giữ trong save để tương thích, nhưng ẩn khỏi giao diện vì bản web chưa triển khai rung. Cài đặt sáng/tối, chữ, nhạc và tiết kiệm pin vẫn có.
- Phần native/Back hai lần để thoát đã gỡ. Dùng các nút điều hướng trong game; nút Back trình duyệt giữ hành vi của trình duyệt. Escape hoặc nút đóng để đóng hộp thoại.
