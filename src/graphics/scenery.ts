/** Hand-drawn scenery. Coordinates are art geometry, not gameplay state. */
export type SceneId = "jade" | "market" | "ruins";

function pavilion(p: string) {
  return `<g id="${p}-pavilion">
    <path d="M-80 51H80L92 61H-92Z" fill="#41596b"/><path d="M-68 8H68V51H-68Z" fill="#aacbb7"/>
    <path d="M-58 10V51M-29 10V51M29 10V51M58 10V51" stroke="#d9c498" stroke-width="5"/>
    <path d="M-20 16H20V51H-20Z" fill="#254659"/><path d="M-16 22H16M0 17V48" stroke="#a9b6a5" stroke-width="2"/>
    <path d="M-95 12Q-57 4-40-20H40Q57 4 95 12L75 18H-75Z" fill="#24495b"/>
    <path d="M-95 12Q-57 4-40-20H40Q57 4 95 12M-68 15H68" fill="none" stroke="#f0c790" stroke-width="3"/>
    <path d="M-34-20V-38H34V-20Z" fill="#b7c5a8"/><path d="M-46-35Q-15-40 0-58 15-40 46-35L32-29H-32Z" fill="#305c66"/>
    <path d="M-46-35Q-15-40 0-58 15-40 46-35" fill="none" stroke="#e9bd85" stroke-width="2"/>
    <path d="M-16-32V-23M0-33V-23M16-32V-23" stroke="#445f65" stroke-width="4"/>
    <path d="M-82 44H82M-78 38V50M-60 38V50M-42 38V50M42 38V50M60 38V50M78 38V50" stroke="#c5c8aa" stroke-width="2"/>
  </g>`;
}

function cloud(p: string, x: number, y: number, scale: number, opacity = 1) {
  return `<g transform="translate(${x} ${y}) scale(${scale})" opacity="${opacity}"><g class="nv-cloud-drift"><path d="M-180 0Q-154-25-112-18-98-48-53-31-16-69 34-32 84-48 110-18 151-24 185 0 98 15 0 8-102 22-180 0Z" fill="url(#${p}-mist)"/><path d="M-114-4Q-42 5 20-5T132-1" fill="none" stroke="#f5e6ce" stroke-opacity=".26" stroke-width="2"/></g></g>`;
}

