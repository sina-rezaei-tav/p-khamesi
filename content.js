// Update the TODO fields here. Empty fields are hidden unless a fallback is supplied.
window.portfolioContent = {
  artist: "Panah Khamesi",
  brand: "Dayereh Rangi",
  nameFa: "", // TODO: Persian spelling of the artist's name
  brandMeaning: "", // TODO: confirmed studio name meaning
  brandFa: "", // TODO: Persian wordmark
  instagram: "", // TODO: full Instagram profile URL
  email: "", // TODO: commission and purchase email address
  location: "", // TODO: artist location
  siteUrl: "", // TODO: deployed site URL, including any project folder and trailing slash
  portrait: { src: "", alt: "", width: 0, height: 0 }, // TODO: photo path, alt text and pixel dimensions
  tagline: "", // TODO: one-line studio tagline
  process: "", // TODO: short description of the making process
  bio: "", // TODO: short artist biography
  // Draft to review: ["Tell me what you have in mind", "Discuss the piece and its details", "Confirm the commission"].
  commissionSteps: [], // TODO: add the custom-order steps in order
  // TODO: confirm each piece's year, height in centimetres, size, materials and price.
  pieces: [
    { title: "The melting clock", size: "", materials: "", price: "", photos: [5, 3, 2, 4] },
    { title: "Starry Night", size: "", materials: "", price: "", photos: [30, 31] },
    { title: "Sunflowers", size: "", materials: "", price: "", photos: [1, 24, 22, 23] },
    { title: "The flower crown", size: "", materials: "", price: "", photos: [22, 23] },
    { title: "Tuxedo bust", size: "", materials: "", price: "", photos: [25], other: true }
  ],
  details: [
    { photo: 4, caption: "Melting clock and painted stripes", position: "50% 38%" },
    { photo: 24, caption: "A miniature Sunflowers canvas", position: "50% 48%" },
    { photo: 31, caption: "Starry Night and its For Sale tag", position: "50% 2%" }
  ],
  photos: {
    1: [1025, 1280, "Front close-up of a figure in a blue sweater and burgundy overalls holding a miniature Sunflowers canvas"],
    2: [853, 1280, "Back of the melting-clock figure showing its burgundy striped jacket, leopard-print shorts and dark round base"],
    3: [853, 1280, "Front view of a Dalí-inspired figurine holding a melting clock, in a burgundy striped jacket and leopard-print shorts"],
    4: [853, 1280, "Close-up of a Dalí-inspired figure with a melting clock tucked against its burgundy jacket and green waistcoat"],
    5: [853, 1280, "Three-quarter view of the melting-clock figure in a burgundy jacket, leopard-print shorts and blue boots on a dark base"],
    22: [1025, 1280, "Flower-crowned figure holding a Van Gogh self-portrait beside a figure in burgundy overalls holding Sunflowers"],
    23: [1024, 1280, "Flower-crowned and sunflowers figures holding tiny paintings beside a third figurine in a striped jacket"],
    24: [1024, 1280, "Angled detail of the miniature Sunflowers canvas held against a blue sweater and burgundy overalls"],
    25: [853, 1280, "Small mustached bust in a dark tuxedo, white shirt and black bow tie"],
    30: [1024, 1280, "Front view of a figure in a green sweater vest raising Starry Night and a For Sale tag above a grassy round base"],
    31: [1025, 1280, "Angled view of a green-vested figure raising a miniature Starry Night painting with a For Sale tag"]
  },
  strings: {
    en: {
      skip: "Skip to content", nav: "Main navigation", navWork: "Work", navAbout: "About",
      navContact: "Contact", by: "by {name}", medium: "Hand-sculpted · Hand-painted",
      heroCaption: "The melting clock", view: "View the work", commission: "Commission a piece",
      work: "Selected Work", workIntro: "Famous artists reimagined as everyday people, with tiny painted canvases and a few playful details.",
      contactPending: "Contact details coming soon.", other: "Other work", craft: "The details",
      detailRegion: "Craft photos", about: "About {name}", portraitPending: "Artist portrait",
      bioPending: "Artist bio coming soon.",
      contact: "Commission a piece", email: "Email Panah Khamesi", instagram: "Instagram",
      close: "Close gallery", previous: "Previous photo", next: "Next photo", photoCount: "{current} of {total}",
      open: "View photos of {title}", size: "Size", materials: "Materials", price: "Price",
      piecePending: "Size and materials to come", languageName: "English"
    },
    fa: null // TODO: add Persian strings using the English keys; the language toggle then appears.
  },
  // TODO: optional localized tagline, bio, process, location, commissionSteps, portrait alt,
  // piece captions (pieces by index), detail captions (details by index) and photo descriptions (photoAlt by photo number).
  translations: { fa: {} }
};

