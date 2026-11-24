"use strict";

const content = window.portfolioContent;
const byId = (id) => document.getElementById(id);
const dialog = byId("lightbox");
const slide = byId("slide");
const localeButton = byId("locale");
let locale = "en";
let activePiece;
let activeIndex = 0;
let opener;
let swipeStart;

function copy(key, replacements = {}) {
  const text = content.strings[locale]?.[key] ?? content.strings.en[key];
  return text.replace(/\{(\w+)\}/g, (_, name) => replacements[name] ?? "");
}

function element(tag, options = {}) {
  return Object.assign(document.createElement(tag), options);
}

function picture(photo, sizes, eager = false) {
  const [width, height, description] = content.photos[photo];
  const widths = [...new Set([480, 960, 1600].map((size) => Math.min(width, size)))];
  const path = (size, format) => `assets/img/photo-${photo}-${size}.${format}`;
  const sources = (format) => widths.map((size) => `${path(size, format)} ${size}w`).join(", ");
  const wrapper = element("picture");
  const webp = element("source", { type: "image/webp", srcset: sources("webp"), sizes });
  const img = element("img", {
    alt: content.translations[locale]?.photoAlt?.[photo] || description,
    width,
    height,
    loading: eager ? "eager" : "lazy",
    decoding: "async",
    sizes,
    srcset: sources("jpg"),
    src: path(widths[0], "jpg")
  });
  wrapper.append(webp, img);
  return wrapper;
}

function makeCard(piece, index) {
  const localized = { ...piece, ...content.translations[locale]?.pieces?.[index] };
  const card = element("article", { className: "card" });
  const trigger = element("button", { type: "button" });
  trigger.setAttribute("aria-label", copy("open", { title: localized.title }));
  trigger.setAttribute("aria-haspopup", "dialog");
  const icon = element("span", { className: "expand", textContent: "↗" });
  icon.setAttribute("aria-hidden", "true");
  const sizes = piece.other ? "208px" : "(min-width: 1280px) 290px, (min-width: 800px) 24vw, (min-width: 650px) 46vw, 45vw";
  trigger.append(picture(piece.photos[0], sizes), icon);
  trigger.addEventListener("click", () => showGallery(localized, trigger));
  const notes = ["size", "materials", "price"]
    .filter((field) => localized[field])
    .map((field) => `${copy(field)}: ${localized[field]}`);
  card.append(trigger, element("h3", { textContent: localized.title }),
    element("p", { textContent: notes.join(" · ") || copy("piecePending") }));
  return card;
}

function renderDetails(translated) {
  byId("details").replaceChildren(...content.details.map((detail, index) => {
    const figure = element("figure");
    const photo = picture(detail.photo, "(min-width: 1280px) 400px, (min-width: 650px) 33vw, 72vw");
    photo.lastElementChild.style.objectPosition = detail.position;
    figure.append(photo, element("figcaption", {
      textContent: translated.details?.[index] || detail.caption
    }));
    return figure;
  }));
}

function externalUrl(value) {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url : null;
  } catch {
    return null;
  }
}

function renderContact(translated) {
  const list = byId("steps");
  const steps = translated.commissionSteps || content.commissionSteps;
  list.replaceChildren(...steps.map((step) => element("li", { textContent: step })));
  list.hidden = steps.length === 0;
  const links = byId("contact-links");
  links.replaceChildren();
  if (content.email.trim()) {
    links.append(element("a", {
      href: `mailto:${content.email.trim()}`,
      className: "button primary",
      textContent: copy("email")
    }));
  }
  const instagram = externalUrl(content.instagram);
  if (instagram) {
    links.append(element("a", { href: instagram.href, className: "button secondary", textContent: copy("instagram") }));
  }
  byId("contact-placeholder").hidden = links.childElementCount > 0;
  const schema = { "@context": "https://schema.org", "@type": "Person", name: content.artist };
  if (instagram) schema.sameAs = [instagram.href];
  byId("artist-schema").textContent = JSON.stringify(schema);
}

