# Nhàn Vân — Nghịch Mệnh

**Game Design Document · Phase 1 · bản đề xuất 0.1 · 21/11/2026**

Tình trạng: chờ người dùng duyệt thiết kế. Các cơ chế và số liệu trong tài liệu này **chưa được triển khai**; mọi con số là giả thuyết để thử nghiệm, không phải kết quả cân bằng. Bản đang chơi có vòng idle cũ và mốc đồ họa [Sơn Hải Dị Văn](VISUAL-WORLD.md). Phần kỹ thuật, schema, định dạng content và cách thực hiện RNG thuộc Phase 2, chưa chốt ở đây.

## 1. Lời hứa và phạm vi

> Ngươi có thể chết. Nhưng những việc ngươi đã làm vẫn tiếp tục sống.

Người chơi là một tán tu bị thiếu tên trong Thiên Tịch — cuốn sổ dùng để quyết định ai được phi thăng và ai phải trả giá cho cuộc phi thăng ấy. Mỗi lần chạm tới đại cảnh giới, dấu mệnh vô danh khiến những món nợ bị che giấu hiện ra. Mục tiêu đầu là sống sót, có một nơi trú và biết ai đã xóa tên mình. Mục tiêu cuối là giành quyền quyết định luật truyền thừa của thế giới.

Ba kết cục dự kiến: nhận một vị trí trong trật tự cũ và trả món nợ được công khai; chiếm quyền viết Thiên Tịch, chấp nhận trở thành người phân xử nợ của kẻ khác; hoặc xóa dấu mệnh của mình để phá một phần cơ chế thu nợ, vĩnh viễn từ bỏ khả năng luân hồi của chính nhân vật. Không gắn nhãn kết cục thiện/ác tuyệt đối. Những người đã giúp, hại hoặc bỏ lại quyết định cái giá cụ thể của mỗi kết cục.

**Giả định làm việc:** chơi đơn, tiếng Việt, web Vite + TypeScript, ưu tiên điện thoại; không PvP, xếp hạng, mua mạng, gacha hoặc thanh toán. Có thể chơi một phiên 5–20 phút. Cảm hứng tiên hiệp được thể hiện bằng chênh lệch quyền lực, ân oán và cái giá của trường sinh; không cần phản xạ nhanh hoặc bạo lực đồ họa chi tiết.

**Phạm vi cần sâu trước:** tu luyện–đột phá, lịch luyện có lựa chọn, quan hệ–nhân quả, sinh tử–di sản. Các nghề và chính trị được mở khi chúng bổ sung lựa chọn cho bốn trục này. Không làm mười thanh nâng cấp tách biệt.

## 2. Vòng chơi và mục tiêu

**Nghe tin → chọn việc và chuẩn bị → đối mặt một tình huống → quyết định trả giá → nhận hậu quả → thay đổi cách tu luyện → đột phá hoặc truyền thừa.**

| Nhịp | Câu hỏi người chơi cần trả lời | Kết quả mong muốn |
| --- | --- | --- |
| 30–90 giây | Ta tin ai, mang gì, đi tiếp hay rút? | Một quyết định có căn cứ, không phải spam nhận thưởng |
| 5–20 phút | Hoàn tất một chặng, giữ lời hay đổi mục tiêu? | Một bước tiến và một chuyện để kể lại |
| 3–5 phiên | Gia nhập ai, chữa đạo cơ hay chuẩn bị đột phá? | Một tham vọng cụ thể với ít nhất hai cách đạt |
| Một đời tu | Giữ lời thề nào khi quyền lực tăng? | Đường tu riêng và di sản đã kiếm được |
| Nhiều đời | Thay đổi ai phải trả giá cho phi thăng? | Thế giới khác đi vì chuỗi hành động của người chơi |

Bế quan cung cấp nền tảng, không tự cung cấp toàn bộ hiểu đạo, nhân chứng, bí pháp hoặc vật liệu đột phá. Khi đủ linh khí, câu hỏi mới là “đã sẵn sàng trả giá chưa”, không chỉ là “đã bấm đủ chưa”.

## 3. Mười trụ cột

### 3.1. Thế giới khắc nghiệt, có người đang sống trong đó

Ba miền đã có hình ảnh trở thành ba mạng quan hệ:

| Miền | Tài nguyên và quyền lực | Xung đột vận hành |
| --- | --- | --- |
| Vân Hải Ngọc Lưu | Linh mạch di động, đường vượt mây, kiếm phái nắm bến | Đảo đổi vị trí làm một môn phái mất nguồn thu; cứu một trạm có thể chuyển thú triều về làng khác |
| Chợ Đèn Vong Xuyên | Thông tin, ký ức có xuất xứ, khế ước và vận chuyển | Chủ nợ mua người môi giới; hàng giả làm cả tuyến giao thương bị điều tra |
| Tàn Tích Xích Nguyệt | Mảnh đạo khí, phong ấn, bí pháp bị cấm | Khai thác càng sâu càng làm cổng suy yếu; người gác cổng cũng có lý do để rời đi |

Mỗi NPC quan trọng có một mong muốn, một thứ sợ mất, phương tiện để hành động và điều họ biết. Liên Sương tìm lại cái bóng nhưng sợ cái bóng đã trở thành người tốt hơn mình. Hồng Ly giữ chữ tín trong giao dịch để bảo vệ mạng lưới chợ, đồng thời tìm lại ký ức của chính nàng. Tám Niên cần những câu chuyện thật để cập nhật bản đồ. Vô Khuyết giữ cổng vì lời thề, nhưng muốn biết gia đình mình đã thực sự chết ra sao.

NPC quyết định theo lợi ích, quan hệ và thông tin sẵn có. Người mắc nợ có thể cứu ngươi, nhưng không bỏ con đang bệnh để làm vậy. Kẻ thù cần biết danh tính, tìm được dấu vết và có nguồn lực truy sát; hắn không xuất hiện ngay tại mọi nơi người chơi đến.

Lịch hoạt động dùng các buổi/ngày trong truyện: mua hàng ở chợ, về trạm, dự nghị sự, áp tải, dưỡng thương. Người vắng mặt để lại dấu hiệu như quầy đóng, thư nhắn hoặc nhân chứng chỉ đường. Gặp đúng giờ giúp tiếp cận kín đáo; chờ một cuộc hẹn không cần trực máy theo giờ thực.

Biến động lớn có báo trước, khởi phát và hậu quả: tin thú đổi hướng → giá thuốc tăng → thú triều → trạm hoặc làng được cứu/mất; tranh chấp mỏ → phong tỏa → chiến tranh môn phái → người lưu vong và cán cân quyền lực mới. Người chơi có thể can thiệp một phần, không phải trung tâm của mọi biến cố.

**Luật trí nhớ:** NPC trực tiếp chứng kiến biết việc đã thấy; người nghe tin biết lời kể và nguồn của nó; văn thư hoặc tín vật có thể xác thực hoặc bác bỏ. Quan hệ riêng, danh tiếng công khai và nhân quả siêu nhiên là ba thứ khác nhau. Một tội ác kín có thể chưa làm mất danh tiếng, nhưng vẫn để lại nợ mệnh; nhân quả không tự tiết lộ tên thủ phạm cho cả bản đồ.