{
  const museum = window.portfolioContent;
  const rooms = [
    { id: "melting-clock", catalogue: "01", cover: 5, day: ["#e8cdd0", "#34201e", "#7a2e3a"], night: ["#332127", "#f7e7dd", "#e6aeb9"], swatch: "#a45264", annotation: "Time has gone rather soft.", angles: ["Three-quarter", "Front", "Back", "Detail"] },
    { id: "starry-night", catalogue: "02", cover: 30, day: ["#d0dce6", "#1b293a", "#344d69"], night: ["#222c3b", "#eaf0f7", "#f1ca7d"], swatch: "#6e8fb0", annotation: "One night sky, held aloft.", angles: ["Front", "Side"] },
    { id: "sunflowers", catalogue: "03", cover: 1, day: ["#ebd8ae", "#302620", "#5e4122"], night: ["#352e24", "#fff0d0", "#edc47a"], swatch: "#d9a441", annotation: "Sunflowers, for a very small wall.", angles: ["Front", "Detail", "Pair", "Group"] },
    { id: "flower-crown", catalogue: "04", cover: 22, day: ["#d5ded2", "#243224", "#435b44"], night: ["#27342d", "#e9f4e5", "#c3d7b6"], swatch: "#6f8f6a", annotation: "A portrait in another painter’s hands.", angles: ["Pair", "Group"] },
    { id: "tuxedo-bust", catalogue: "05", cover: 25, day: ["#d8d4d1", "#2a2423", "#58424b"], night: ["#312d31", "#f7edf2", "#dabdca"], swatch: "#71636e", annotation: "The bow tie is quite serious.", angles: ["Front"] }
  ];
  museum.pieces.forEach((piece, index) => Object.assign(piece, rooms[index], {
    year: "", // TODO: year made
    heightCm: "", // TODO: measured height in centimetres
  }));
  museum.archive = [
    [6, 1707, 2560, "Veiled bust, three-quarter view", "Hand-painted bust in a gray head covering, turned slightly to one side"],
    [7, 1707, 2560, "Veiled bust with hand and yellow object", "Hand holding a small yellow object above a bust in a gray head covering"],
    [8, 1707, 2560, "Veiled bust with hand and metal cup", "Hand holding a small metal cup above a bust in a gray head covering"],
    [9, 1707, 2560, "Veiled bust, close-up", "Front detail of the painted face beneath a gray head covering"],
    [10, 2050, 2560, "Hat and overalls, back", "Back of a wide-brimmed-hat figurine in blue overalls on a round base"],
    [11, 2048, 2560, "Hat and overalls, profile", "Side view of a wide-brimmed-hat figurine in blue overalls"],
    [12, 2048, 2560, "Hat and overalls, painted picture", "Close-up of the hat-and-overalls figurine holding a tiny picture"],
    [13, 2049, 2560, "Hat and overalls, three-quarter view", "Hat-and-overalls figurine with a small picture against its chest"],
    [14, 2049, 2560, "Hat and overalls, full figure", "Full-length front view of the hat-and-overalls figure on a dark base"],
    [15, 1707, 2560, "Entwined figures", "Two entwined figures with pale flowing drapery against a dark backdrop"],
    [16, 1707, 2560, "Entwined figures, detail", "Close-up of two entwined figures and the folds of pale drapery"],
    [17, 2048, 2560, "Entwined figures, full view", "The two draped figures standing on a rectangular base"],
    [18, 1145, 1374, "On the doorstep", "Seated figure and a small animal on brick-framed doorsteps"],
    [19, 1374, 2560, "Under yellow foliage", "Painted face with closed eyes beneath dense yellow foliage"],
    [20, 1441, 2560, "The dark suit", "Mustached standing figure in a dark suit on a round base"],
    [21, 1707, 2560, "The straw-coloured hat", "Small mustached bust in a straw-coloured hat and green jacket"],
    [27, 1025, 1280, "At the easel, angled view", "Miniature studio with a figure, easel, bust on a stool and framed painting"],
    [28, 1025, 1280, "At the easel, full scene", "Wide view of a miniature studio scene on a rectangular base"],
    [29, 1025, 1280, "A portrait in hand", "Seated figure in a green head covering holding a portrait of a mustached man in a dark hat"]
  ].map(([photo, width, height, caption, alt]) => {
    museum.photos[photo] = [width, height, alt];
    return { photo, caption };
  });
  museum.loupes = [
    { photo: 24, caption: "Sunflowers", point: [43, 58] },
    { photo: 31, caption: "Starry Night", point: [50, 11] },
    { photo: 22, caption: "Van Gogh self-portrait", point: [40, 40] }
  ];
  museum.pair = {
    photo: 22,
    hotspots: [
      { point: [40, 40], title: "Van Gogh self-portrait", caption: "Held by the Frida-inspired figure." },
      { point: [58, 36], title: "Sunflowers", caption: "Held by the Van Gogh-inspired figure." }
    ]
  };
  Object.assign(museum.strings.en, {
    museum: "The Tiny Museum of Tiny Masters",
    heroLine: "Famous artists, small enough for a desk.",
    heroBy: "by {name}", navWork: "Rooms", navContact: "Gift shop",
    enter: "Enter the museum", shopLink: "Visit the gift shop", opening: "Opening hours · Your local time",
    hang: "Hanging the exhibits", skipDoors: "Skip the doors", timeButton: "A very soft clock",
    roomMap: "Room map", roomIndex: "Museum directory", roomCount: "Room {current} / {total}",
    catalogue: "Cat. {number}", room: "Room {number}", exhibit: "Enter the exhibit",
    views: "All exhibit photographs", year: "Year", heightCm: "Height", ruler: "Height in cm",
    exhibitPrevious: "Previous exhibit", exhibitNext: "Next exhibit", close: "Leave exhibit",
    previous: "Previous photograph", next: "Next photograph", angleCount: "{angle} · {current} / {total}",
    closer: "Look Closer", closerIntro: "A closer look at what fits on a tiny canvas.",
    zoom: "Zoom", zoomPhoto: "Magnify {title}", zoomHelp: "Move over the image, tap, or use the arrow keys.",
    pair: "The Pair", pairIntro: "Two painters. Two paintings. One small wall label each.",
    archive: "The Archive", archiveIntro: "Drag the top photo away.", archivePrints: "Archive prints",
    shuffle: "Shuffle the prints", archiveCount: "{current} / {total}",
    archiveAnnouncement: "{current} of {total}. {caption}",
    gift: "The gift shop", giftIntro: "Have a masterpiece in mind? There’s room for a small one.",
    contactPending: "The gift shop is between opening hours. Please check back for contact details.",
    admit: "Admit one", ticketTitle: "Commission enquiry", nameLabel: "Name", emailLabel: "Email",
    pieceLabel: "Which masterpiece should we shrink?", messageLabel: "Message",
    submitTicket: "Tear off & email", ticketSubject: "Dayereh Rangi commission enquiry",
    ticketSent: "Your ticket is ready in your email app.",
    daylight: "Daylight", afterHours: "After hours", theme: "Gallery lighting",
    footer: "Please do not touch (but do ask to buy).", copyright: "© 2026 Panah Khamesi · Dayereh Rangi",
    viewCursor: "view", dragCursor: "drag", zoomCursor: "zoom", up: "Back to entrance",
    roomArrow: "↓", folio: "Museum catalogue", handMade: "Hand-sculpted & hand-painted"
  });
}
