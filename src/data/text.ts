// Nội dung tiếng Việt giữ nguyên từ bản HTML; hàm chỉ nội suy dữ liệu hiển thị.
export const TEXT = {
  message001: (value0: unknown, value1: unknown) =>
    `${value0} giờ ${value1} phút`,
  message002: (value0: unknown, value1: unknown) =>
    `${value0} phút ${value1} giây`,
  message003: (value0: unknown) => `${value0} giây`,
  message004: "Một buổi sớm mây lành, ngươi bắt đầu con đường tu hành.",
  message005: "Không thể lưu tiến độ:",
  message006:
    "Trình duyệt đang chặn lưu trữ. Hãy dùng <b>Sao lưu</b> để giữ lại hành trình.",
  message007: (value0: unknown) => `Luyện Khí · tầng ${value0}`,
  message008: (value0: unknown) => `Luyện Khí ${value0}`,
  message009: (value0: unknown) => `Nhặt được cơ duyên “${value0}”.`,
  message010: (value0: unknown) => `✧ Cơ duyên mới: <b>${value0}</b>`,
  message011: (value0: unknown) =>
    `✧ Có thêm <b>${value0} cơ duyên</b> trên hành trình.`,
  message012: (value0: unknown) =>
    `Lò đan hé nắp: luyện thành một viên ${value0}.`,
  message013: (value0: unknown) =>
    `⚗ Lò đan đã chín: <b>${value0}</b> thơm lừng!`,
  message014: (value0: unknown, value1: unknown) =>
    `Bế quan ${value0}, hấp thu ${value1} linh khí trong tĩnh lặng.`,
  message015: (value0: unknown) =>
    `🌙 Trong lúc bế quan, ngươi hấp thu được <b>${value0} linh khí</b>.`,
  message016: (value0: unknown) =>
    `☯ Tĩnh tọa an nhiên <b>+${value0} linh khí</b>.`,
  message017: "☁ Ngươi đã Phi Thăng. Đường mây vẫn rộng để tiếp tục nhàn du.",
  message018: (value0: unknown) =>
    `✧ Còn cần <b>${value0} linh khí</b>, cứ thong thả.`,
  message019: (value0: unknown, value1: unknown) =>
    `Đột phá ${value0} chưa thành, chỉ hao ${value1} linh khí. Đạo tâm vẫn vững.`,
  message020:
    "🌦 Gió đổi chiều một chút. Đột phá chưa thành, chỉ hao <b>6% linh khí yêu cầu</b>.",
  message021: (value0: unknown) => `Thiên kiếp · ${value0}`,
  message022:
    "Thiên lôi đi qua, một cánh cửa mới sắp mở. Giữ đạo ấn khoảng một nhịp thở để bình an vượt kiếp.",
  message023: "☯ Chạm và giữ đạo ấn",
  message024: (value0: unknown, value1: unknown) =>
    `✧ Đột phá thành công lên ${value0}! Trời đất ban ${value1} linh thạch.`,
  message025: (value0: unknown) =>
    `⚡ Đã bình an vượt thiên kiếp, mở ra: ${value0}.`,
  message026: (value0: unknown, value1: unknown) =>
    `✧ Chúc mừng tiến vào <b>${value0}</b>! Nhặt được <b>${value1} linh thạch</b>.`,
  message027: "Linh thạch chưa đủ, du ngoạn đôi chuyến là có thêm.",
  message028: (value0: unknown, value1: unknown) =>
    `Đọc thêm một tầng ${value0}, đạt cấp ${value1}.`,
  message029: (value0: unknown, value1: unknown) =>
    `📜 ${value0} tăng lên <b>cấp ${value1}</b>.`,
  message030: "Linh thạch chưa đủ để sửa động phủ.",
  message031: (value0: unknown) =>
    `Sửa sang động phủ lên cấp ${value0}, linh mạch thêm dồi dào.`,
  message032: (value0: unknown) =>
    `⌂ Động phủ lên <b>cấp ${value0}</b>, hấp thu tăng thêm.`,
  message033: "Chưa đủ linh thạch để mua hạt giống.",
  message034: (value0: unknown, value1: unknown) =>
    `Gieo ${value0} tại linh điền số ${value1}.`,
  message035: (value0: unknown) =>
    `🌱 ${value0} đã xuống đất. Cứ để thời gian chăm giúp.`,
  message036: (value0: unknown, value1: unknown, value2: unknown) =>
    `Thu hoạch ${value0} ${value1} ở linh điền số ${value2}.`,
  message037: (value0: unknown, value1: unknown) =>
    `🌿 Thu hoạch <b>${value0} ${value1}</b>, thật thơm mùi cỏ.`,
  message038: "Thiếu dược liệu hoặc linh thạch, chưa thể nhóm lò.",
  message039: (value0: unknown) =>
    `Nhóm lò luyện ${value0}. Hương đan chờ đủ hỏa hầu.`,
  message040: (value0: unknown) =>
    `⚗ Đã nhóm lò <b>${value0}</b>. Có thể đóng game và quay lại sau.`,
  message041: "Đạo tâm đang an định. Hãy dùng sau lần đột phá tiếp theo.",
  message042: "🟢 Tụ Khí Đan tan ra: <b>+65% hấp thu trong 10 phút</b>.",
  message043: "🟡 An Tâm Đan: <b>+18% thành công</b> cho lần đột phá kế tiếp.",
  message044: (value0: unknown) =>
    `🟣 Ngọc Lộ Đan: nhận thêm <b>${value0} linh khí</b>.`,
  message045: (value0: unknown) =>
    `Dùng một viên ${value0}, tâm cảnh thêm khoan khoái.`,
  message046: (value0: unknown, value1: unknown, value2: unknown) =>
    `+${value0} linh thạch · +${value1} linh khí${value2}`,
  message047: (value0: unknown, value1: unknown) =>
    `Du ngoạn ${value0} lần, gần nhất ghé qua “${value1}”.`,
  message048: (value0: unknown) => `☁ Một đoạn nhân duyên: <b>${value0}</b>.`,
  message049: (value0: unknown) => `🔒 Tính năng này mở tại <b>${value0}</b>.`,
  message050: (value0: unknown) => `Cấp ${value0}`,
  message051: "Tắt âm thanh môi trường",
  message052: "Bật âm thanh môi trường",
  message053: (value0: unknown) =>
    `<span class="dot"></span>Tụ Khí Đan: hấp thu +65%, còn ${value0}.`,
  message054: () => `✧ An Tâm Đan: +18% đột phá lần tới.`,
  message055:
    "Không có hiệu ứng tạm thời. Tâm đã tĩnh cũng là một loại công pháp.",
  message056: "<li>Trang giấy còn thơm mực mới.</li>",
  message057: " · Tiên lộ vô tận",
  message058: (value0: unknown) => `/ ${value0} linh khí`,
  message059: "Mây trời còn rộng, cứ tu hành tiếp.",
  message060: "Linh khí đã viên mãn, thời điểm tùy tâm.",
  message061: "Một chút mỗi giây, đạo lộ dần rộng.",
  message062: (value0: unknown) => `+${value0} / giây`,
  message063: "Tiên thọ",
  message064: (value0: unknown) => `${value0} năm`,
  message065: (value0: unknown) => `×${value0}`,
  message066: (value0: unknown) => `Thành công ${value0}%`,
  message067: "✧ Đã Phi Thăng",
  message068: "✧ Đột phá cảnh giới",
  message069:
    "✦ Ngươi đã Phi Thăng. Du ngoạn tiên giới, đọc kinh và chăm vườn vẫn tiếp tục.",
  message070:
    "<b>Đã đủ linh khí.</b> Đột phá khi lòng muốn, không có thời hạn.",
  message071: (value0: unknown) =>
    `Mỗi lần tĩnh tọa thêm <b>${value0} linh khí</b> · không bắt buộc.`,
  message072: "Gió kể chuyện núi",
  message073: "Chỉ cần bước đi, nhân gian sẽ tặng ngươi vài câu chuyện nhỏ.",
  message074: "Trà còn ấm, đạo còn dài",
  message075: "Nhấp một ngụm trà. Hôm nay không cần vội lên tiên.",
  message076: "Một cành trúc, một vầng trăng",
  message077: "Lúc ngước nhìn trời, ngươi cũng đang tu hành.",
  message078: "Người nhàn có phúc",
  message079: "Mây đi chậm, gió đi nhẹ, lòng mình cũng vậy.",
  message080: "Đạo tại thường ngày",
  message081: "Trồng một mầm cây, uống một ngụm nước, đều là cơ duyên.",
  message082: "Nhất niệm thanh an",
  message083:
    "Đừng đo thời gian bằng số lần đột phá, hãy đo bằng những nụ cười.",
  message084: (value0: unknown, value1: unknown, value2: unknown) =>
    `<span class="wide-stat">Cộng hưởng <b>×${value0}</b></span><span class="wide-stat">Tổng cấp <b>${value1}</b></span><span class="wide-stat">Linh thạch <b>${value2}</b></span>`,
  message085: (value0: unknown) =>
    `<div class="locked-curtain">🔒 Mở tại ${value0}</div>`,
  message086: "Đã viên mãn",
  message087: (value0: unknown) => `◇ ${value0} linh thạch`,
  message088: "Viên mãn",
  message089: "Tham ngộ +",
  message090: (
    value0: unknown,
    value1: unknown,
    value2: unknown,
    value3: unknown,
    value4: unknown,
    value5: unknown,
    value6: unknown,
    value7: unknown,
    value8: unknown,
  ) =>
    `<div class="card shop-card ${value0}"><div class="item-icon">${value1}</div><div style="display:flex;align-items:center;gap:9px;flex-wrap:wrap"><h3 class="item-title">${value2}</h3><span class="item-badge">${value3} phẩm</span></div><p class="item-summary">${value4}<br><span class="item-meta">Mỗi cấp +${value5}% tốc độ · Cấp ${value6}/${value7}</span></p>${value8}</div>`,
  message091: (value0: unknown) => `Động phủ · cấp ${value0}`,
  message092: (value0: unknown, value1: unknown) =>
    `<span class="wide-stat">Linh khí nền <b>×${value0}</b></span><span class="wide-stat">Linh điền <b>${value1} ô</b></span><span class="wide-stat">Lần nâng cấp tới <b>+20%</b></span>`,
  message093: "Động phủ đã viên mãn",
  message094: (value0: unknown) => `Nâng cấp · ${value0} linh thạch`,
  message095: (value0: unknown, value1: unknown) =>
    `<div class="card plot-card"><h4>🌿 Linh điền thứ ${value0}</h4><p>Khoảnh đất chờ một hạt mầm nhỏ.</p><div class="plot-empty">✧ Đất tơi, sương đủ, sẵn sàng gieo trồng</div><div class="plot-controls">${value1}</div></div>`,
  message096: "✦ Linh thảo đã lớn, hái lúc nào cũng được.",
  message097: (value0: unknown) => `Đang lớn lên · còn khoảng ${value0}`,
  message098: "✦ Thu hoạch",
  message099: "Đợi sương nuôi cây",
  message100: (
    value0: unknown,
    value1: unknown,
    value2: unknown,
    value3: unknown,
    value4: unknown,
    value5: unknown,
    value6: unknown,
    value7: unknown,
    value8: unknown,
    value9: unknown,
    value10: unknown,
  ) =>
    `<div class="card plot-card"><h4>${value0} Linh điền thứ ${value1}</h4><p>${value2} · ${value3}</p><div class="botanical" style="height:73px;margin:10px 0"><span class="plant">${value4}</span><span class="plant">🍃</span></div><div class="garden-bar"><div class="garden-fill" style="width:${value5}%"></div></div><p>${value6}</p><div class="plot-controls"><button type="button" class="${value7}" data-action="harvest" data-plot="${value8}" ${value9}>${value10}</button></div></div>`,
  message101: (value0: unknown) =>
    `<div class="inventory-row">${value0}</div><p class="footnote">Sau khi đủ thời gian, cây không héo và chẳng bao giờ mất mùa.</p>`,
  message102: (value0: unknown, value1: unknown, value2: unknown) =>
    `<div class="elixir-active"><strong>🔥 Đang dưỡng lửa: ${value0}</strong><p>Lửa trong lò cháy đều. Còn khoảng ${value1} · có thể đi làm việc khác.</p><div class="garden-bar"><div class="garden-fill" style="width:${value2}%"></div></div></div>`,
  message103:
    '<div class="elixir-active"><strong>✧ Lò đan đang nghỉ</strong><p>Chọn một đan phương bên dưới. Chẳng cần canh giờ, đủ hỏa hầu đan tự thành.</p></div>',
  message104: (value0: unknown, value1: unknown) => `${value0} ×${value1}`,
  message105: (value0: unknown) =>
    `<div class="locked-curtain">🔒 Mở tại ${value0}</div>`,
  message106: "Lò đang bận",
  message107: "Đủ dược liệu",
  message108: "Chưa đủ dược liệu",
  message109: (value0: unknown, value1: unknown, value2: unknown) =>
    `<div class="item-bottom"><span class="item-meta">${value0}</span><button type="button" class="little-button" data-action="brew" data-id="${value1}" ${value2}>Nhóm lò</button></div>`,
  message110: (
    value0: unknown,
    value1: unknown,
    value2: unknown,
    value3: unknown,
    value4: unknown,
    value5: unknown,
    value6: unknown,
    value7: unknown,
  ) =>
    `<div class="card shop-card ${value0}"><div class="item-icon">${value1}</div><h3 class="item-title">${value2}</h3><p class="item-summary">${value3}<br><span class="item-meta">⌛ ${value4} · ◇ ${value5} linh thạch</span><br><span style="color:var(--muted);font-size:.67rem">Cần: ${value6}</span></p>${value7}</div>`,
  message111: "Đã có trong túi",
  message112: "Chưa sở hữu",
  message113: (
    value0: unknown,
    value1: unknown,
    value2: unknown,
    value3: unknown,
    value4: unknown,
    value5: unknown,
    value6: unknown,
  ) =>
    `<div class="card shop-card" style="min-height:160px"><div class="item-icon">${value0}</div><h3 class="item-title">${value1} <span class="item-badge">×${value2}</span></h3><p class="item-summary">${value3}</p><div class="item-bottom"><span class="item-meta">${value4}</span><button type="button" class="little-button" data-action="use-potion" data-id="${value5}" ${value6}>Dùng đan</button></div></div>`,
  message114: (value0: unknown, value1: unknown, value2: unknown) =>
    `<p class="page-eyebrow">MỘT ĐOẠN NHÂN DUYÊN</p><h2>${value0}</h2><div class="story-lines">${value1}</div><div class="adventure-reward">✧ ${value2}</div>`,
  message115:
    '<p class="page-eyebrow">GÓC TRỜI CHƯA GHÉ</p><h2>Nắng đẹp, có muốn xuống núi?</h2><div class="story-lines"><p>Gió lướt qua hàng trúc, phía xa vang tiếng chuông chùa.</p><p>Con đường dưới chân núi trải dài giữa những mái nhà yên ả.</p><p>Ngươi chỉ cần bước một bước, chuyện vui sẽ tự tìm đến.</p></div>',
  message116: (value0: unknown) => `${value0} chuyến đi`,
  message117:
    '<div class="empty-state">Chưa có chuyến du ngoạn nào. Ngọn núi đang đợi bước chân đầu tiên.</div>',
  message118: (value0: unknown) => `${value0} trang lưu dấu`,
  message119: "<li><p>Chưa có gì được ghi lại.</p></li>",
  message120: "<time>Chưa gặp cơ duyên</time>",
  message121: "Chuỗi sao lưu rỗng hoặc không phải Base64 hợp lệ.",
  message122: "📜 Đã sao chép chuỗi sao lưu.",
  message123:
    "Hãy bấm <b>Ctrl+C</b> (hoặc Sao chép trên điện thoại) để lưu chuỗi.",
  message124: (value0: unknown) =>
    `Sau khi khôi phục, bế quan nhận ${value0} linh khí.`,
  message125: "✧ Bản lưu đã được khôi phục. Mây cũ lại về bên hiên.",
  message126: (value0: unknown) => `Không thể nhập bản lưu: <b>${value0}</b>`,
  message127: "♪ Gió đã lặng, lại là yên tĩnh.",
  message128: "Không hỗ trợ",
  message129: "♪ Tiếng gió và chuông đã khẽ ngân.",
  message130: "Trình duyệt không hỗ trợ âm thanh lúc này.",
  message131: "✧ Đạo tâm vững như núi",
  message132: "☯ Đang cảm nhận lôi quang...",
  message133: "☯ Chạm và giữ đạo ấn",
  message134:
    "Không đọc được bản lưu. Tự lưu đang khóa để bảo vệ dữ liệu cũ. Hãy sao lưu dữ liệu trình duyệt trước khi xử lý.",
  message135: "Bản lưu không đúng định dạng phiên bản 1.",
  message136: "Chuyến đi nhỏ",
  message137: "Một chút bình yên",
  message138: "Một chuyến du ngoạn",
};