### 3.2. Cảnh giới thay đổi cách sống và cách trả giá

Đột phá cần bốn điều kiện: đủ tích lũy, đạo cơ đáp ứng, một nhận thức được chứng minh qua hành động và điều kiện nghi thức. Phần trăm thành công không thay thế ba điều kiện sau. Có thể tu luyện quá mức để tích trữ dự phòng, nhưng không vượt cảnh giới chỉ bằng việc chờ lâu.

| Cảnh giới | Thọ nguyên cơ sở đề xuất | Quyền năng / kiểu chơi mới | Ngưỡng đột phá và cái giá riêng |
| --- | ---: | --- | --- |
| Phàm nhân, dẫn nhập | 80 năm | Nhìn quyền lực từ bên dưới; nghề và quan hệ tạo lối vào | Chọn cách nhập đạo, chấp nhận một ràng buộc ban đầu |
| Luyện Khí, 9 tầng | 120 năm | Cảm linh, phù đơn giản; đối phó hiểm nguy bằng chuẩn bị | Kinh mạch sạch và hiểu điều tức; ép tầng gây tạp khí/thương tích |
| Trúc Cơ | 250 năm | Chọn trụ cột Kiếm/Thể/Hồn; lập nơi trú và lời thề có hiệu lực | Chọn một nền đạo cơ, mất lợi thế của các nền chưa chọn; vết nứt cơ có thể theo lâu dài |
| Kết Đan | 600 năm | Luyện một đạo khí gắn với phương pháp sống | Thành đan mang đặc tính từ những lần giải quyết hiểm cảnh; lỗi nghi thức để lại đan văn bất ổn |
| Nguyên Anh | 1.500 năm | Xuất khiếu để do thám/cứu người; có cơ hội thoát thân khi thân xác mất | Tách anh làm lộ nơi cất thân; giữ cả thân lẫn bí mật trở thành lựa chọn khó |
| Hóa Thần / Trảm Trần | 3.000 năm | Chạm ký ức và lời thề; nhìn thấy một phần nợ mệnh | Cắt một chấp niệm bằng hành động thật; không mặc định phải giết người thân |
| Luyện Hư | 6.000 năm | Mở đường giữa các miền, sửa trận quy mô lớn | Giữ đường mở tiêu hao đạo lực; đóng đường có thể bỏ người ở phía bên kia |
| Hợp Thể | 12.000 năm | Nhận bảo hộ cộng đồng, hợp nhất người–đạo khí | Trách nhiệm cộng đồng làm giới hạn lựa chọn cá nhân; thất hứa tạo phản phệ |
| Đại Thừa | 24.000 năm | Lập một điều luật cục bộ được người khác sống cùng | Luật bảo vệ nhóm này có thể gây thiệt cho nhóm khác; cần trả phần tổn thất |
| Độ Kiếp | 36.000 năm | Đối diện thiên kiếp nhiều chặng và những nhân quả chưa khép | Chiến thắng bằng sức mạnh đơn thuần không xóa người bảo lãnh hoặc món nợ đang treo |
| Chân Tiên, sau Phi Thăng | Không già tự nhiên | Tác động Thiên Tịch; chọn kết cục của chiến dịch | Vẫn có thể bị giết, mất đạo hoặc bị xóa danh; không có bất tử vô điều kiện |
| Ngoài Chân Tiên | Chưa chốt | Hậu truyện nếu vòng chơi chính chứng minh đủ sâu | Không kéo dài chỉ bằng một dãy tên và số lớn hơn |

Các đại cảnh giới sau Luyện Khí dự kiến có sơ/trung/hậu kỳ. Tên và số ở bảng này mô tả đích thiết kế, không buộc bản thử phải có đủ mười cảnh giới. **Phạm vi gameplay đầu tiên chỉ cần Luyện Khí tầng 1–2.**

Tuổi tăng theo thời lượng trong truyện của hành động/công việc đã thực hiện; thọ nguyên là trần, không phải số dư để cộng đầy khi lên cấp. Đột phá nâng trần, không đặt tuổi về 0. Tổn thọ được giải thích trước khi xác nhận. Đan trường thọ có kháng tính cùng loại và giới hạn theo đời; không có vòng mua bán tạo tuổi vô hạn.

Nghi thức gồm chuẩn bị → khảo nghiệm → kết quả. Chuẩn bị xem được thương tích, tạp khí, vật tư và thông tin còn thiếu. Khảo nghiệm đưa ra hai hoặc ba cách xử lý: chuyển sét vào trận rồi mất trận, giữ kinh mạch nhưng cháy pháp khí, hoặc cưỡng ép giữ cả hai với nguy cơ chết đã báo. Không yêu cầu bấm đúng mili giây. Có thể tắt rung sáng và rút ngắn hoạt ảnh mà giữ nguyên lựa chọn.

Mọi tiểu đột phá không có thiên kiếp. Riêng lần 1 → 2 của nhân vật vô danh có **Vấn Danh Lôi**, một dị biến được báo trước qua dấu mệnh và lời NPC; đây là cách giới thiệu lôi kiếp trong bản thử mà không cho người mới nhảy đại cảnh giới.

Bảng thử cho Vấn Danh Lôi đầu tiên: cần giữ sẵn 100 linh khí khi bắt đầu; lượng thực mất phụ thuộc kết quả bên dưới, không trừ hai lần. Thiên vận không bí mật làm tăng nguy cơ chết sau khi bảng rủi ro đã được trình bày.

| Ứng phó | Kết quả giả thuyết | Giá trả |
| --- | --- | --- |
| Bỏ nghi thức trước khi cưỡng ép | 100% giữ mạng, chưa lên tầng | Mất 20 linh khí, giữ 80 và vật tư chưa dùng |
| Dẫn lôi bằng một phù | 70% lên tầng; 30% hủy nghi thức, thương nhẹ; không chết trong khảo nghiệm này | Phù tiêu ở cả hai nhánh; thành công mất 100 khí, thất bại mất 40 và giữ 60 |
| Cưỡng ép giữ phù | 60% lên tầng mang vết sẹo; 25% thất bại và thương nặng; 15% tử vong | Sống lên tầng mất 100 khí; thất bại sống mất 60 và giữ 40; chết theo luật kết thúc đời tu |

Thanh Tâm Đan nếu còn có thể dùng trước khảo nghiệm để hạ một bậc thương tích trong kết quả sống, không xóa rủi ro chết đã ghi. Người cứu người bị thương đã mất lựa chọn này, đổi lấy một mối quan hệ chưa đảm bảo đền đáp. Rút lui trước khi bắt đầu nghi thức không tiêu linh khí hoặc vật tư. Bảng chỉ để dựng một tình huống có thể kiểm thử, không áp dụng máy móc cho mọi thiên kiếp.