function jade(p: string): string {
  const petals = [
    [146, 82, -15],
    [1064, 182, 24],
    [315, 243, 45],
    [786, 358, -22],
    [195, 473, 12],
    [985, 531, 70],
    [657, 209, 41],
  ];
  return `<defs>
    <linearGradient id="${p}-sky" x2="0" y2="1"><stop stop-color="#144d76"/><stop offset=".45" stop-color="#77c8cc"/><stop offset=".8" stop-color="#f4c7ab"/><stop offset="1" stop-color="#fae3bd"/></linearGradient>
    <radialGradient id="${p}-sun"><stop stop-color="#fff7cd" stop-opacity=".8"/><stop offset=".45" stop-color="#ffd2b0" stop-opacity=".35"/><stop offset="1" stop-color="#f8b8c4" stop-opacity="0"/></radialGradient>
    <linearGradient id="${p}-far" x2="0" y2="1"><stop stop-color="#558b9c"/><stop offset="1" stop-color="#9bcfc7" stop-opacity=".08"/></linearGradient>
    <linearGradient id="${p}-rock" x2=".75" y2="1"><stop stop-color="#38797b"/><stop offset=".55" stop-color="#224f66"/><stop offset="1" stop-color="#24415c" stop-opacity=".15"/></linearGradient>
    <linearGradient id="${p}-water" x2="1" y2="0"><stop stop-color="#52cbd4" stop-opacity=".15"/><stop offset=".45" stop-color="#edfff0" stop-opacity=".88"/><stop offset=".8" stop-color="#70d7d9" stop-opacity=".4"/><stop offset="1" stop-color="#60c9cb" stop-opacity="0"/></linearGradient>
    <linearGradient id="${p}-mist" x2="0" y2="1"><stop stop-color="#fff3d7" stop-opacity=".78"/><stop offset="1" stop-color="#c8e4dc" stop-opacity=".08"/></linearGradient>
    <linearGradient id="${p}-ground" x2="0" y2="1"><stop stop-color="#477d77"/><stop offset="1" stop-color="#123c4c"/></linearGradient>
    <linearGradient id="${p}-whale" x2="1" y2="1"><stop stop-color="#dbfff7" stop-opacity=".9"/><stop offset=".55" stop-color="#7be2dc" stop-opacity=".6"/><stop offset="1" stop-color="#73adc8" stop-opacity=".18"/></linearGradient>
    ${pavilion(p)}
  </defs>
  <rect width="1200" height="720" fill="url(#${p}-sky)"/>
  <circle cx="820" cy="184" r="260" fill="url(#${p}-sun)"/><circle cx="820" cy="184" r="61" fill="#ffedc6" opacity=".78"/>
  <path d="M0 352Q23 310 45 310L91 192Q99 170 108 203L128 267 155 239Q168 226 173 251L197 352 246 336 281 208Q295 180 308 217L340 313 365 285 403 360 445 317 482 144Q490 111 504 139L530 267 552 219 586 365 638 331 683 245 705 282 730 204 760 330 803 300 850 367 919 251 943 272 974 194 1002 291 1050 331 1103 224Q1120 208 1125 234L1150 335 1200 291V620H0Z" fill="url(#${p}-far)"/>
  <path d="M43 436Q88 402 120 402L147 323 163 339 186 245Q194 218 202 244L226 365 252 326 281 433 310 455M704 435 741 387 768 276 785 305 813 183Q824 153 837 188L870 353 894 321 932 443" fill="#4d969b" opacity=".48"/>
  <path d="m189 253 11 68-12 31m625-157 15 93-13 55m-323-193 10 89-14 68" fill="none" stroke="#b3dfcc" stroke-opacity=".36" stroke-width="3"/>
  ${cloud(p, 250, 345, 1.8, 0.65)}${cloud(p, 865, 339, 2.1, 0.6)}
  <g transform="translate(398 182) rotate(-7)"><g class="nv-cloud-drift">
    <path d="M-117 0Q-82-37-30-29 15-28 51-8L96-22 121-46 112-11 136 10 98 5 65 12Q23 43-30 32-75 25-117 0Z" fill="url(#${p}-whale)" stroke="#dcfff0" stroke-opacity=".4"/>
    <path d="M-89 9Q-39 36 18 14M-45 21Q-18 59 4 43L-4 25M37-13 24-32 2-26" fill="none" stroke="#defce9" stroke-opacity=".65" stroke-width="2"/>
    <circle cx="-84" cy="-2" r="2.7" fill="#f5ffdc"/><path d="M-107 0Q-95 9-77 7" fill="none" stroke="#e2ffec" stroke-width="1.2"/>
    <path d="M116-29q35-18 62-12m-44 43q38 8 66 0" fill="none" stroke="#dcfff1" opacity=".25" stroke-dasharray="3 10"/>
  </g></g>
  <g transform="translate(899 343)">
    <path d="M-158 0Q-77-37 7-24T137 0L111 38 78 51 57 119 29 93 8 174-22 120-57 126-76 66-119 46Z" fill="url(#${p}-rock)"/>
    <path d="m-126 8 29 13 17 50m57-73 11 55-14 52M59 3 43 68 50 93M105 10 83 42" fill="none" stroke="#9ac9ab" stroke-opacity=".35" stroke-width="3"/>
    <path d="M-158 0Q-76-35 5-23T137 0L110 13Q17 3-34 17T-158 0Z" fill="#75ae94"/>
    <path d="M-140-2Q-47-17 112-1" fill="none" stroke="#c5d6ac" stroke-width="3"/>
    <use href="#${p}-pavilion" transform="translate(7 -66) scale(.84)"/>
    <path d="M-68-9h21v90q6 58-7 111h-22q19-79 8-114Z" fill="url(#${p}-water)"/>
    <g class="nv-water-flow" fill="none" stroke="#d2ffff" stroke-opacity=".55"><path d="M-60 8v102m-7-75v109m15-69v90"/><path d="M-72 161v22m17-3-3 19"/></g>
    <path d="M-98-15q-11-21-8-41m1 22-19-12m19 1 16-14" stroke="#385e63" stroke-width="5" fill="none"/>
    <path d="M-140-49q18-19 45-11l28 12q-33 12-73-1" fill="#467d77"/>
  </g>
  <g transform="translate(238 419)">
    <path d="M-150 0Q-64-30 10-24T139 1L119 40 79 51 58 119 18 158-8 107-41 120-64 59-112 45Z" fill="url(#${p}-rock)"/>
    <path d="m-113 12 29 24 25 69m40-97 6 65 16 57M62 12 46 71 35 103M111 11 86 43" stroke="#acd7b8" stroke-opacity=".27" stroke-width="3" fill="none"/>
    <path d="M-150 0Q-71-32 13-23T139 1L87 16Q2 5-69 15Z" fill="#75b397"/>
    <path d="M-92-8q4-58 30-89m-16 42 51-21m-41-1-41-25" stroke="#456964" stroke-width="9" fill="none"/>
    <path d="M-148-97q37-23 75-7 37-27 71 5-56 18-146 2M-102-64q31-24 64-9l30 10q-49 18-94-1" fill="#4a8e84"/>
    <path d="M48-4h22q-10 47-8 85l-7 78H30q19-57 18-99Z" fill="url(#${p}-water)"/>
    <g class="nv-water-flow" stroke="#dffff7" stroke-opacity=".68" fill="none"><path d="M57 8 52 56v53m8-60-6 78m-9-11-5 34"/><path d="M48 136v32"/></g>
  </g>
  <path d="M440 399q41-16 82-1m-54 12q27-6 53-1M623 263q9-11 18 0 9-11 18 0m34-34q7-8 14 0 7-8 14 0" fill="none" stroke="#326978" stroke-width="2" opacity=".75"/>
  ${cloud(p, 530, 499, 2.4, 0.9)}${cloud(p, 1030, 517, 1.8, 0.75)}${cloud(p, 53, 553, 1.7, 0.7)}
  <path d="M0 595Q99 564 214 590T438 592Q546 558 661 581T911 579Q1080 560 1200 587V720H0Z" fill="url(#${p}-ground)"/>
  <path d="M0 595Q99 564 214 590T438 592Q546 558 661 581T911 579Q1080 560 1200 587" fill="none" stroke="#c6c5a1" stroke-width="5"/>
  <path d="M76 648Q208 608 339 636T599 633 827 626 1123 645" fill="none" stroke="#779d8b" stroke-width="19" opacity=".28"/>
  <path d="m39 606 34 46-41 26m198-78 17 27-23 38m804-67-31 25 23 30m114-46-9 45 35 28" fill="none" stroke="#183d49" stroke-opacity=".55" stroke-width="3"/>
  <path d="M-24 702Q47 610 52 495 54 407 1 365M48 545q84-52 109-102M32 448q59-26 108-20" fill="none" stroke="#3f4654" stroke-width="19" stroke-linecap="round"/>
  <path d="M-17 693Q54 582 48 481M52 527q57-39 88-73" fill="none" stroke="#8e6970" stroke-width="5"/>
  ${[
    [12, 375, 37],
    [27, 418, 32],
    [68, 423, 30],
    [117, 421, 24],
    [148, 442, 28],
    [112, 473, 33],
    [76, 506, 25],
    [-3, 469, 31],
    [39, 363, 22],
  ]
    .map(
      ([x, y, r]) =>
        `<g fill="#eea0aa"><circle cx="${x}" cy="${y}" r="${r}" opacity=".9"/><circle cx="${x + 12}" cy="${y - 9}" r="${r * 0.65}" fill="#f6bcc0"/><circle cx="${x - 11}" cy="${y + 5}" r="${r * 0.45}" fill="#d77f98"/></g>`,
    )
    .join("")}
  <path d="M1199 18q-67 18-93 69m30-39-48-12m41 27-3 49" fill="none" stroke="#3e5260" stroke-width="9"/>
  ${[
    [1191, 22, 27],
    [1143, 38, 22],
    [1105, 65, 27],
    [1086, 30, 23],
    [1125, 100, 22],
  ]
    .map(
      ([x, y, r]) =>
        `<circle cx="${x}" cy="${y}" r="${r}" fill="#efa8b8" opacity=".88"/>`,
    )
    .join("")}
  ${petals.map(([x, y, r]) => `<g transform="translate(${x} ${y}) rotate(${r})"><path class="nv-petal-drift" d="M-6 0Q-2-7 5-3 8 2 0 7Z" fill="#ffd0cf" opacity=".8"/></g>`).join("")}
  <path d="M0 720v-45q60-53 93-24 29-20 53 15 43-12 83 54m971 0v-74q-31-31-63-7-39-27-61 14-46-11-78 67" fill="#153c4b"/>
  <g fill="#f6c7b3"><circle cx="165" cy="645" r="3"/><circle cx="1016" cy="626" r="2"/><circle cx="718" cy="588" r="2.5"/></g>`;
}

