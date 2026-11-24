import { escape, photo, words } from "./markup.mjs";
export function extras(content, lang) {
  const t = words(content, lang);
  const f = (key, values) => escape(t(key, values));
  const translated = content.translations[lang] || {};
  const pair = content.pair;
  const captions = pair.hotspots.map((item, index) => ({ ...item, ...translated.hotspots?.[index] }));
  const paint = (id, sizes) => photo(content, id, { lang, sizes });
  const email = content.email.trim();
  const steps = translated.commissionSteps || content.commissionSteps;
  return `<section class="closer" id="closer" aria-labelledby="closer-title">
      <div class="wrap extras-layout"><div class="section-heading"><h2 id="closer-title">${f("closer")}</h2><p>${escape(translated.process || content.process || t("closerIntro"))}</p>
      <p class="interaction-help" hidden id="loupe-help">${f("zoomHelp")}</p></div>
      <div class="loupe-row">${content.loupes.map((item, index) => {
        const caption = translated.loupes?.[index] || item.caption;
        return `<figure class="loupe"><div class="loupe-stage">${paint(item.photo, "(min-width: 740px) 30vw, 72vw")}
          <button class="loupe-button" type="button" data-loupe="${index}" aria-label="${f("zoomPhoto", { title: caption })}" aria-describedby="loupe-help" aria-pressed="false" data-cursor="zoomCursor" hidden><span aria-hidden="true">+</span></button>
          <div class="lens" aria-hidden="true" hidden></div></div><figcaption>${escape(caption)}</figcaption></figure>`;
      }).join("")}</div></div></section>
    <section class="pair-section" id="pair" aria-labelledby="pair-title"><div class="wrap pair-layout">
      <div class="section-heading"><h2 id="pair-title">${f("pair")}</h2><p>${f("pairIntro")}</p>
        <div class="pair-caption" id="pair-caption" aria-live="polite">${captions.map((item, index) => `<div data-pair-caption="${index}"><strong>${escape(item.title)}</strong><p>${escape(item.caption)}</p></div>`).join("")}</div>
      </div>
      <div class="pair-print">
        <div class="pair-photo">${paint(pair.photo, "(min-width: 740px) 44vw, 86vw")}
        ${captions.map((item, index) => `<button class="pin" type="button" data-pin="${index}" style="--pin-x:${escape(item.point[0])}%;--pin-y:${escape(item.point[1])}%" aria-label="${index + 1} · ${escape(item.title)}" aria-controls="pair-caption" aria-pressed="false" hidden>${index + 1}</button>`).join("")}</div>
      </div>
    </div></section>
    <section class="archive" id="archive" aria-labelledby="archive-title"><div class="wrap archive-layout">
      <div class="section-heading"><h2 id="archive-title">${f("archive")}</h2><p id="archive-help" hidden>${f("archiveIntro")}</p>
      <div class="archive-tools" hidden><p id="print-caption"></p><p id="print-status" class="eyebrow"></p><span id="archive-announcement" class="sr-only" aria-live="polite"></span>
      <div class="archive-buttons"><button class="button iconic" id="print-prev" type="button" aria-label="${f("previous")}">←</button>
      <button class="button iconic" id="print-next" type="button" aria-label="${f("next")}">→</button>
      <button class="button" id="print-shuffle" type="button">${f("shuffle")}</button></div></div></div>
      <div class="archive-pile" role="region" aria-label="${f("archivePrints")}" aria-describedby="archive-help" tabindex="0" data-cursor="dragCursor" hidden><div class="print-table"><figure class="print" id="top-print"></figure></div></div>
      <ol class="archive-static" aria-label="${f("archivePrints")}">${content.archive.map((item, index) => `<li><figure>${paint(item.photo, "(min-width: 740px) 230px, 44vw")}<figcaption>${escape(translated.archive?.[index] || item.caption)}</figcaption></figure></li>`).join("")}</ol>
    </div></section>
    <section class="gift" id="contact" aria-labelledby="gift-title"><div class="wrap gift-layout">
      <div class="section-heading"><h2 id="gift-title">${f("gift")}</h2><p>${f("giftIntro")}</p>
      ${steps.length ? `<ol>${steps.map((step) => `<li>${escape(step)}</li>`).join("")}</ol>` : ""}</div>
      <div class="ticket"><div class="ticket-stub"><p>${f("admit")}</p><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0v16M0 8h16M2 2l12 12M2 14 14 2"/></svg></div>
      <div class="ticket-body"><p class="eyebrow">${f("ticketTitle")}</p>
      ${email ? `<a class="button primary" id="ticket-email" href="mailto:${escape(email)}">${f("email")}</a>
        <form id="ticket-form" action="mailto:${escape(email)}" hidden>
          <label>${f("nameLabel")}<input name="name" autocomplete="name" required></label>
          <label>${f("emailLabel")}<input name="email" type="email" autocomplete="email" required></label>
          <label>${f("pieceLabel")}<input name="piece"></label>
          <label>${f("messageLabel")}<textarea rows="3" name="message" required></textarea></label>
          <button class="button primary" type="submit" data-magnet>${f("submitTicket")}</button>
          <p id="ticket-status" role="status" hidden></p>
        </form>` : `<p>${f("contactPending")}</p>`}</div>
      </div></div></section>`;
}