### 3.3. Hiểm nguy, thất bại, chết và di sản

Hậu quả tăng theo bốn bậc: mất cơ hội/tài nguyên → thương tích hoặc nợ cứu mạng → hư đạo cơ/mất thân → kết thúc đời tu. Thất bại thường tạo tình thế mới; không dùng chết làm kết quả mặc định của mọi lần bốc số xấu.

**Trước điểm không thể quay lại**, luôn có ít nhất một phương án ít nguy hiểm hơn với giá cụ thể: bỏ bảo vật, giao hàng, nhận điều kiện của chủ nợ, lùi nghi thức. Sau khi người chơi đã thấy cảnh báo và chủ động vượt điểm đó, không đảm bảo còn lối thoát miễn phí.

Giao chiến đầu tiên dùng 2–4 lượt quyết định, không spam đòn đánh: đọc thế → chọn bảo vệ người/vật nào → đối phương phản ứng → chốt tiếp tục hoặc rút. Kiếm tạo cửa kết thúc nhanh, Thể giữ vị trí và cứu người, Hồn tìm mâu thuẫn/đánh lạc hướng; vật tư mở phương án cụ thể. Đối thủ phản ứng theo mục tiêu, không chỉ đánh tới khi HP bằng 0: kẻ cướp có thể nhận hàng rồi bỏ đi; người truy thù có thể bỏ hàng để tiếp tục đuổi. Trong lúc đọc lựa chọn, cả hai bên dừng. Thua có thể bị tước hàng, bắt giữ hoặc mang thương; chỉ chặng đã báo chí mạng mới có tử vong.

| Dấu hiệu | Người chơi biết được | Cách ứng phó và hậu quả |
| --- | --- | --- |
| Vết chân/linh áp cao hơn mình | Chênh lệch quyền lực, chưa biết danh tính | Đổi đường, thuê dẫn đường, nộp lộ phí; cố đối đầu có cảnh báo chí mạng |
| Đan không rõ xuất xứ | Không xác nhận được chất lượng/độc tính | Trả phí kiểm, dùng liều nhỏ, giữ lại làm bằng chứng; thuốc rẻ không tự nhiên luôn xấu |
| Bản đồ có hai mốc mâu thuẫn | Có thể giả hoặc đã lỗi thời | Tìm nhân chứng, mua mốc thứ ba, đi đường vòng; điều tra tốn cơ hội và tiền |
| Pháp khí phản ứng với tên mình | Có ràng buộc chưa hiểu | Phong ấn/cầm cố/tìm chủ cũ; dùng ngay có lợi mạnh nhưng phát dấu vết |
| Đồng minh né câu hỏi về phần chia | Nguy cơ phản bội, không chắc có phản bội | Lập khế ước, chia sớm, đổi đội; kiểm soát quá mức có thể làm mất người thật lòng |

Tử vong kết thúc cơ thể và đường tu của đời hiện tại. Cảnh giới, linh khí, túi đang mang và vị thế cá nhân không tự chuyển sang thân mới. Đồ gửi có chủ giữ hoặc người thừa kế xử lý theo thỏa thuận, có thể trở thành mục tiêu lấy lại; không biến toàn bộ kho thành túi chung bất khả xâm phạm qua các kiếp.

Người chơi được giữ sổ chuyện đã khám phá để không phải đọc lại tutorial, nhưng kiến thức trong đầu người chơi không tự trở thành quyền truy cập của nhân vật mới. Từ di sản **đã kiếm và neo khi còn sống**, chọn **một** trong ba loại cho kiếp kế: ký ức kỹ nghệ mở một cách giải quyết, tín vật mở một quan hệ/đường đi, hoặc dấu huyết mạch mở một năng lực đi kèm ràng buộc. Mỗi cái có nguồn gốc, chủ nợ và khả năng bị nhận diện. Không cộng chỉ số vĩnh viễn theo số lần chết.

Luân hồi mở một thân mới cùng thế giới sau bảy ngày lịch chung. Dấu mệnh vô danh kết thành **mệnh kén** tại bến trú khởi đầu, tạo thân trưởng thành có tuổi khởi điểm 18; không chiếm thân hay xóa ý thức người vô tội. Thân mới chỉ mở sức mạnh xuất phát và một di sản được chọn, không thừa hưởng toàn bộ năng lực cơ thể cũ. Bến bảo đảm người mới có thể đọc tình thế và chuẩn bị trước khi rời đi, không bị kẻ thù giết ngay trong màn tạo nhân vật.

NPC, lời hẹn và biến động chung tiến bảy ngày tương ứng, nhưng không tự làm kẻ từng được cứu thành đại năng chỉ sau một tuần. Những biến đổi kéo dài hàng trăm năm chỉ xảy ra nếu đủ thời gian đã qua qua các đời. Chết không reset nguồn thưởng đã khai thác, khế ước đã trả hoặc vật độc nhất. Người sống có lựa chọn **chờ bảy ngày tại bến**, không mất linh thạch và không nhận thưởng công việc, để tiến cùng lượng lịch/tuổi; UI báo trước lời hẹn nào sẽ bị ảnh hưởng. Chết không phải cách tua lịch rẻ hơn. Có thể truyền thừa/chủ động kết thúc đời tu đã đủ điều kiện để nhận cùng quyền chọn di sản; tự sát không có phần thưởng riêng.

Màn tử vong nói rõ: quyết định đã cam kết, dấu hiệu đã biết, điều chưa biết, tài sản mất, món nợ còn và những người liên quan. Khi hết thọ, chỉ công việc có thời lượng vượt phần tuổi còn lại mới có thể dẫn tới kết thúc đã xác nhận; ở nơi trú không có cái chết bất ngờ vì người chơi vắng máy. Công việc sẽ dừng trước mốc đó để chờ quyết định.

### 3.4. Thiên vận, nghiệp và dấu mệnh

**Thiên vận** là khả năng gặp đúng người hoặc đúng cơ hội, không phải nút cộng sức mạnh. **Nghiệp** là mạng món nợ và hệ quả từ hành động, không phải một thanh thiện/ác. **Dấu mệnh** biểu thị mức Thiên Tịch chú ý đến người vô danh sau các lần can thiệp vượt phận.

Thiên vận dùng giá trị ẩn; UI thể hiện dấu hiệu như mây tụ, quẻ biến hoặc lời nhận xét có thể sai của NPC. Nó thay đổi tần suất một cơ hội trong tập tình huống hợp lệ, không biến một phàm nhân thành người thắng Nguyên Anh bằng một lần may. Một thử nghiệm ban đầu giới hạn ảnh hưởng của vận lên trọng số xuất hiện trong khoảng 0,8–1,2 lần; chưa coi đây là cân bằng cuối.

Nghiệp được ghi theo người/sự kiện: cứu ai, nhận lời với ai, giết ai, bán vật gì cho ai. Cứu người ngoài đường không xóa khế ước đã phản bội ở môn phái. Giết một kẻ đang sát hại người khác có thể sinh cả ân lẫn oán. Chỉ hậu quả có mối liên hệ mới quay lại.

