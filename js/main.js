import { $, content, safeUrl, t } from "./shared.js";
import { fingerprint, localPieces, museum } from "./markup.mjs";
import { setupTheme } from "./theme.js";
import { setupHero } from "./hero.js";
import { openDoors } from "./preloader.js";
import { setupWheel } from "./wheel-nav.js";
import { setupRooms } from "./rooms.js";
import { setupExhibit } from "./exhibit.js";

import { extras } from "./extras.mjs";
import { setupLoupe, setupPair } from "./loupe.js";
import { setupArchive } from "./archive-pile.js";
import { setupTicket } from "./ticket.js";
import { setupCursor } from "./cursor.js";

const lang = content.strings.fa && new URLSearchParams(location.search).get("lang") === "fa" ? "fa" : "en";
document.documentElement.lang = lang;
document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";
const root = $(".museum");
if (lang !== "en" || root.dataset.version !== fingerprint(content)) root.outerHTML = museum(content, lang, extras(content, lang));
const pieces = localPieces(content, lang);
setupTheme($("#theme"), t);
setupTheme($("#footer-theme"), t);
setupHero();
setupRooms(setupWheel(pieces));
if (setupExhibit(content, pieces)) document.documentElement.classList.add("enhanced");
setupLoupe(content);
setupPair();
setupArchive(content);
setupTicket(content.email);
setupCursor();
openDoors();

const instagram = content.instagram && safeUrl(content.instagram);
const schema = { "@context": "https://schema.org", "@type": "Person", name: content.artist };
if (instagram) schema.sameAs = [instagram];
$("#artist-schema").textContent = JSON.stringify(schema);
if (content.siteUrl && safeUrl(content.siteUrl)) {
  for (const target of ['[property="og:image"]', '[name="twitter:image"]']) {
    $(target).content = new URL("assets/img/social.jpg", content.siteUrl).href;
  }
}
