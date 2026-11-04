# AGENTS.md

## Dự án
Nhàn Vân: game tu tiên idle thư giãn. Web (Vite + TypeScript) bọc bằng Capacitor thành app Android. Kế hoạch tổng thể ở `docs/PLAN.md`, tiến độ ở `docs/PROGRESS.md`.

## Quy tắc bắt buộc
- Chỉ sửa file trong repo này. Làm trên nhánh riêng và tạo PR; không merge vào `main`.
- Repo chỉ chứa file văn bản, không commit nhị phân. Thư mục `android/` không commit (sinh trong CI).
- Không commit bí mật. Không đụng Secrets hay cài đặt repo. Không force-push.
- Không build Android trong sandbox; APK build bằng GitHub Actions.

## Kiểm chứng trước khi kết thúc
npm ci (hoặc npm install) → npx tsc --noEmit → npx vitest run → npm run build
Báo kết quả thật trong mô tả PR.

## Quy ước code
- TypeScript, module nhỏ: state, engine, save, ui, character, data.
- Số liệu cân bằng và chữ nội dung nằm ở `src/data/`, không rải trong logic.
- Save: không bao giờ ghi đè save bằng state rỗng khi đọc lỗi; có saveVersion + migrations; có test.
- Giao diện: giữ phong cách thủy mặc tối xanh đen + vàng đồng, tiếng Việt, ưu tiên di động, không cuộn ngang.
- Mô tả PR bằng tiếng Việt: đã làm gì, đã kiểm chứng gì, việc người dùng cần làm, rủi ro.