Có thể đổi một cơ duyên lấy nợ: Hồng Ly bán tin thật nhưng giữ quyền gọi ngươi làm một việc; nhận pháp khí của tiền bối mở đường tu nhưng báo vị trí cho người thừa kế hợp pháp. Người chơi được biết **loại ràng buộc** trước khi nhận, chưa nhất thiết biết ngày hoặc người sẽ đòi.

Dấu mệnh cao làm thiên kiếp và điều tra siêu nhiên dễ xảy ra hơn, đồng thời mở đầu mối về Thiên Tịch. Không tăng vô hạn chỉ vì login hoặc có nhiều tài sản. Hạ sự chú ý cần lựa chọn mất lợi thế, như phong ấn năng lực hoặc giao quyền sử dụng đạo khí; không có vật phẩm mua bằng tiền thật để xóa nghiệp.

### 3.5. Lựa chọn tạo ra đường tu

Chính/Ma/Tán tu là cách tổ chức quan hệ và nguồn lực. Người chơi không bị gắn một màu đạo đức bất biến sau nút chọn đầu game.

| Đường | Ưu thế thực | Ràng buộc và tình thế riêng |
| --- | --- | --- |
| Chính đạo | Bảo lãnh, thư viện, thuốc có xuất xứ, nơi trú chung | Phải trả công vụ và chịu điều tra; công khai tội của sư huynh có thể mất chỗ dựa dù cứu người vô tội |
| Ma đạo | Đổi tổn thọ, thương tích hoặc nợ thành sức mạnh bộc phát; tiếp cận vật cấm | Bị truy dấu và bị hạn chế giao dịch; có thể tự hiến tuổi thay vì hại người, nhưng giá vẫn thật |
| Tán tu / trung lập | Đổi phe linh hoạt, thương lượng đường đi, giữ bí mật | Không có cứu viện mặc định; bảo hiểm, thuốc và tin tức đắt hơn; giả trung lập để hưởng hai bên để lại dấu vết |

Đổi phe phải giải quyết lời thề, trả vật được cấp hoặc chấp nhận bị truy đòi; không đổi mỗi lần mở cửa hàng để lấy mọi ưu đãi.

Ba chuyên tu dùng chung thế giới nhưng mở cách xử lý khác nhau: **Kiếm** đọc thế trận và kết thúc xung đột nhanh, lộ kiếm ý dễ bị nhận diện; **Thể** chịu thương tích và cứu người/mang vật nặng, cần thuốc và thời gian hồi phục; **Hồn** dò lời nói, ký ức và khế ước, nhưng can thiệp sâu để lại phản hồi hoặc tạo ký ức sai. Không có đường vừa giỏi chiến đấu, trinh sát và thương lượng ở cùng mức đầu tư.

Hiểu đạo đến từ các hành động có liên hệ. Đạo “Giữ Lời” mở khả năng bảo lãnh người khác nhưng việc thất hứa gây tâm ma mạnh. Đạo “Đoạn Tuyệt” cắt một ràng buộc để vượt hiểm cảnh nhưng đóng một nguồn trợ giúp. Hành động lặp trên cùng tình huống không tiếp tục tích hiểu đạo. Người chơi được thấy các việc đã góp thành một nhận thức, không phải đoán công thức bằng spam.

### 3.6. Nghề và hệ thống phải để lại chuyện

Ba hệ hỗ trợ cần cho vòng đầu: đan dược có xuất xứ, phù/trận dùng để ứng phó và ân oán với NPC. Các hệ còn lại có hợp đồng thiết kế dưới đây nhưng chỉ mở rộng sau khi vòng đầu đạt tiêu chí thử chơi.

| Hệ | Quyết định và nguồn lực | Câu chuyện / hậu quả cần tạo | Phạm vi đầu |
| --- | --- | --- | --- |
| Luyện đan | Chọn nguyên liệu ổn định hoặc linh tính mạnh; kiểm độc trả phí/hao mẫu; liều dùng gây kháng tính | Một lô đan có người làm/người bán. Che lỗi để đủ tiền có thể khiến người dùng hỏng đạo cơ rồi trở lại đòi bồi thường. Lô tốt có thể cứu kẻ thù | Một đan điều tức, một đan chữa thương và cơ chế kiểm định |
| Phù lục | Một phù đủ thay thế một cách xử lý: dẫn lôi, giấu dấu vết, cắt truy đuổi. Dùng là mất | Giữ phù để tự cứu hay dùng cứu người là lựa chọn, không phải buff vô hạn | Hai loại phục vụ nguy hiểm đầu và lôi kiếp |
| Trận pháp | Chọn địa thế, nguồn cấp và thứ được che chắn. Trận không bảo vệ mọi nơi cùng lúc | Trận chuyển thú triều cứu trạm nhưng đổi hướng nguy hiểm sang làng khác; người duy trì trận có thể bị cắt nguồn | Một trận nghi thức; trận cộng đồng ở chương sau |
| Luyện khí / đạo khí | Đổi độ bền, đặc tính và xuất xứ; sửa bằng vật liệu khác có thể đổi tính nết khí linh | Khí linh nhớ chủ cũ, có thể từ chối đánh người từng cứu nó; đánh thức nó tăng sức mạnh đồng thời lộ người đang giữ | Sau khi vòng NPC–hậu quả hoạt động |
| Linh thú | Chọn nơi ở, thức ăn và công việc phù hợp bản tính; không thu phục bằng một lần giảm HP | Linh thú có thể dẫn đến hang, tránh vùng có mùi đồng loại bị giết hoặc từ chối một mệnh lệnh. Thuần phục cưỡng ép mất tin cậy | Sau bản thử đầu; một loài đủ sâu trước |
| Đạo lữ / đồng tu | Hai người trưởng thành tự nguyện lập mục tiêu và giới hạn; thời gian và tài nguyên chung có thể bất đồng | Người đồng tu có thể chọn giữ gia đình/môn phái thay vì theo mình. Hợp luyện chia rủi ro và thông tin, không biến NPC thành ô tăng chỉ số | Chương giữa; không triển khai tình dục chi tiết hoặc ép buộc |
| Tông môn / chính trị | Đổi tự do lấy bảo lãnh; nhận nhiệm vụ, quyền bỏ phiếu và trách nhiệm theo vị thế | Cùng một trưởng lão có thể che chở người chơi và bóc lột người yếu. Làm chứng, cải tổ hoặc ly khai đều mất một thứ | Một phe bảo lãnh trước, nhiều phe sau |
| Đấu giá / chợ đen | Giá trần đã cam kết, độ tin cậy nguồn hàng, người bảo lãnh; trả bằng tiền/tin/lời hứa được định nghĩa | Mua món đồ có thể thắng đối thủ về giá nhưng để hắn biết ai cần món đó; bị ép giá có thể chọn đổi hàng hoặc rời đi | Giao dịch có đối thoại trước, đấu giá nhiều tác nhân sau |
| Bí cảnh | Chọn số chặng, tải mang và đường rút; điều tra lời đồn trước khi vào | Mục tiêu ban đầu bị đổi bởi một người còn sống trong di tích. Cầm bảo vật có thể đóng đường về của người khác | Một tuyến ngắn; không sinh mê cung vô hạn |
| Tâm ma | Đối diện việc đã làm, người đã bỏ lại và lời biện hộ; nhận lỗi hoặc thay đổi lời thề đều có giá | Tâm ma dùng chi tiết đã có trong nhật ký, không bịa một tội người chơi chưa phạm. Hóa giải cần hành động bù đắp/thay đổi, không chỉ trả tiền | Một dư âm từ lựa chọn mở đầu |
| Hiểu đạo | Chọn cách giải quyết lặp lại trong hoàn cảnh khác nhau, sau đó chủ động nhận một lời giải về bản thân | Khi đạo mâu thuẫn với hành động mới, người chơi có thể đổi đạo với tổn thất hoặc trung thành và bỏ lợi trước mắt | Một mầm đạo, chưa cần cây kỹ năng lớn |

