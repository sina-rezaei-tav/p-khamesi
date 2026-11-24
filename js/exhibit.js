import { $, $$, el, language, reduced, rtl, swipe, t } from "./shared.js";
import { label, photo } from "./markup.mjs";

export function setupExhibit(content, pieces) {
  const dialog = $("#exhibit");
  if (!dialog.showModal) return false;
  const frame = $("#angle-photo");
  const thumbs = $("#angle-thumbs");
  const leave = $("#leave");
  const prev = $("#angle-prev");
  const next = $("#angle-next");
  let current = 0, angle = 0, opener, warm;
  const wrap = (value, length) => (value + length) % length;
  function preload() {
    const following = pieces[wrap(current + 1, pieces.length)].photos[0];
    const resource = photo(content, following, { eager: true, sizes: "(min-width: 740px) 46vw, 89vw" });
    warm = el("div", { innerHTML: resource });
    const image = $("img", warm);
    image.fetchPriority = "low";
    image.decode?.().catch(() => {});
  }
  function showAngle() {
    const piece = pieces[current];
    frame.innerHTML = photo(content, piece.photos[angle], { eager: true, lang: language(), sizes: "(min-width: 740px) 46vw, 89vw" });
    $("#angle-status").textContent = t("angleCount", { angle: piece.angles[angle], current: angle + 1, total: piece.photos.length });
    prev.hidden = next.hidden = piece.photos.length === 1;
    [...thumbs.children].forEach((button, index) => button.setAttribute("aria-pressed", String(index === angle)));
  }
  const turn = (step) => {
    angle = wrap(angle + step, pieces[current].photos.length);
    showAngle();
  };
  function showPiece(index) {
    current = index;
    angle = 0;
    const piece = pieces[current];
    $("#exhibit-title").textContent = piece.title;
    $("#exhibit-catalogue").textContent = t("catalogue", { number: piece.catalogue });
    $("#exhibit-annotation").textContent = piece.annotation;
    $("#exhibit-facts").innerHTML = label(piece, t);
    thumbs.replaceChildren(...piece.photos.map((id, index) => {
      const button = el("button", { type: "button", innerHTML: photo(content, id, { alt: "", sizes: "54px" }) });
      button.setAttribute("aria-label", piece.angles[index]);
      button.addEventListener("click", () => { angle = index; showAngle(); });
      return button;
    }));
    thumbs.hidden = piece.photos.length === 1;
    showAngle();
    if (!dialog.open) dialog.showModal();
    dialog.scrollTop = 0;
    leave.focus({ preventScroll: true });
    if (window.requestIdleCallback) requestIdleCallback(preload, { timeout: 850 });
    else setTimeout(preload, 165);
  }
  const transition = (fn) => {
    if (!reduced.matches && document.startViewTransition) document.startViewTransition(fn);
    else fn();
  };
  function sync() {
    const index = pieces.findIndex((piece) => location.hash === `#exhibit-${piece.id}`);
    if (index >= 0) {
      if (!dialog.open || current !== index) transition(() => showPiece(index));
    } else if (dialog.open) {
      transition(() => {
        dialog.close();
        frame.replaceChildren();
        opener?.focus({ preventScroll: true });
        opener = undefined;
      });
    }
  }
  function open(index, replace = false) {
    const url = `#exhibit-${pieces[index].id}`;
    if (replace) history.replaceState(history.state, "", url);
    else history.pushState({ museumExhibit: true }, "", url);
    sync();
  }
  function close() {
    if (history.state?.museumExhibit) history.back();
    else {
      history.replaceState(null, "", `#room-${pieces[current].id}`);
      opener = $("[data-exhibit='" + pieces[current].id + "']");
      opener.closest(".room").scrollIntoView({ behavior: "instant" });
      sync();
    }
  }
  $$("[data-exhibit]").forEach((link, index) => link.addEventListener("click", (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    opener = link;
    open(index);
  }));
  window.addEventListener("hashchange", sync);
  leave.addEventListener("click", close);
  dialog.addEventListener("cancel", (event) => { event.preventDefault(); close(); });
  dialog.addEventListener("keydown", (event) => {
    if (["ArrowLeft", "ArrowRight"].includes(event.key)) {
      event.preventDefault();
      turn((event.key === "ArrowRight" ? 1 : -1) * (rtl() ? -1 : 1));
    }
    if (event.key !== "Tab") return;
    const items = $$("button:not([hidden]), #angle-photo", dialog).filter((node) => node.getClientRects().length);
    const boundary = event.shiftKey ? items[0] : items.at(-1);
    if (document.activeElement === boundary) {
      event.preventDefault();
      (event.shiftKey ? items.at(-1) : items[0]).focus();
    }
  });
  prev.addEventListener("click", () => turn(-1));
  next.addEventListener("click", () => turn(1));
  $("#exhibit-prev").addEventListener("click", () => open(wrap(current - 1, pieces.length), true));
  $("#exhibit-next").addEventListener("click", () => open(wrap(current + 1, pieces.length), true));
  swipe(frame, turn);
  sync();
  return true;
}