function lantern(
  p: string,
  x: number,
  y: number,
  scale: number,
  coral = false,
) {
  return `<g transform="translate(${x} ${y}) scale(${scale})"><g class="nv-lantern-sway">
    <path d="M0-35V-17" stroke="#bf968a" stroke-width="1.5"/><ellipse cy="2" rx="39" ry="47" fill="url(#${p}-glow)"/>
    <path d="M-12-17Q-24 1-12 19H12Q24 1 12-17Z" fill="${coral ? "#d66269" : "#efad5e"}"/>
    <path d="M-8-16Q-16 0-8 19M0-16V19M8-16Q16 0 8 19" stroke="${coral ? "#ffb98b" : "#ffedaf"}" stroke-width="1.5" opacity=".75"/>
    <path d="M-13-17H13M-13 19H13" stroke="#6d4362" stroke-width="4"/><path d="M0 21V38m-3-9v11m6-11v11" stroke="#dc8768" stroke-width="2"/>
    <path d="m0-6 4 7-4 7-4-7Z" fill="#fff4bc" opacity=".85"/>
  </g></g>`;
}

function market(p: string): string {
  const stars = [
    [51, 63],
    [122, 104],
    [241, 51],
    [325, 120],
    [442, 35],
    [580, 88],
    [714, 46],
    [786, 116],
    [916, 54],
    [1025, 114],
    [1118, 66],
    [1071, 194],
    [336, 200],
    [163, 180],
  ];
  const lanterns = [
    [24, 174, 1.4],
    [134, 205, 1.05],
    [248, 226, 0.8],
    [353, 218, 0.65],
    [1001, 177, 1.2],
    [1095, 138, 1.45],
    [1191, 78, 1.7],
    [791, 235, 0.7],
    [886, 215, 0.9],
    [493, 239, 0.55],
  ];
  return `<defs>
    <linearGradient id="${p}-sky" x2="0" y2="1"><stop stop-color="#151d4c"/><stop offset=".48" stop-color="#6b5285"/><stop offset="1" stop-color="#be8692"/></linearGradient>
    <radialGradient id="${p}-moon"><stop stop-color="#e2dafa" stop-opacity=".4"/><stop offset="1" stop-color="#b7a6e8" stop-opacity="0"/></radialGradient>
    <radialGradient id="${p}-glow"><stop stop-color="#ffe7a8" stop-opacity=".5"/><stop offset="1" stop-color="#ffb76b" stop-opacity="0"/></radialGradient>
    <linearGradient id="${p}-river" x2="0" y2="1"><stop stop-color="#967595"/><stop offset=".55" stop-color="#363765"/><stop offset="1" stop-color="#1e3e60"/></linearGradient>
    <linearGradient id="${p}-reflection" x2="0" y2="1"><stop stop-color="#f6c58c" stop-opacity=".66"/><stop offset="1" stop-color="#e7969b" stop-opacity="0"/></linearGradient>
    <linearGradient id="${p}-ground" x2="0" y2="1"><stop stop-color="#6c647b"/><stop offset="1" stop-color="#262b45"/></linearGradient>
    <linearGradient id="${p}-mist" x2="0" y2="1"><stop stop-color="#d5b4ca" stop-opacity=".32"/><stop offset="1" stop-color="#b18aa6" stop-opacity="0"/></linearGradient>
    ${pavilion(p)}
  </defs>
  <rect width="1200" height="720" fill="url(#${p}-sky)"/>
  <circle cx="664" cy="135" r="154" fill="url(#${p}-moon)"/><circle cx="664" cy="135" r="47" fill="#e0d4ee" opacity=".88"/><circle cx="683" cy="120" r="37" fill="#444572"/>
  ${stars.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 3 === 0 ? 1.8 : 1}" fill="#ead4e8" opacity="${i % 2 === 0 ? 0.7 : 0.4}"/>`).join("")}
  <path d="M0 338 70 245 122 306 198 208 265 295 327 234 400 326 468 257 529 312 597 211 645 286 711 254 775 334 853 222 920 299 1004 211 1051 288 1125 227 1200 313V482H0Z" fill="#484b73" opacity=".52"/>
  ${cloud(p, 633, 312, 1.7, 0.7)}
  <g fill="#373d63"><path d="M444 360V283H487V360M440 283l25-19 26 19Zm49 77V259H522V360m-38-101 20-19 23 19Zm244 115V281H774V374m-46-93 23-19 27 19Z"/><path d="M395 388V333H440V388M388 333l30-17 31 17M776 388V317H830V388m-62-71 35-20 35 20Z"/></g>
  <path d="M416 389Q602 344 783 394L1110 720H93Z" fill="url(#${p}-river)"/>
  <path d="M430 425Q596 401 767 425M378 475Q603 450 826 474M299 549Q592 515 924 550" fill="none" stroke="#c5a8bb" stroke-opacity=".18" stroke-width="3"/>
  <g class="nv-water-flow" fill="url(#${p}-reflection)">
    <path d="m485 412 17-1 9 19-31 1 5 12 39 1 5 8-55 4 14 13h35l11 10-63 4 14 18 53 7-77 10 26 28-11 9-40-43 21-8-16-26 12-7-7-31Z"/>
    <path d="m709 412 15 1-4 15 15 8-27 4-13 16 35 3-2 10-48 7 18 15 27-2-5 11-49 8 5 18 52 5-15 12-64 2 16-21-4-20 16-15-4-26 17-13-4-13Z" opacity=".75"/>
  </g>
  <g transform="translate(183 358)">
    <path d="M-183-81H113V176H-183Z" fill="#2d3655"/><path d="M-155-71H95V146H-155Z" fill="#5d4c69"/>
    <path d="M-183-75Q-106-95-66-150H45Q67-104 134-75L104-63H-183Z" fill="#282e4d"/>
    <path d="M-183-75Q-106-95-66-150H45Q67-104 134-75M-145-65H104" stroke="#bb918e" stroke-width="4" fill="none"/>
    <path d="M-54-145Q-34-116 83-77M-72-144q-30 39-83 62M-12-145q18 32 64 54" stroke="#53526b" stroke-width="2" fill="none"/>
    <path d="M-130-60V147M-46-60V147M36-60V147M100-60V147" stroke="#a07576" stroke-width="7"/>
    <path d="M-116-48H-60V13H-116M-31-48H24V13H-31M48-48H88V13H48" fill="#eab37e"/>
    <path d="M-104-48V13m31-61V13m54-61V13m30-61V13m48-61V13M-116-17H88" stroke="#654f63" stroke-width="4"/>
    <path d="M-168 28H124L144 54H-183Z" fill="#7c5578"/><path d="M-183 53H144" stroke="#d0a18d" stroke-width="4"/>
    <path d="M-110 65h48v65h-48Zm93 0h48v65h-48Zm89 0h27v65H72Z" fill="#c88a6d"/>
    <path d="M-86 65V130M7 65V130M-110 92h48m45 0h48" stroke="#694559" stroke-width="5"/>
    <path d="M-172 138H118V153H-172M-160 128v24m22-24v24m22-24v24m168-24v24m22-24v24m22-24v24" stroke="#ab8984" stroke-width="3" fill="none"/>
  </g>
  <g transform="translate(1043 326)">
    <path d="M-139-24H157V231H-139Z" fill="#3b385b"/><path d="M-125-16H157V206H-125Z" fill="#69516d"/>
    <path d="M-163-25q69-26 101-75H77q30 42 80 64v23H-144Z" fill="#282b49"/><path d="M-163-25q69-26 101-75H77q30 42 80 64M-145-12H157" fill="none" stroke="#bf8e86" stroke-width="4"/>
    <path d="M-112-7V208M-39-7V208M34-7V208M110-7V208" stroke="#bd847d" stroke-width="6"/>
    <path d="M-95 5h38v58h-38Zm72 0h40v58h-40Zm75 0h40v58H52Z" fill="#f2c286"/>
    <path d="M-76 5V63M-3 5V63M72 5V63M-95 35H92" stroke="#73506a" stroke-width="4"/>
    <path d="M-159 79H157V108H-175Z" fill="#7e5b7f"/><path d="M-170 108H157" stroke="#e2a185" stroke-width="4"/>
    <path d="M-89 126h45v72h-45Zm84 0h47v72H-5Zm78 0h40v72H73Z" fill="#b77b70"/>
    <path d="M-145 210H157M-138 193v23m22-23v23m184-23v23m22-23v23m22-23v23m22-23v23" stroke="#9f7d82" stroke-width="3"/>
  </g>
  <use href="#${p}-pavilion" transform="translate(377 348) scale(.69)" opacity=".85"/>
  <use href="#${p}-pavilion" transform="translate(812 349) scale(.63)" opacity=".85"/>
  <path d="M353 426Q600 288 848 426V452Q601 334 353 452Z" fill="#8c7d90"/><path d="M357 425Q598 291 844 425" fill="none" stroke="#dac0ad" stroke-width="6"/>
  <path d="M362 415V394M401 395V373M441 378V356M483 365V343M527 357V335M571 353V331M616 353V331M661 356V334M706 366V344M750 379V357M791 396V374M832 415V393" stroke="#a99bab" stroke-width="4"/>
  <path d="M359 396Q601 264 836 396" stroke="#b8a4ae" stroke-width="4" fill="none"/>
  <path d="M0 129Q242 248 508 210M744 207Q966 198 1200 18" stroke="#bda3ab" stroke-opacity=".7" stroke-width="2" fill="none"/>
  ${lanterns.map(([x, y, s], i) => lantern(p, x, y, s, i % 3 === 0)).join("")}
  ${lantern(p, 326, 405, 0.62)}${lantern(p, 859, 413, 0.7, true)}${lantern(p, 450, 348, 0.39)}${lantern(p, 740, 351, 0.39)}
  <g transform="translate(565 472)"><ellipse cy="13" rx="52" ry="20" fill="url(#${p}-glow)"/><path d="m-29 0 28-14 29 16-18 10h-26Z" fill="#f2c7ac"/><path d="M-29 0 1 1-1-15M1 1l27 1" stroke="#bb8c99" fill="none"/><path d="M-10 2 1-7 12 2" fill="#ffe4ad"/><circle cy="-2" r="3" fill="#fff3ca"/></g>
  <g transform="translate(723 512) scale(.7)"><ellipse cy="13" rx="52" ry="20" fill="url(#${p}-glow)"/><path d="m-29 0 28-14 29 16-18 10h-26Z" fill="#e7a9b7"/><path d="M-29 0 1 1-1-15" stroke="#ab7592" fill="none"/><circle cy="-2" r="3" fill="#fff3ca"/></g>
  <path d="M0 578 327 561Q463 586 588 591 723 589 866 560L1200 579V720H0Z" fill="url(#${p}-ground)"/>
  <path d="M0 579 327 562Q580 621 867 561L1200 580" stroke="#c3a1a5" stroke-width="5" fill="none"/>
  <path d="m0 619 317-21 265 27 288-27 330 23M0 674l313-18 274 33 290-32 323 18M138 580 115 720M325 565l-15 155m278-124v124m278-154 17 154m169-142 32 142" fill="none" stroke="#b398a5" stroke-opacity=".18" stroke-width="2"/>
  <g transform="translate(67 582)"><path d="M-7 0V-142H6V0Z" fill="#392e4c"/><path d="M-30-121h63v51h-63Z" fill="#bd7668"/><path d="m-38-121 38-24 40 24Z" fill="#302d47"/><path d="M-17-112H19V-78H-17Z" fill="#f7cc83"/><path d="M0-112v34m-17-17h36" stroke="#87576a" stroke-width="3"/><ellipse cy="-95" rx="60" ry="70" fill="url(#${p}-glow)"/></g>
  <g transform="translate(1128 582)"><path d="M-7 0V-142H6V0Z" fill="#392e4c"/><path d="M-30-121h63v51h-63Z" fill="#bd7668"/><path d="m-38-121 38-24 40 24Z" fill="#302d47"/><path d="M-17-112H19V-78H-17Z" fill="#f7cc83"/><path d="M0-112v34m-17-17h36" stroke="#87576a" stroke-width="3"/><ellipse cy="-95" rx="60" ry="70" fill="url(#${p}-glow)"/></g>
  <path d="M0 720v-43q35-20 70 3l25-20 40 60m1065 0v-50q-32-10-49 7l-34-8-24 51" fill="#23263e"/>
  <g fill="#ecc58d" opacity=".65"><circle cx="410" cy="537" r="2"/><circle cx="787" cy="549" r="2"/><circle cx="944" cy="477" r="2.5"/></g>`;
}

function ruins(p: string): string {
  const embers = [
    [189, 469, 1.8],
    [313, 499, 2.4],
    [440, 423, 1.4],
    [596, 540, 2],
    [762, 426, 1.6],
    [851, 487, 2.5],
    [1046, 427, 1.9],
    [686, 353, 1.7],
    [374, 332, 1.5],
    [1149, 546, 2.4],
    [137, 581, 1.4],
  ];
  return `<defs>
    <linearGradient id="${p}-sky" x2="0" y2="1"><stop stop-color="#111d3c"/><stop offset=".55" stop-color="#4d324e"/><stop offset="1" stop-color="#a05e68"/></linearGradient>
    <radialGradient id="${p}-moon-glow"><stop stop-color="#f5745d" stop-opacity=".4"/><stop offset="1" stop-color="#bd4560" stop-opacity="0"/></radialGradient>
    <radialGradient id="${p}-moon"><stop stop-color="#df765e"/><stop offset=".7" stop-color="#c95156"/><stop offset="1" stop-color="#8d3c55"/></radialGradient>
    <linearGradient id="${p}-far" x2="0" y2="1"><stop stop-color="#3c3c5a"/><stop offset="1" stop-color="#627180" stop-opacity=".1"/></linearGradient>
    <linearGradient id="${p}-stone" x2="1" y2="1"><stop stop-color="#6b7587"/><stop offset=".42" stop-color="#394861"/><stop offset="1" stop-color="#1a2c47"/></linearGradient>
    <linearGradient id="${p}-ground" x2="0" y2="1"><stop stop-color="#536071"/><stop offset="1" stop-color="#1a293e"/></linearGradient>
    <linearGradient id="${p}-mist" x2="0" y2="1"><stop stop-color="#b7a2af" stop-opacity=".4"/><stop offset="1" stop-color="#927586" stop-opacity="0"/></linearGradient>
    <linearGradient id="${p}-crack" x2="0" y2="1"><stop stop-color="#ffb18c"/><stop offset="1" stop-color="#a34766" stop-opacity=".1"/></linearGradient>
  </defs>
  <rect width="1200" height="720" fill="url(#${p}-sky)"/>
  <circle cx="760" cy="198" r="262" fill="url(#${p}-moon-glow)"/><circle cx="760" cy="198" r="126" fill="url(#${p}-moon)"/>
  <path d="M659 152q38-65 103-67 82 2 109 82" stroke="#ffb18a" stroke-opacity=".4" stroke-width="2" fill="none"/>
  <path d="m798 77-54 89 28 13-77 145 49-131-25-16Z" fill="#172640"/><path d="m794 86-54 82 24 12-59 127" stroke="#ffd4ae" stroke-opacity=".8" stroke-width="2" fill="none"/>
  <path d="m766 133 37-8 16-25m-67 90 33 18 7 32m-60 26-31-7-11 14" stroke="#482c45" stroke-width="3" fill="none"/>
  <circle cx="702" cy="148" r="15" fill="#873d53" opacity=".5"/><circle cx="805" cy="234" r="24" fill="#853c51" opacity=".35"/>
  <path d="M0 346 53 321 98 180 112 253 144 227 180 374 222 287 260 330 299 162 319 230 347 176 376 346 433 300 466 376 524 251 559 293 604 205 647 366 697 331 726 385 795 336 850 241 870 300 911 196 950 326 992 294 1047 372 1092 220 1120 278 1151 184 1200 333V610H0Z" fill="url(#${p}-far)"/>
  <path d="M0 485 83 437 128 354 161 386 203 301 237 427 269 398 308 480 351 431 394 488 452 424 483 454 521 374 559 422 602 471 654 398 691 463 741 414 795 477 844 384 883 426 921 319 953 382 1005 357 1040 464 1106 403 1140 439 1200 387V600H0Z" fill="#34455c" opacity=".82"/>
  <g transform="translate(551 398)">
    <path d="M-127 83V-19H-79V53H-48V-53H11V83Z" fill="#394559"/><path d="M17 83V-22H69V37H103V-4H139V83Z" fill="#394559"/>
    <path d="M-165-16q51-4 71-42l26 8 24-16 38 17 28-8 45 40q-31 2-60-10l-41 10-26-11-45 12Z" fill="#657084"/>
    <path d="m-62-50 11-39 30-13 21 44-21-12-15 13Z" fill="#404c63"/>
    <path d="M-110-13V44M-90 2V48M-31-41V44M-9-40V44M35-12V49M58 7V52" stroke="#78818e" stroke-opacity=".5" stroke-width="4"/>
    <path d="M-165 83H149L178 99H-181Z" fill="#566174"/><path d="M-140 101H128L165 118H-173Z" fill="#47556a"/>
  </g>
  <g transform="translate(194 411) rotate(-7)">
    <path d="M-55 162-39-157-13-185 12-165 23 162Z" fill="url(#${p}-stone)"/><path d="M-39-157-13-185-16 157-55 162Z" fill="#6d798a" opacity=".48"/>
    <path d="m-20-143 8 47-17 18 13 43-6 21 12 37-16 55" stroke="#a1adba" stroke-width="2" fill="none" opacity=".6"/>
    <path d="M-29-114h26m-30 20h22m-22 48h28m-24 15h17M-36 24h27m-28 19h22" stroke="#a7a4b2" stroke-opacity=".42" stroke-width="3"/>
  </g>
  <g transform="translate(952 411) rotate(9)">
    <path d="M-25 168-17-168 7-200 31-172 55 168Z" fill="url(#${p}-stone)"/><path d="M7-200 31-172 55 168 26 164Z" fill="#1e314d"/>
    <path d="m2-156 9 62-15 34 21 43-9 28 11 38-9 48" stroke="#a5adbd" stroke-opacity=".5" stroke-width="2" fill="none"/>
    <path d="M-10-127h27m-25 20h22m-22 50h30m-25 18h21M-8 29h31" stroke="#b3a2af" stroke-opacity=".4" stroke-width="3"/>
  </g>
  <path d="m139 248 40-32 191 12 39 30-49 12-177-18ZM867 210l72-21 174-14 52 17-48 17-173 15Z" fill="#4b566e"/>
  <path d="m147 246 37-19 174 11 39 18M881 210l63-13 168-12 39 9" stroke="#a0a0b1" stroke-width="3" fill="none"/>
  <g transform="translate(372 259) rotate(-27)"><path d="M-6-84H8L5-32 20-28 17-17 5-20 2 54-4 85-11 56-9-20-24-17-26-28-10-32Z" fill="#c1c5c4" opacity=".74"/><path d="M-4-78-3-35M-4-15-4 57" stroke="#f2d9b9" stroke-width="2"/><path d="M-7 27 5 31" stroke="#4b4b66" stroke-width="4"/></g>
  <g transform="translate(1033 332) rotate(28) scale(.7)"><path d="M-5-96H7V-35L29-28 26-15 6-19 4 46-2 71-8 43-6-19-28-14-31-28-6-35Z" fill="#98a8bb"/><path d="M0-86V-39M-1-12V46" stroke="#f8d4bc" opacity=".6" stroke-width="2"/></g>
  <g fill="#738197" stroke="#b5b7c3" stroke-opacity=".45"><path d="m425 190 22-8 10 23-27 11Z"/><path d="m1034 203 13-22 19 9-5 27Z"/><path d="m313 397 17-19 18 7-10 25Z"/><path d="m846 329 15-12 14 16-14 12Z"/></g>
  ${cloud(p, 604, 507, 2.4, 0.9)}${cloud(p, 66, 535, 1.4, 0.7)}${cloud(p, 1096, 535, 1.5, 0.65)}
  <path d="M0 602 74 583 143 593 190 570 272 588 328 571 392 592 455 575 504 595 559 578 611 598 685 576 749 588 810 571 877 596 943 577 1008 591 1096 568 1200 588V720H0Z" fill="url(#${p}-ground)"/>
  <path d="m0 603 74-20 69 10 47-23 82 18 56-17 64 21 63-17 49 20 55-17 52 20 74-22 64 12 61-17 67 25 66-19 65 14 88-23 104 20" stroke="#9b9fa9" stroke-opacity=".6" stroke-width="3" fill="none"/>
  <path d="m414 590 39 28-28 17 42 22-28 63M446 619l51-11 27 13m-86 17-38 13-40-6m109 14 43-17 39 21M1021 588l-34 34 21 19-55 37 5 42m29-98-42-12-26 13" stroke="#15283d" stroke-width="11" fill="none"/>
  <path d="m414 590 39 28-28 17 42 22-28 63M446 619l51-11 27 13m-86 17-38 13-40-6m109 14 43-17 39 21M1021 588l-34 34 21 19-55 37 5 42m29-98-42-12-26 13" stroke="url(#${p}-crack)" stroke-width="2.5" fill="none"/>
  <path d="m60 651 22-14 27 5 13 24-39 7Zm246 49 23-18 40 5 19 33h-92Zm821-75 25-29 29 8 19 30-18 15Z" fill="#3b4b62" stroke="#8b95a3" stroke-opacity=".35" stroke-width="2"/>
  <path d="M0 720v-69l47-23 30 20 37-13 40 35 24 50m1022 0v-65l-36-33-35 15-30-20-37 103" fill="#182a3f"/>
  <path d="M47 650 25 608 33 574m-6 41-20-17M1130 648l21-53-8-38m7 41 24-14" stroke="#22364c" stroke-width="6" fill="none"/>
  ${embers.map(([x, y, r], i) => `<g transform="translate(${x} ${y})"><g class="nv-ember-rise"><circle r="${r * 4}" fill="#f89173" opacity=".08"/><path d="m0-${r * 3} ${r} ${r * 3}-${r} ${r * 2}-${r}-${r * 2}Z" fill="${i % 2 === 0 ? "#ffbe8d" : "#e87970"}" opacity=".8"/></g></g>`).join("")}`;
}

/** Returns SVG inner markup for a 1200 × 720 viewBox. Namespaces every definition. */
export function landscapeLayers(scene: SceneId, prefix: string): string {
  const p = `${prefix.replace(/[^a-zA-Z0-9_-]/g, "-")}-${scene}`;
  return { jade, market, ruins }[scene](p);
}