Mỗi hệ mới phải vượt phép thử: nếu bỏ nó, liệu một lựa chọn hoặc chuỗi hậu quả có biến mất? Nếu chỉ mất một hệ số nhân, chưa thêm hệ đó.

### 3.7. Truyện thủ tục có nguyên nhân, không trộn câu ngẫu nhiên

Một tình huống cần: điều kiện xuất hiện, nhân vật có lý do tham gia, dấu hiệu người chơi thấy, từ hai lựa chọn khác nhau về giá trị, kết quả tức thời, người biết kết quả và một số hậu quả về sau có điều kiện. Không phải mọi lựa chọn đều mở nhiệm vụ mới; chuyện có thể khép lại nhưng vẫn được nhắc đúng hoàn cảnh.

| Nhóm tình huống | Đầu vào quan trọng | Điều phải thay đổi sau lựa chọn |
| --- | --- | --- |
| Cơ duyên | Vị trí, thông tin, vận, nguồn gốc vật | Ai biết mình đang giữ vật; một quyền lợi đi cùng nghĩa vụ |
| Phục kích / cướp bảo | Dấu vết, giá trị đang mang, địch có phương tiện | Mất hàng, vết thương, món nợ, người làm chứng hoặc mối thù |
| Cứu người / cầu viện | Mức nguy, thuốc đang có, mục tiêu của người được cứu | Ân nghĩa không chắc được đền ngay; xác định ai sống và ai biết |
| Lừa đảo / phản bội | Hợp đồng, thông tin lệch nhau, động cơ | Bằng chứng, người chịu thiệt, mạng tin đồn; có cách điều tra trước |
| Giao dịch / đấu giá | Tài sản, hạn mức trả, xuất xứ, quan hệ | Quyền sở hữu, người nhìn thấy giao dịch, trách nhiệm bảo hành |
| Cảnh giới / thiên kiếp | Đạo cơ, chuẩn bị, lời thề, nợ mệnh | Năng lực mới hoặc biến chứng có tên và phương án sống tiếp |
| Chính trị / chiến tranh | Nguồn lực phe, tuyến đường, các lời hứa | Lãnh thổ, giá cả, người mất nơi trú, liên minh mới |
| Hậu quả trở lại | Sự kiện cũ, người/vật còn tồn tại, đường truyền tin | Một người nhìn nhận lại người chơi hoặc một cơ hội bị đổi |

Người được tha chỉ trở thành trưởng lão nếu có nền tảng, thời gian và nguồn lực tương ứng. Khi một NPC chết, chuỗi liên quan có nhánh chuyển sang thư, đồ vật, người thừa kế hoặc kết thúc; không hồi sinh NPC chỉ để đọc đúng đoạn thoại. Hai sự kiện không được đồng thời dùng cùng một bảo vật độc nhất hoặc đặt cùng người ở hai nơi.

Độ mới đến từ thay đổi tác nhân, thông tin và hệ quả, không phải xáo tên rồi giữ cùng phần thưởng. Tạm giới hạn ba hệ quả cá nhân chưa giải quyết được làm nổi bật; các việc còn lại đi vào nhật ký hoặc được gộp thành một tin có quan hệ nhân quả. Không nhồi một thiên tai vào mọi phút để đạt chữ “bất ngờ”.

**Chuỗi A — Cái bóng có quyền giữ tên:** bóng Liên Sương đã thành Sương Tẫn, một đệ tử cứu người, nhưng giữ phần kiếm ý cứu mạng sư phụ nàng. Ép hợp nhất có thể cứu sư phụ và xóa con người mới; bảo vệ bóng phải tìm thuốc chưa chắc có; công khai sự thật giúp tìm người hỗ trợ nhưng biến chuyện riêng thành tranh chấp hai phái. Người chứng kiến nghi thức và vết kiếm trên bia quyết định câu chuyện lan ra. Kiếp sau chỉ bị nhận ra khi đưa tín vật hoặc dùng kiếm thức đặc hữu; sống đủ lâu, Sương Tẫn có thể trở thành người bảo hộ các thực thể bị gọi là tà vật.

**Chuỗi B — Bát canh của người khác:** Hồng Ly giữ đèn ký ức do Lục Nương, em gái Vô Khuyết, bán để cứu con. Lục Nương là đan sư Kết Đan khoảng 330 tuổi, đã dự bữa cơm ba trăm năm trước; đây là ký ức nhân chứng, không phải ký ức của Vô Khuyết bị đổi chủ tùy tiện. Khế ước chỉ cho người mua xem, còn chuyển nhượng/cắt ghép cần Lục Nương đồng ý. Thương lượng để hắn xem ký ức thật và tìm người thay gác tốn nhiều nguồn lực; bí mật sửa bản chiếu có thể làm hắn yên lòng, giữ cổng nhưng vi phạm khế ước; phá đèn chấm dứt khai thác ký ức nhưng mất cơ hội phục hồi. Hồng Ly biết giao dịch, không tự biết một bản chiếu đã bị can thiệp ngoài cửa tiệm.

Lục Nương còn giữ chiếc bát thật tại nhà và chỉ giao cho người được tin. Người chơi hoặc người đưa tin được chỉ định phải đem vật đó tới Vô Khuyết thì vết nứt mới có thể vạch ra bản giả; hắn không tự biết chuyện chưa được chứng kiến. Nếu chết sau khi đã kiếm và neo di sản, người chơi chọn **biên nhận hoặc mảnh bát**, không mang cả hai mặc định. Biên nhận mở đàm phán với chủ tiệm; mảnh bát giúp tiếp cận người gác cổng. Vật còn lại ở với chủ giữ và có thể được tìm lại trong đời sau bằng một hành trình khác.

