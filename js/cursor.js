import { el, onFrame, reduced, t } from "./shared.js";

export function setupCursor() {
  if (reduced.matches || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  const ring = el("div", { className: "cursor-ring", hidden: true });
  ring.setAttribute("aria-hidden", "true");
  document.body.append(ring);
  let magnet;
  function reset() {
    ring.hidden = true;
    magnet?.style.removeProperty("transform");
    magnet = undefined;
  }
  window.addEventListener("pointermove", onFrame((event) => {
    if (event.pointerType !== "mouse") { reset(); return; }
    const target = event.target.closest?.("[data-cursor]");
    ring.hidden = !target;
    if (target) {
      const owner = target.closest("dialog") || document.body;
      if (ring.parentElement !== owner) owner.append(ring);
      ring.textContent = t(target.dataset.cursor);
      ring.style.transform = `translate(${event.clientX + 10}px,${event.clientY + 10}px)`;
    }
    const button = event.target.closest?.("[data-magnet]");
    if (magnet !== button) magnet?.style.removeProperty("transform");
    magnet = button;
    if (!button) return;
    const rect = button.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * .065;
    const y = (event.clientY - rect.top - rect.height / 2) * .11;
    button.style.transform = `translate(${x}px,${y}px)`;
  }), { passive: true });
  window.addEventListener("keydown", reset);
  window.addEventListener("blur", reset);
  document.documentElement.addEventListener("pointerleave", reset);
}