function render() {
  const translated = content.translations[locale] || {};
  const name = (locale === "fa" && content.nameFa) || content.artist;
  const brand = (locale === "fa" && content.brandFa) || content.brand;
  document.documentElement.lang = locale;
  document.documentElement.dir = locale === "fa" ? "rtl" : "ltr";
  document.querySelectorAll("[data-copy]").forEach((node) => {
    node.textContent = copy(node.dataset.copy, { name });
  });
  document.querySelectorAll("[data-label]").forEach((node) => {
    node.setAttribute("aria-label", copy(node.dataset.label));
  });
  document.querySelectorAll("[data-brand]").forEach((node) => { node.textContent = brand; });
  document.querySelectorAll("[data-by]").forEach((node) => { node.textContent = copy("by", { name }); });
  document.querySelector(".hero-frame img").alt = translated.photoAlt?.[3] || content.photos[3][2];
  for (const key of ["tagline", "process", "bio", "location"]) {
    const node = byId(key);
    node.textContent = translated[key] || content[key];
    if (key === "bio" && !node.textContent) node.textContent = copy("bioPending");
    node.hidden = !node.textContent;
  }
  byId("gallery").replaceChildren();
  byId("other").replaceChildren();
  content.pieces.forEach((piece, index) => {
    byId(piece.other ? "other" : "gallery").append(makeCard(piece, index));
  });
  renderDetails(translated);
  const portrait = content.portrait;
  byId("portrait").replaceChildren(portrait.src
    ? element("img", { ...portrait, alt: translated.portraitAlt || portrait.alt, loading: "lazy" })
    : element("span", { textContent: copy("portraitPending") }));
  renderContact(translated);
  localeButton.hidden = !content.strings.fa;
  const otherLocale = locale === "en" ? "fa" : "en";
  localeButton.lang = otherLocale;
  localeButton.textContent = content.strings[otherLocale]?.languageName ?? "";
}

function renderSlide() {
  const photos = activePiece.photos;
  slide.replaceChildren(picture(photos[activeIndex], "(min-width: 850px) 780px, 90vw", true));
  byId("count").textContent = copy("photoCount", { current: activeIndex + 1, total: photos.length });
  byId("previous").hidden = photos.length < 2;
  byId("next").hidden = photos.length < 2;
}

function showGallery(piece, trigger) {
  activePiece = piece;
  activeIndex = 0;
  opener = trigger;
  byId("lightbox-title").textContent = piece.title;
  renderSlide();
  dialog.showModal();
}

function stepSlide(delta) {
  const count = activePiece.photos.length;
  if (count < 2) return;
  activeIndex = (activeIndex + delta + count) % count;
  renderSlide();
}

byId("close").addEventListener("click", () => dialog.close());
byId("previous").addEventListener("click", () => stepSlide(-1));
byId("next").addEventListener("click", () => stepSlide(1));
dialog.addEventListener("close", () => {
  slide.replaceChildren();
  swipeStart = undefined;
  opener?.focus();
});
dialog.addEventListener("keydown", (event) => {
  if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
  event.preventDefault();
  const direction = locale === "fa" ? -1 : 1;
  stepSlide((event.key === "ArrowRight" ? 1 : -1) * direction);
});
slide.addEventListener("pointerdown", (event) => {
  if (event.pointerType !== "touch" || !event.isPrimary) return;
  slide.setPointerCapture(event.pointerId);
  swipeStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
});
slide.addEventListener("pointerup", (event) => {
  if (swipeStart?.id !== event.pointerId) return;
  const x = event.clientX - swipeStart.x;
  const y = event.clientY - swipeStart.y;
  swipeStart = undefined;
  if (Math.abs(x) < 45 || Math.abs(x) < Math.abs(y) * 1.3) return;
  stepSlide((x < 0 ? 1 : -1) * (locale === "fa" ? -1 : 1));
});
slide.addEventListener("pointercancel", () => { swipeStart = undefined; });
localeButton.addEventListener("click", () => {
  locale = locale === "en" ? "fa" : "en";
  render();
});

render();

const siteUrl = externalUrl(content.siteUrl);
if (siteUrl) {
  for (const selector of ['[property="og:image"]', '[name="twitter:image"]']) {
    const meta = document.querySelector(selector);
    meta.content = new URL(meta.content, siteUrl).href;
  }
}
if ("IntersectionObserver" in window && matchMedia("(prefers-reduced-motion: no-preference)").matches) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("entered");
      observer.unobserve(entry.target);
    }
  });
  document.querySelectorAll(".section-head, .about-inner, .contact-section h2")
    .forEach((node) => observer.observe(node));
}