**Chuỗi C — Ngôi mộ chưa có:** bản đồ Tám Niên vẽ mộ tại trạm tránh thú triều. Lão thấy một tuyến tương lai, không biết mọi nguyên nhân. Trận của trạm đang hút linh mạch khiến thú đổi hướng. Giữ trận cứu người trong trạm nhưng hại làng khác; phá trận cho phép sơ tán nhưng có người không đi nổi; công khai bản đồ giúp cả hai chuẩn bị nhưng cũng lộ kho cứu trợ với quân cướp. Người chèo đò, lính trạm và đoàn buôn mang những phần sự thật khác nhau. Chú thích trên bản đồ đổi khi hành động làm dự đoán lệch; ngôi mộ về sau phải có nguyên nhân từ nhánh đã chọn, không phải cú lật tùy tiện.

### 3.8. Nhịp phiên chơi và ngoại tuyến

Thời gian thực dành cho nhịp sản xuất/bế quan; lời hứa, tuổi và lịch NPC dùng thời gian trong truyện. Công việc công bố cả thời gian chờ và lượng thời gian truyện nó tiêu. Ví dụ thử nghiệm: một phút bế quan xử lý một ngày truyện; một chặng di chuyển tiêu hai ngày truyện. Đây là một dòng lịch chung khi công việc được xử lý, không có hai đồng hồ cộng trùng cho cùng một hành động.

Khi nhận tình huống cần quyết định, công việc và dòng lịch tại điểm đó dừng; đọc thoại, mở trợ giúp, đổi tab không làm tình huống tự hết hạn. Chỉ một hoạt động tiêu thời gian đang chạy; mở menu không chạy thêm lịch luyện song song với bế quan. Các công việc tự động đã chọn tiếp tục khi idle/offline cho đến trần, hết vật tư hoặc gặp quyết định mới.

Trước khi rời game, chọn kế hoạch có thời lượng và mức chi tối đa:

| Kế hoạch | Điều tự thực hiện | Điểm dừng |
| --- | --- | --- |
| Bế quan hoặc sản xuất tại nơi trú đã bảo đảm | Chỉ thực hiện việc đã chọn: tích khí **hoặc** một mẻ thuốc/công việc; thế giới có tin mới theo cùng lịch | Đủ trần, xong việc, hết nguồn cấp hoặc trước khi vượt hạn thọ. Không chết/cướp sạch vì offline |
| Lịch luyện một chặng | Thực hiện chiến thuật và dùng đúng vật tư đã giao cho chặng | Đến ngã rẽ hoặc hiểm nguy chưa được cho phép; không tự đi sâu thêm |
| Hành động chí mạng đã cam kết | Giải quyết đúng cùng kết quả/quy tắc như khi online | Có thể chết nếu đó là rủi ro đã được xác nhận; đóng tab không miễn hậu quả |
| Đang chờ lựa chọn | Giữ nguyên câu hỏi và sự kiện liên quan | Chờ người chơi; im lặng không đồng nghĩa phản bội hoặc đồng ý |

Ngoại tuyến tính tối đa tám giờ mỗi khoảng vắng như nền hiện tại, nhưng không tự bắt đầu lại kế hoạch đã xong. Không có công việc tự chọn thì khi mở lại chỉ nhận tin được xử lý theo lịch đã thực sự tiến; không tự bịa nhiều năm trôi qua. Tin thế giới tóm tắt ai thay đổi, nguyên nhân đã biết và người chơi còn can thiệp được gì. Trần áp dụng cho cả thu và chi; không trả tám giờ thưởng nhưng tính bảy ngày hao thuốc.

Cơ hội trong lời mời đã gửi không mất vì đồng hồ máy chạy qua một phút. Nếu thế giới đã thay đổi do một công việc người chơi chọn hoàn tất, lời mời chuyển thành nhánh mới có ý nghĩa: hàng đã đi, nhưng có thể cứu người vận chuyển hoặc điều tra dấu vết. Không có điểm danh, streak hoặc nhiệm vụ bắt người chơi thức dậy đúng giờ thực.

### 3.9. Hình ảnh, âm thanh và cách đọc nguy hiểm

Ba palette của Sơn Hải tiếp tục là nền mỹ thuật. Sắc ngọc/hồng đào gợi vẻ đẹp có điều bất thường; chàm/hổ phách cho giao dịch và người ẩn danh; đỏ son/bạc lạnh báo vết thương của thế giới. Màu không phải dấu hiệu nguy hiểm duy nhất: hình dấu ấn, đường viền, nhãn và lời mô tả cùng truyền thông tin, hỗ trợ người khó phân biệt màu.

Nhân vật cần thể hiện tình trạng bằng dáng và trang phục: thương chân đổi tư thế, áo bị cháy sau lôi kiếp, kiếm có vết khuyết sau khi chắn đòn. NPC thay vị trí/quầy hàng theo tình thế; khi chiến tranh tới, cầu vắng và đèn đóng trước khi nhật ký giải thích. Những thay đổi nhìn thấy phải có nguyên nhân trong trạng thái trò chơi.

Màn nguy hiểm ưu tiên cảnh, dấu hiệu và 2–3 lựa chọn. Chi tiết xác suất, vật tư, lời hứa và lịch sử có thể mở ra nhưng không che nút rút lui. Chênh cảnh giới lớn hiện bằng danh xưng/linh áp và nhãn “không thể đối đầu trực diện”, không chỉ một con số lực chiến khó hiểu.

Đột phá: tiếng nền hạ xuống → đường linh khí sáng qua kinh mạch → đạo ấn xuất hiện → lôi quang → khoảng lặng → hậu quả bằng hình và chữ. Có nút bỏ qua trình diễn; lựa chọn luôn đọc được. Khi gần chết, âm thanh và màu giảm dần thay vì nhấp nháy gấp. Tắt âm/thanh, tiết kiệm pin và reduced-motion không làm mất thông tin hoặc lợi thế.

Văn phong: ngắn, có vật cụ thể và một chi tiết lệch khiến người chơi muốn hỏi. Hài hước từ con người và tình thế, không cắt ngang mọi cái chết bằng câu đùa. Một NPC có thể nói sai hoặc nói dối; lời UI về chi phí và thao tác không được nói dối.

### 3.10. Kinh tế, cân bằng và chống khai thác trong luồng chơi

| Tài nguyên | Nguồn | Nơi tiêu / giới hạn |
| --- | --- | --- |
| Linh khí | Bế quan, đan, cơ duyên có điều kiện | Đột phá/ứng phó, trần chứa theo đạo cơ; tích lũy không thay thế hiểu đạo |
| Linh thạch | Công việc hoàn tất, bán hàng có nhu cầu, thưởng khế ước | Thông tin, thuốc, chữa thương, nơi trú, phí nghề và nợ cứu mạng |
| Nguyên liệu | Nguồn khai thác hữu hạn, trồng với đất/nước, trao đổi | Mỗi mẻ thuốc/phù/trận tiêu vật tư; giống tốt không sinh vô hạn vật độc nhất |
| Sức khỏe / đạo cơ | Nghỉ, chữa trị, nhiệm vụ phục hồi | Chấn thương làm giảm lựa chọn; không bắt bấm nhiều lần để chữa |
| Tuổi còn lại | Đột phá nâng trần, đan hạn chế | Công việc dài và thuật tổn thọ; không đổi ngược thành tiền để mua vô hạn tuổi |
| Tín nhiệm / nghĩa vụ | Việc làm có người biết, khế ước hoàn tất | Xin bảo lãnh, gọi trợ giúp; quan hệ không phải tiền chung đổi được ở mọi NPC |
| Ký ức / di sản | Thành tựu có nguồn gốc đã neo | Chỉ một di sản được chọn cho kiếp sau; không phát theo số lần chết |

