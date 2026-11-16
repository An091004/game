import type { ActorKind } from "../graphics/actors";
import type { SceneId } from "../graphics/scenery";

export const WORLD_TEXT = {
  title: "Ngoài kia, trời đất rất rộng.",
  eyebrow: "NHÀN VÂN · SƠN HẢI DỊ VĂN",
  intro:
    "Có núi trôi trên mây. Có chợ chỉ bán những điều đã mất. Có người đứng chờ ngươi từ một kiếp chưa sinh.",
  open: "Bước vào Sơn Hải",
  invitation: "Một cánh cửa vừa mở giữa tầng mây",
  invitationBody:
    "Ba miền đất lạ, bốn người giữ bí mật. Thử đi xa hơn mái hiên một chút.",
  scenes: "Chọn miền đất",
  people: "Duyên gặp giữa đường",
  talk: "Trò chuyện",
  dossier: "NGƯỜI ĐỨNG TRƯỚC NGƯƠI",
  greeting: "Lời gặp đầu",
  still: "Dừng chuyển động",
  moving: "Cho cảnh chuyển động",
  journey:
    "Chuyến thưởng cảnh không tiêu hao tài nguyên. Các lời kể ở đây chưa tạo nhiệm vụ hoặc thay đổi quan hệ.",
  hero: "Dấu chân của ngươi",
  heroHint: "Dáng áo và mái tóc theo nhân vật của ngươi.",
  edit: "Đổi dáng hình",
  illustration: "Tranh cảnh",
  chapter: "DỊ VĂN",
  npcHint: "Chạm tên người trong tranh hoặc chọn chân dung để trò chuyện.",
  emptyName: "Khách qua đường",
};

export interface WorldNpc {
  id: string;
  kind: ActorKind;
  name: string;
  title: string;
  accent: string;
  detail: string;
  greeting: string;
  topics: { label: string; reply: string }[];
}

export const WORLD_NPCS: WorldNpc[] = [
  {
    id: "liensuong",
    kind: "swordswoman",
    name: "Liên Sương",
    title: "Kiếm khách giữ mùa xuân",
    accent: "#91e4dc",
    detail:
      "Một thanh kiếm không có bóng. Một vạt áo luôn vương cánh đào, dù nơi nàng đứng đã vào đông.",
    greeting:
      "Đừng đếm những hòn đảo. Hôm qua có chín. Hôm nay có mười. Hòn mới đến đang mang tên một người còn sống.",
    topics: [
      {
        label: "Vì sao kiếm không có bóng?",
        reply:
          "Ta đã chém nó khỏi mình để cứu sư phụ. Bây giờ cái bóng ấy đang học kiếm ở một môn phái khác. Nghe nói… nó có thiên phú hơn ta.",
      },
      {
        label: "Cá kình trong mây đi về đâu?",
        reply:
          "Nó chở những trận mưa chưa từng rơi. Khi nó hát, hãy giấu tên thật đi. Núi ở đây có thói quen gọi người bằng tên của kiếp trước.",
      },
    ],
  },
  {
    id: "tamnien",
    kind: "elder",
    name: "Ông Tám Niên",
    title: "Người vẽ bản đồ ngày mai",
    accent: "#f2ca82",
    detail:
      "Lão bán bản đồ của những nơi chưa xuất hiện. Tám năm trước, lão đã bán tấm bản đồ dẫn đến chính ngôi mộ của mình.",
    greeting:
      "Muốn đường ngắn hay đường còn sống? Giá như nhau. Chỉ có khách trẻ là luôn nghĩ đó cùng một con đường.",
    topics: [
      {
        label: "Cho xem tấm bản đồ trắng",
        reply:
          "Trắng là đúng rồi. Nó vẽ nơi ngươi sẽ về khi chẳng còn ai nhớ tên. Mua không? À, đừng trả linh thạch. Kể lão nghe một chuyện thật là được.",
      },
      {
        label: "Ông đã chết một lần?",
        reply:
          "Một lần thì có gì đáng kể. Điều phiền là lần nào cũng phải trả lại tiền đặt cọc quan tài. Người đời bây giờ làm ăn thiếu linh hoạt quá.",
      },
    ],
  },
  {
    id: "hongly",
    kind: "fox",
    name: "Hồng Ly",
    title: "Chủ tiệm ký ức thất lạc",
    accent: "#ffadc1",
    detail:
      "Bốn chiếc đuôi, hai cái tên giả, một chiếc quạt giấu đầy khế ước. Nàng chỉ nói dối khi người nghe muốn được lừa.",
    greeting:
      "Khách mới? Ta có một đêm ngủ yên, tiếng cười của cố nhân, và nửa phần vận may. Đừng hỏi nửa còn lại đang ở trong ai.",
    topics: [
      {
        label: "Những chiếc đèn chứa gì?",
        reply:
          "Lời hứa. Đèn sáng là còn người chờ. Đèn tắt… chưa chắc đã có người quên. Nếu thấy một chiếc mang tên ngươi, nhớ mặc cả trước khi hoảng.",
      },
      {
        label: "Nàng có bán ký ức của mình?",
        reply:
          "Có. Ta đã bán ký ức về người đầu tiên thương ta. Được giá lắm. Chỉ lạ là mỗi lần kể chuyện ấy, chiếc đuôi thứ ba lại không chịu nghe lời.",
      },
    ],
  },
  {
    id: "vokhuyet",
    kind: "sentinel",
    name: "Vô Khuyết",
    title: "Người gác một lời thề vỡ",
    accent: "#f2a497",
    detail:
      "Mặt nạ nứt đúng chỗ vầng trăng bị chém. Hắn không nhớ người giao lời thề, nhưng nhớ từng kẻ đã bước qua cổng.",
    greeting:
      "Ta không hỏi ngươi đến từ đâu. Ta chỉ hỏi: nếu người trong kia gọi đúng tên mẹ ngươi, ngươi có quay đầu được không?",
    topics: [
      {
        label: "Ai đã chém vầng trăng?",
        reply:
          "Một người không chịu phi thăng. Hắn nói trên trời không còn chỗ cho người phàm. Sau nhát kiếm ấy, tất cả bia công đức ở đây đều quay mặt vào trong.",
      },
      {
        label: "Có thứ gì sau cánh cổng?",
        reply:
          "Mỗi người nhìn thấy một thứ. Ta từng thấy bữa cơm cuối cùng của nhà mình. Ta đã đứng đây ba trăm năm, chờ bát canh nguội.",
      },
    ],
  },
];

