# Sơn Hải Dị Văn — mốc đồ họa đầu tiên

Ngày 16/11/2026, người dùng yêu cầu sáng tạo hơn, nhiều màu sắc hơn và code đồ họa nhân vật, NPC, phong cảnh. Mốc này bổ sung một chuyến thưởng cảnh có tương tác để duyệt hướng mỹ thuật trước khi thiết kế và triển khai gameplay sinh tồn–luân hồi.

## Cách xem

- Trong game: nút **Bước vào Sơn Hải** ở Tu luyện, hoặc **Thêm → Sơn Hải**. Trên máy tính có Sơn Hải ở thanh bên.
- Link trực tiếp: `https://an091004.github.io/game/#world` sau khi phát hành. Link này cho phép xem ngay bằng dáng mặc định nếu chưa tạo nhân vật.
- Chọn một trong ba miền đất, chạm tên NPC trong tranh hoặc chân dung, rồi chọn câu hỏi. Đổi ngoại hình ở mục Nhân vật sẽ cập nhật dáng người trong tranh.

## Hướng mỹ thuật

Giữ nền xanh đen và vàng đồng của Nhàn Vân; cảnh vật có màu riêng để thế giới rộng hơn một tông xanh. Minh họa 2D bằng SVG theo lớp, không ảnh nền tải ngoài. Nhân vật đứng có tỉ lệ thanh mảnh, nhiều lớp áo, tóc, trang sức, vũ khí và đường thêu; NPC có bóng dáng riêng.

| Miền đất | Màu sắc và dấu ấn | Người có thể gặp |
| --- | --- | --- |
| Vân Hải Ngọc Lưu | Ngọc lam, hồng đào, vàng sớm; núi nổi, thác nước, kình ngư chở mưa | Liên Sương, Ông Tám Niên |
| Chợ Đèn Vong Xuyên | Tím chàm, hổ phách, hồng sen; phố đèn, cầu cong, kênh nước và thuyền giấy | Hồng Ly, Ông Tám Niên |
| Tàn Tích Xích Nguyệt | Đỏ son, bạc lạnh, xanh than; trăng bị chém, cổng vỡ, đá lơ lửng | Vô Khuyết, Liên Sương |

Liên Sương đã chém rời cái bóng để cứu sư phụ; cái bóng nay theo một môn phái khác. Hồng Ly bán ký ức nhưng không nhớ người đầu tiên thương mình. Ông Tám Niên bán bản đồ của nơi chưa xuất hiện. Vô Khuyết canh cổng ba trăm năm để chờ bát canh trong bữa cơm cuối cùng nguội đi. Đây là hạt giống cho các tuyến nhân quả, chưa phải nhiệm vụ vận hành.

## Phạm vi hiện có

- Nhân vật người chơi dùng màu áo, kiểu tóc và giới tính từ profile đang lưu.
- Bốn NPC, mỗi người có lời chào, mô tả và hai câu hỏi; đổi người và cảnh hoạt động ngay.
- Hơi thở, vạt áo, linh quang, mây, đèn, cánh hoa, dòng nước và tàn lửa chuyển động nhẹ bằng CSS. Có nút dừng; tuân thủ reduced-motion, tiết kiệm pin và trạng thái nền/trang ẩn.
- Cảnh không dựng lại mỗi giây; chỉ dựng khi đổi miền đất hoặc ngoại hình. Mọi SVG definition có namespace theo scene/portrait.
- Không ghi lựa chọn thưởng cảnh vào save, không phát tài nguyên, không đổi cân bằng hoặc schema. Các cuộc trò chuyện chưa có trí nhớ, lịch trình, quan hệ hay hậu quả dài hạn. Đổi cảnh sẽ trở về lời chào đầu.
- Toàn bộ mã và asset được commit là văn bản. Không WebGL, thư viện đồ họa, backend, ảnh AI hoặc tài nguyên từ CDN.

## Mã nguồn

- `src/data/world.ts`: nội dung, vùng đất, palette, NPC và câu hỏi.
- `src/graphics/actors.ts`: hình người chơi và bốn kiểu NPC.
- `src/graphics/scenery.ts`: lớp phong cảnh ba miền.
- `src/graphics/world.ts`: ghép người vào cảnh và dựng chân dung.
- `src/graphics/world.css`: bố cục, responsive, chuyển động.
- `src/ui/world.ts`: chọn cảnh, trò chuyện và nối với profile hiện có.

## Duyệt mốc này

Cần phản hồi về phong cách nhân vật, mức độ rực rỡ và bầu không khí của ba miền. Sau đó mới chốt GDD/kiến trúc và mốc gameplay kế tiếp; không coi bản đồ họa này là toàn bộ bản redesign.