Ví dụ kinh tế để đo thử, chưa dùng làm bảng giá phát hành: việc an toàn một chặng thu ròng 6–10 linh thạch và không có đồ hiếm. Tuyến hiểm tốn 10 chuẩn bị; ba kết quả cơ sở là 60% nhận 30, 30% nhận 15 nhưng tốn 8 chữa trị, 10% rút lui không thu. Lợi nhuận kỳ vọng: `0,6×30 + 0,3×(15−8) + 0,1×0 − 10 = 10,1`. Số tiền cao hơn việc an toàn phải đánh đổi bằng phương sai và thương tích, không phải vừa nhiều hơn vừa chắc hơn.

Mua tin giá thử 6 chuyển bảng kết quả thành 75%/20%/5% với các khoản thu/chi trên: ròng kỳ vọng `0,75×30 + 0,2×(15−8) − 10 − 6 = 7,9`. Người chơi mua sự ổn định và khả năng bảo toàn cơ thể, không mặc định tối đa hóa lời. Phù thoát thân giá thử 12 áp dụng cho nhánh đi sâu đã có nguy cơ chí mạng, **không** phải phí bắt buộc trong bảng thám hiểm thường vốn không có chết. Không cộng tùy tiện tất cả đồ chuẩn bị rồi giữ nguyên phần thưởng; mỗi tuyến cần so sánh phương án cụ thể.

Cửa hàng có nhu cầu và tồn kho; phí, hao vật tư, nhu cầu giảm và thời gian trong truyện ngăn vòng mua–bán tức thì sinh lời chắc chắn. Không tự tăng giá bí mật chỉ để bắt kịp tiền của người chơi. Hạn mức giao dịch phải là dữ kiện có thể hiểu: cửa hàng hết vốn, tuyến hàng bị chặn hoặc hàng đang dư.

| Kiểu khai thác | Hợp đồng thiết kế |
| --- | --- |
| Spam thiền/du ngoạn | Bấm không tạo thêm nhịp thời gian hoặc thưởng; nguồn/chặng hữu hạn, cùng việc chỉ thưởng một lần |
| Reload để đổi vận | Tình huống đã cam kết giữ cùng cơ hội/kết quả qua reload; muốn thay cần chuẩn bị hoặc chọn hành động khác có giá |
| Đóng tab trước thất bại | Cam kết còn nguyên; online/offline giải cùng luật, không xử lại thành một lần may mới |
| Chết để farm hoặc tua lịch | Không thưởng khi chết, không reset nguồn thưởng cũ; một suất di sản; truyền thừa hoặc chờ bảy ngày khi sống cho đường thay thế tương ứng |
| Đổi đồng hồ / nhận lại offline | Không ghi nhận lại khoảng đã xử lý; trần thu/chi nhất quán, đồng hồ lùi không tạo thưởng |
| Save hỏng / nhiều tab | Không ghi state rỗng đè bản cũ; lỗi cần hiện rõ, có đường khôi phục; không nhân đôi thưởng khi nhập/reload |
| Một đường tu thắng mọi tình huống | Có cặp lựa chọn đối nghịch về thông tin, khả năng chịu đòn, dấu vết và quan hệ; thử cùng mục tiêu với các build khác nhau |

Đây là game một người lưu cục bộ: không hứa ngăn tuyệt đối sửa save hoặc phục hồi bản sao ngoài game. Checksum phát hiện hỏng dữ liệu không phải chữ ký chống gian lận. Nếu sau này có giao dịch/PvP mới cần duyệt riêng nguồn sự thật và xác nhận trên server; không thêm multiplayer ngầm vào phạm vi này.

## 4. Ví dụ một phiên mở đầu mười phút

Đây là mục tiêu nhịp trải nghiệm khi người chơi đọc bình thường, **không phải đồng hồ đếm ngược**. Người đọc chậm có thể mất hai mươi phút với cùng kết quả. Bản thử có thể cho người chơi bắt đầu ở Luyện Khí tầng 1; dẫn nhập phàm nhân nằm trong lựa chọn xuất thân, chưa cần một chương riêng.

Giả thuyết để dựng thử: 30 linh thạch, một Thanh Tâm Đan, một phù dẫn lôi và một tín vật cũ chưa rõ nguồn; ngưỡng tầng 2 là 100 linh khí, một lượt bế quan nhập môn cho 20. Các lượt ngắn phục vụ onboarding không tự cho linh khí khi bấm; đây là công việc hoàn tất có thời lượng được công bố. Phần lớn chi tiết ngoài tuyến dưới có thể chưa xuất hiện trong bản thử.

| Phút | Việc xảy ra | Quyết định / dữ kiện được giữ |
| --- | --- | --- |
| 0–1 | Chọn tên, dáng hình và xuất thân; nhận hộp gửi cho chính mình, niêm chỉ mở sau Vấn Danh Lôi | Không có hạn giao hộp; được xem điều khoản và nhận hoặc từ chối. Dòng “ngày mai” là ngày trên lời khai bên trong về một việc còn chưa xảy ra, không phải deadline ngầm |
| 1–2 | Tu luyện lần đầu giữa mây, nhận 20 linh khí | Thấy tạp khí khi chọn hấp thu mạnh; đã có tín hiệu dấu mệnh khác thường |
| 2–3 | Dấu kiếm trên đường; một người đang bị truy đuổi | Biết đối thủ trên cảnh giới. Trốn, đánh lạc hướng hoặc thương lượng; không dạy bằng trận buộc phải thua |
| 3–4 | Đến trạm Tám Niên, gặp người bị thương | Dùng Thanh Tâm Đan cho người ấy hoặc giữ để giảm bất ổn nghi thức. Người chèo đò chứng kiến, không nhận lại ngay một viên khác để xóa đánh đổi |
| 4–5 | Tám Niên đổi một chuyện thật lấy bản đồ; tới điểm nghỉ | Người chơi biết phù dẫn lôi giúp sống nhưng không đảm bảo thành công. Được giới thiệu cách neo một di sản |
| 5–7 | Hai lượt bế quan hoàn tất, thêm 40 linh khí; xem lại kinh mạch | Tổng 60. Người giữ đan có chuẩn bị tốt hơn; người đã cứu người có một đầu mối quan hệ, chưa có cứu viện đảm bảo |
| 7–8 | Cơ duyên nhập môn đã điều tra cho 40 linh khí, đủ 100; hiện cảnh báo Vấn Danh Lôi | Phần thưởng một lần có nguồn gốc từ tuyến bản đồ, không phải bấm tiếp nhận khí. Có thể hoãn, điều tức hoặc bắt đầu nghi thức |
| 8–9 | Bắt đầu nghi thức, lôi quang dừng ở khoảnh khắc lựa chọn | Dẫn lôi bằng phù, bỏ nghi thức giữ thân hoặc cưỡng ép trước cảnh báo chí mạng; đọc bao lâu tùy ý |
| 9–10 | Nhánh sống mở tầng 2 hoặc về trạm mang thương tích; nhánh chết mở màn di sản | Người sống mở hộp thấy lời khai của chính mình về một việc chưa xảy ra. Người chết chỉ sau lựa chọn chí mạng, chọn di sản đã neo rồi mở kiếp mới cùng thế giới |