export const WORLD_SCENES: {
  id: SceneId;
  number: string;
  name: string;
  subtitle: string;
  mood: string;
  accent: string;
  colors: string[];
  npcs: string[];
  rumor: string;
  poem: string;
}[] = [
  {
    id: "jade",
    number: "01",
    name: "Vân Hải Ngọc Lưu",
    subtitle: "Nơi núi học cách trôi",
    mood: "SƯƠNG SỚM · MÂY NGỌC",
    accent: "#8ee4d0",
    colors: ["#8ee4d0", "#ffc3b6", "#c8eafb"],
    npcs: ["liensuong", "tamnien"],
    rumor:
      "Đêm qua, đảo thứ mười xuất hiện. Chuông trên đảo đang rung trước khi có người gõ.",
    poem: "Một giọt mưa rơi, cả trời nhớ biển.",
  },
  {
    id: "market",
    number: "02",
    name: "Chợ Đèn Vong Xuyên",
    subtitle: "Một điều đã mất, một giá chưa trả",
    mood: "ĐÊM HỘI · ĐÈN HỔ PHÁCH",
    accent: "#f5bd82",
    colors: ["#b895ed", "#ffc375", "#ef91aa"],
    npcs: ["hongly", "tamnien"],
    rumor:
      "Có người vừa trả một trăm năm thọ nguyên để mua lại đúng một câu nói chưa kịp thốt ra.",
    poem: "Đèn soi mặt nước. Ai soi lòng người?",
  },
  {
    id: "ruins",
    number: "03",
    name: "Tàn Tích Xích Nguyệt",
    subtitle: "Vết kiếm còn chưa khép miệng",
    mood: "NGUYỆT THỰC · TRO ĐỎ",
    accent: "#f2a497",
    colors: ["#ef6e68", "#a9bfdb", "#7985bf"],
    npcs: ["vokhuyet", "liensuong"],
    rumor:
      "Tất cả những pho tượng đều nhắm mắt. Chỉ có bóng của chúng đang nhìn về phía ngươi.",
    poem: "Trăng vỡ một lần. Người nhớ vạn kiếp.",
  },
];
