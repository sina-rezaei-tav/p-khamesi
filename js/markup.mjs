export const escape = (value) => String(value ?? "").replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export function words(content, lang) {
  return (key, values = {}) => (content.strings[lang]?.[key] ?? content.strings.en[key] ?? "")
    .replace(/\{(\w+)\}/g, (_, name) => values[name] ?? "");
}

export function fingerprint(content) {
  let hash = 0;
  for (const c of JSON.stringify(content)) hash = (Math.imul(hash, 31) + c.codePointAt(0)) | 0;
  return hash.toString(36);
}

export function photo(content, id, { sizes = "(min-width: 900px) 480px, 85vw", eager = false, alt, lang = "en" } = {}) {
  const [width, height, fallback] = content.photos[id];
  const widths = [...new Set([480, 960, 1600].map((size) => Math.min(size, width)))];
  const path = (size, format) => `assets/img/photo-${id}-${size}.${format}`;
  const sources = (format) => widths.map((size) => `${path(size, format)} ${size}w`).join(", ");
  const description = alt ?? content.translations[lang]?.photoAlt?.[id] ?? fallback;
  return `<picture><source type="image/webp" srcset="${sources("webp")}" sizes="${sizes}">
    <img src="${path(widths[0], "jpg")}" srcset="${sources("jpg")}" sizes="${sizes}" width="${width}" height="${height}"
      alt="${escape(description)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"'} draggable="false"></picture>`;
}

export function localPieces(content, lang) {
  return content.pieces.map((piece, index) => ({ ...piece, ...content.translations[lang]?.pieces?.[index] }));
}

export function label(piece, t) {
  const fields = { year: piece.year, size: piece.size, heightCm: piece.heightCm > 0 ? `${piece.heightCm} cm` : "", materials: piece.materials, price: piece.price };
  const rows = Object.entries(fields).filter(([, value]) => String(value ?? "").trim())
    .map(([key, value]) => `<div><dt>${escape(t(key))}</dt><dd>${escape(value)}</dd></div>`).join("");
  return rows ? `<dl class="label-data">${rows}</dl>` : "";
}

const arrow = '<svg viewBox="0 0 72 30" aria-hidden="true"><path pathLength="1" d="M2 24Q30 32 67 5M51 7l17-4-8 16"/></svg>';
const clock = `<svg id="clock-art" viewBox="0 0 200 220" aria-hidden="true">
  <g id="clock-melt"><path class="clock-outline" d="M102 15c50-3 76 36 73 61-3 29-36 36-34 66 1 30-7 62-27 60-25-3-11-54-43-61C25 131 14 106 21 72 28 40 59 17 102 15Z"/>
  <path class="clock-inset" d="M101 23c45-3 70 31 65 56-5 26-32 33-33 62-1 24-5 49-18 50-18 1-10-49-39-58-41-13-55-30-47-60 8-28 36-47 72-50Z"/>
  <g class="clock-ticks"><path d="M96 33v10m45 6-5 8m18 26-10 1m-8 27-7-5m-29 27-1-10m-38-10 6-8m-28-19 10-2m8-29 7 7"/></g>
  <path id="clock-hour" class="hand" d="M96 83V55"/><path id="clock-minute" class="hand" d="M96 83V44"/><path id="clock-second" d="M96 88V41"/><circle cx="96" cy="83" r="4"/></g>
</svg>`;

