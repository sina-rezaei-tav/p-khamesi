import { $, language, onFrame, pad, reduced, rtl, swipe, t } from "./shared.js";
import { photo } from "./markup.mjs";

export function setupArchive(content) {
  const pile = $(".archive-pile");
  const top = $("#top-print");
  const table = $(".print-table");
  const translated = content.translations[language()] || {};
  const items = content.archive.map((item, index) => ({ ...item, caption: translated.archive?.[index] || item.caption }));
  let order = items.slice();
  let index = 0;
  const visual = $("#print-status");
  const announce = $("#archive-announcement");
  function render(announceChange = true) {
    const item = order[index];
    top.innerHTML = photo(content, item.photo, { eager: true, lang: language(), sizes: "(min-width: 740px) 350px, 70vw" });
    $("img", top).fetchPriority = "low";
    top.style.setProperty("--angle", `${(Math.random() * 5 - 2.5).toFixed(1)}deg`);
    const values = { current: pad(index + 1), total: pad(order.length), caption: item.caption };
    $("#print-caption").textContent = item.caption;
    visual.textContent = t("archiveCount", values);
    if (announceChange) announce.textContent = t("archiveAnnouncement", values);
  }
  let dragging = false;
  const reset = () => {
    dragging = false;
    top.style.removeProperty("--x");
    top.style.removeProperty("--y");
  };
  function change(step, x = 0, y = 0, velocity = 0) {
    if (!reduced.matches) {
      const flight = top.cloneNode(true);
      flight.removeAttribute("id");
      flight.setAttribute("aria-hidden", "true");
      flight.classList.add("flying");
      table.append(flight);
      const sign = x ? Math.sign(x) : -step * (rtl() ? -1 : 1);
      const travel = Math.min(900, 230 + Math.abs(velocity) * 270);
      const animation = flight.animate([
        { transform: `translate(${x}px,${y}px) rotate(${x / 24}deg)`, opacity: 1 },
        { transform: `translate(${x + travel * sign}px,${y + 32}px) rotate(${sign * 28}deg)`, opacity: 0 }
      ], { duration: 340, easing: "cubic-bezier(.1,.6,.24,1)" });
      animation.onfinish = () => flight.remove();
    }
    reset();
    index = (index + step + order.length) % order.length;
    render();
  }
  swipe(top, change, () => { dragging = true; }, onFrame((x, y) => {
    if (!dragging || reduced.matches) return;
    top.style.setProperty("--x", `${x}px`);
    top.style.setProperty("--y", `${y * .45}px`);
  }), reset);
  $("#print-prev").addEventListener("click", () => change(-1));
  $("#print-next").addEventListener("click", () => change(1));
  $("#print-shuffle").addEventListener("click", () => {
    const original = order[index];
    for (let pos = order.length - 1; pos > 0; pos--) {
      const other = Math.floor(Math.random() * (pos + 1));
      [order[pos], order[other]] = [order[other], order[pos]];
    }
    if (order[0] === original && order.length > 1) [order[0], order[1]] = [order[1], order[0]];
    index = 0;
    render();
  });
  pile.addEventListener("keydown", (event) => {
    if (!["ArrowRight", "ArrowLeft"].includes(event.key)) return;
    event.preventDefault();
    change((event.key === "ArrowRight" ? 1 : -1) * (rtl() ? -1 : 1));
  });
  if (!reduced.matches) $(".archive-static").hidden = true;
  pile.hidden = $(".archive-tools").hidden = $("#archive-help").hidden = false;
  if (!("IntersectionObserver" in window)) { render(false); return; }
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    if (!top.childElementCount) render(false);
    observer.disconnect();
  }, { rootMargin: "300px" });
  observer.observe(pile);
}
