# AGENTS.md

## Dự án
Nhàn Vân: game tu tiên idle thư giãn, web Vite + TypeScript, xuất bản GitHub Pages tại repo An091004/game. Người dùng đã chuyển sang web ngày 16/11/2026, không tiếp tục APK. Kế hoạch Android cũ ở `docs/PLAN.md` chỉ để tham khảo; hướng hiện tại ở `docs/WEB.md`, tiến độ ở `docs/PROGRESS.md`.

## Quy tắc bắt buộc
- Chỉ sửa file trong repo này. Làm trên nhánh riêng và tạo PR; không merge vào `main`.
- Repo chỉ chứa file văn bản, không commit nhị phân. Font của bản web được nhúng dạng data URL trong CSS; `dist/` và ZIP không commit vào nhánh nguồn. Nhánh `gh-pages` chỉ chứa bản web đã build và kiểm chứng.
- Không commit bí mật, không đổi Secrets. Chỉ cấu hình GitHub Pages cho repo này theo yêu cầu triển khai web ngày 16/11/2026; không đổi cài đặt khác. Không force-push.
- Không build hoặc phát triển APK. Không tự merge PR vào main; xuất bản bản web đã kiểm chứng lên gh-pages được người dùng cho phép.

## Kiểm chứng trước khi kết thúc
npm ci (hoặc npm install) → npx tsc --noEmit → npx vitest run → npm run build
Báo kết quả thật trong mô tả PR.

## Quy ước code
- TypeScript, module nhỏ: state, engine, save, ui, character, data.
- Số liệu cân bằng và chữ nội dung nằm ở `src/data/`, không rải trong logic.
- Save: không bao giờ ghi đè save bằng state rỗng khi đọc lỗi; có saveVersion + migrations; có test.
- Giao diện: giữ phong cách thủy mặc tối xanh đen + vàng đồng, tiếng Việt, ưu tiên di động, không cuộn ngang.
- Mô tả PR bằng tiếng Việt: đã làm gì, đã kiểm chứng gì, việc người dùng cần làm, rủi ro.