export function museum(content, lang, extras = "") {
  const t = words(content, lang);
  const f = (key, values) => escape(t(key, values));
  const translated = content.translations[lang] || {};
  const name = (lang === "fa" && content.nameFa) || content.artist;
  const brand = (lang === "fa" && content.brandFa) || content.brand;
  const pieces = localPieces(content, lang);
  const nav = pieces.map((piece) => `<li><a href="#room-${escape(piece.id)}"><i style="--swatch:${escape(piece.swatch)}"></i><span class="nav-number">${escape(piece.catalogue)}</span><span>${escape(piece.title)}</span></a></li>`).join("");
  const colours = (piece) => [...piece.day, ...piece.night].map((value, index) =>
    `--${["day-room", "day-ink", "day-accent", "night-room", "night-ink", "night-accent"][index]}:${escape(value)}`).join(";");
  const rooms = pieces.map((piece) => {
    const id = escape(piece.id);
    return `<section class="room" id="room-${id}" style="${colours(piece)}" aria-labelledby="title-${id}">
      <div class="wrap room-layout">
        <div class="room-photo"><i class="painted-arch" aria-hidden="true"></i><div class="pedestal">
          <div class="room-frame">${photo(content, piece.cover, { lang })}</div>
        </div></div>
        <div class="wall">
          <p class="eyebrow room-kicker"><span>${f("room", { number: piece.catalogue })}</span><span>${f("catalogue", { number: piece.catalogue })}</span></p>
          <h2 id="title-${id}">${escape(piece.title)}</h2>
          <p class="annotation">${arrow}<span>${escape(piece.annotation)}</span></p>
          ${label(piece, t)}
          ${piece.heightCm > 0 ? `<div class="ruler" role="img" aria-label="${f("ruler")} · ${escape(piece.heightCm)} cm"><span>0</span><i></i><span>${escape(piece.heightCm)} cm</span></div>` : ""}
          <a class="button room-enter" data-exhibit="${id}" data-cursor="viewCursor" href="#exhibit-${id}">${f("exhibit")} <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <div class="wrap room-views" id="exhibit-${id}">
        <details open><summary>${f("views")}</summary>
          <div class="static-photos">${piece.photos.map((id, index) => `<figure>${photo(content, id, { sizes: "(min-width: 900px) 230px, 44vw", lang })}<figcaption>${escape(piece.angles[index])}</figcaption></figure>`).join("")}</div>
        </details>
      </div>
    </section>`;
  }).join("");
  const portrait = content.portrait;
  const about = translated.bio || content.bio || portrait.src || content.location || content.brandMeaning;
  return `<div class="museum" data-version="${fingerprint(content)}">
    <a class="skip" href="#main">${f("skip")}</a>
    <header class="masthead"><div class="wrap header-inner">
      <a class="brand" href="#entrance"><i aria-hidden="true"></i><span><strong>${escape(brand)}</strong><small>${f("by", { name })}</small></span></a>
      <nav class="top-nav" aria-label="${f("nav")}"><a href="#work">${f("navWork")}</a><a href="#contact">${f("navContact")}</a></nav>
      <button class="lighting" id="theme" type="button" hidden></button>
    </div></header>
    <main id="main" tabindex="-1">
      <section class="entrance wrap" id="entrance" aria-labelledby="entrance-title">
        <div class="entrance-copy">
          <p class="eyebrow mast"><i aria-hidden="true"></i>${f("museum")}</p>
          <h1 id="entrance-title">${escape(brand)}</h1>
          <p class="hero-by">${f("heroBy", { name })}</p>
          <p class="hero-line">${escape(translated.tagline || content.tagline || t("heroLine"))}</p>
          <a class="button primary" data-magnet href="#work">${f("enter")}<span aria-hidden="true">↓</span></a>
          <p class="hours" hidden><span>${f("opening")}</span><time id="opening-time"></time></p>
        </div>
        <div class="entrance-art">
          <i class="entrance-arch" aria-hidden="true"></i>
          <figure class="hero-portrait">${photo(content, 3, { sizes: "(min-width: 1100px) 390px, (min-width: 740px) 36vw, 67vw", eager: true, lang })}<figcaption><span>${f("catalogue", { number: pieces[0].catalogue })}</span>${escape(pieces[0].title)}</figcaption></figure>
          <button type="button" class="clock" aria-label="${f("timeButton")}" title="${f("timeButton")}" hidden>${clock}</button>
        </div>
      </section>
      <nav id="work" class="directory wrap" aria-label="${f("roomIndex")}"><p class="eyebrow">${f("roomIndex")}</p><ol>${nav}</ol></nav>
      <div class="collection">${rooms}</div>
      ${extras}
      ${about ? `<section class="about wrap" id="about"><div><h2>${f("about", { name })}</h2>
      ${[translated.bio || content.bio, translated.location || content.location, content.brandMeaning].filter(Boolean).map((item) => `<p>${escape(item)}</p>`).join("")}</div>
      ${portrait.src ? `<img src="${escape(portrait.src)}" alt="${escape(translated.portraitAlt || portrait.alt)}" width="${escape(portrait.width)}" height="${escape(portrait.height)}" loading="lazy">` : ""}</section>` : ""}
    </main>
    <footer class="footer"><div class="wrap footer-row"><div><p>${f("footer")}</p><small>${f("copyright")}</small></div>
      <div class="footer-actions"><a href="#entrance">${f("up")}</a><button class="lighting" id="footer-theme" type="button" hidden></button>
      ${content.strings.fa ? `<a id="language" lang="${lang === "en" ? "fa" : "en"}" href="?lang=${lang === "en" ? "fa" : "en"}">${escape(content.strings[lang === "en" ? "fa" : "en"].languageName)}</a>` : ""}</div>
    </div></footer>
    <dialog id="exhibit" aria-labelledby="exhibit-title">
      <div class="exhibit-inner"><header class="exhibit-head"><p class="eyebrow" id="exhibit-catalogue"></p><button type="button" id="leave" class="button" autofocus>${f("close")} <span aria-hidden="true">×</span></button></header>
      <div class="exhibit-layout"><div class="viewer"><div id="angle-photo" tabindex="0" role="region" aria-label="${f("views")}" data-cursor="dragCursor"></div><div class="angle-controls">
      <button id="angle-prev" class="button iconic" type="button" aria-label="${f("previous")}">←</button><p id="angle-status" aria-live="polite"></p><button id="angle-next" class="button iconic" type="button" aria-label="${f("next")}">→</button></div></div>
      <div class="exhibit-label"><h2 id="exhibit-title"></h2><p id="exhibit-annotation"></p><div id="exhibit-facts"></div><div id="angle-thumbs"></div>
      <div class="exhibit-pagination"><button class="button" id="exhibit-prev" type="button">${f("exhibitPrevious")}</button><button class="button" id="exhibit-next" type="button">${f("exhibitNext")}</button></div>
      </div></div></div>
    </dialog>
    <nav class="wheel" id="wheel" aria-label="${f("roomMap")}" hidden><div class="wheel-dial"><svg viewBox="0 0 100 100" aria-label="${f("roomMap")}"></svg><span id="wheel-number" aria-hidden="true"></span></div><p id="wheel-status"></p></nav>
    <div id="doors" hidden><div class="door door-start"></div><div class="door door-end"></div><div class="door-copy"><p class="eyebrow">${escape(brand)}</p><p id="door-progress" aria-live="polite">${f("hang")} 00%</p><button id="door-skip" class="button" type="button">${f("skipDoors")}</button></div></div>
  </div>`;
}