Tuyến từ chối hộp vẫn học bế quan, nguy hiểm, chuẩn bị và đột phá qua một khế ước dẫn đường; không nhận đúng món thưởng của hộp và không bị ép phải nhận lại nó. Các nhánh không cần kết thúc đồng thời hoặc cùng lượng tài nguyên. Nhánh rút lui có câu chuyện tiếp tục và được thử sau khi chuẩn bị lại; không coi đó là màn thua.

Luân hồi không bị ép trong tutorial. Nếu người chơi sống, màn truyền thừa giải thích hệ thống qua di tích hoặc lời nhân chứng; bản thử kiểm nhánh chết bằng lựa chọn chủ động hoặc kịch bản QA riêng. Sự xuất hiện của lời khai không khẳng định tiên tri luôn đúng: giấy có thể bị giả, tương lai có thể đổi, và có cách điều tra ở phiên kế tiếp.

## 5. Phạm vi bản thử và các mốc sau khi duyệt

Đây là ranh giới nghiệm thu gameplay, không phải thiết kế kiến trúc hoặc chỉ thị triển khai ngay các mốc sau.

| Mốc | Nội dung có thể chơi | Điều chưa cần có |
| --- | --- | --- |
| Đồ họa, đã có | Ba miền, nhân vật theo profile, bốn NPC trò chuyện minh họa | Nhân quả/chiến đấu/lịch NPC chưa vận hành |
| Bản chơi xuyên suốt đầu tiên | Tạo nhân vật → tu luyện → nguy hiểm → chuẩn bị → Vấn Danh Lôi → sống hoặc chết/di sản/kiếp mới; một hậu quả trở lại | Chỉ dùng một tuyến ở Vân Hải, 2 NPC chủ chốt, một kiểu đột phá; không giả làm đủ toàn thế giới |
| Chương nhân quả | Một chuỗi truyện nhiều nhánh, NPC biết theo nhân chứng, nợ có thể hoàn thành hoặc phản bội | Chưa cần đầy đủ tông môn hoặc mọi nghề |
| Thế giới và kinh tế | Ba miền có đường đi, lịch hoạt động và một biến động lớn; offline theo kế hoạch | Mở rộng cảnh giới/nghề dựa trên kết quả thử chơi |

Độ sâu trước số lượng: mỗi mốc phải có lý do chơi lại khác đi, kết quả được lưu đúng và một đường phục hồi sau thất bại. Không xuất bản một menu đầy khóa để tuyên bố đã có các hệ còn lại.

## 6. Những gì cần kiểm chứng trước khi gọi thiết kế là thành công

| Câu hỏi thử chơi | Cách quan sát | Mục tiêu ban đầu, chưa được đo |
| --- | --- | --- |
| Người mới hiểu giá của lựa chọn? | Sau cảnh nguy hiểm, hỏi họ vì sao chọn và điều có thể mất | Ít nhất 4/5 người thử đầu giải thích đúng rủi ro chính; mẫu nhỏ chỉ để phát hiện vấn đề, không chứng minh thống kê |
| Có “chuyện của tôi” sau phiên đầu? | Hỏi lại sự kiện mà không nhắc tên vật phẩm/chỉ số | Người chơi kể được một quyết định và một người bị ảnh hưởng |
| Có chiến thuật thống trị? | Cùng mục tiêu, thử giữ thuốc/cứu người, đường an toàn/hiểm, Kiếm/Thể/Hồn | Không một lựa chọn vừa hơn tài nguyên, an toàn, thông tin và quan hệ trong mọi trường hợp |
| Chết có cảm giác có nguyên nhân? | Xem lại nhật ký dấu hiệu–cam kết–kết quả | Người thử chỉ được điểm đã vượt ranh giới; không có chết do đọc chậm hoặc đổi tab |
| Di sản có tạo lựa chọn? | So sánh ký ức, tín vật và huyết mạch trong đời kế | Mỗi loại mở một tình thế khác nhau, không chỉ tăng % |
| Offline giữ đúng lời hứa? | Cùng kế hoạch online/offline, ngắt ở lúc quyết định và đổi đồng hồ | Cùng luật thu/chi/hậu quả, không lặp thưởng hoặc tự quyết thay người chơi |
| Sự kiện còn nhất quán? | NPC chết/vắng mặt, tin sai, đồ độc nhất, luân hồi | Không có người biết điều chưa được truyền; không có cùng vật ở hai chủ |
| Đồ họa hỗ trợ quyết định? | Điện thoại nhỏ, chữ lớn, tắt tiếng/chuyển động | Vẫn đọc được cảnh báo, chi phí và nút rút lui; không dùng hiệu ứng thay thông tin |

## 7. Trạng thái và điểm cần duyệt

Đã đối chiếu phạm vi hiện tại từ mã nguồn và lời thoại Sơn Hải; đã rà thiết kế về farming chết, spamclick, tải lại đổi vận, offline và mâu thuẫn trí nhớ. **Chưa có mô phỏng cân bằng, người thử gameplay hoặc triển khai các luật mới.** Kiểm TypeScript/Vitest/build của repo chỉ xác nhận nền hiện tại, không xác nhận GDD này đã chơi được hoặc cân bằng.

Các điểm mặc định để người dùng duyệt: cái chết có thật nhưng cần cam kết nguy hiểm; một di sản cho mỗi kiếp kế; không chết chỉ vì offline an toàn; ký ức thế giới dựa trên người và vật; chỉ làm sâu Luyện Khí 1–2 trong bản chơi xuyên suốt đầu tiên. Tỉ lệ, giá, thời lượng, thọ nguyên và tốc độ tiến cảnh đều có thể đổi sau thử nghiệm.

Sau khi người dùng duyệt Phase 1 mới sang Phase 2: chọn kiến trúc, mô hình save/thế giới, luật xác định kết quả và cách viết nội dung mở rộng. Sau Phase 2 mới triển khai từng mốc có thể chơi, báo điều đã chạy/giới hạn/cách thử và chờ phản hồi sau mỗi mốc. Save hiện có phải được bảo toàn; việc chuyển từ hành trình thư giãn sang chiến dịch mới cần lựa chọn rõ ràng, không tự biến một save cũ thành đời tu có thể chết.
