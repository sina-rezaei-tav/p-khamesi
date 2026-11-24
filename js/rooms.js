import { $, $$, onFrame, reduced } from "./shared.js";
export function setupRooms(updateWheel) {
  const rooms = $$(".room");
  const links = $$(".directory a");
  let active = -2;
  const visible = new Set();
  if (!("IntersectionObserver" in window)) { updateWheel(-1); return; }
  const frame = onFrame(() => {
    const center = innerHeight * .54;
    let index = -1;
    for (const room of visible) {
      const { top, bottom, height } = room.getBoundingClientRect();
      if (top <= center && bottom > center) index = rooms.indexOf(room);
      if (!reduced.matches) {
        const offset = Math.max(-18, Math.min(18, (center - top - height / 2) / 22));
        room.style.setProperty("--depth", `${offset}px`);
      }
    }
    if (index === active) return;
    rooms[active]?.classList.remove("is-current");
    links[active]?.removeAttribute("aria-current");
    rooms[index]?.classList.add("is-current");
    links[index]?.setAttribute("aria-current", "location");
    updateWheel(index);
    active = index;
  });
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) visible.add(entry.target);
      else visible.delete(entry.target);
    }
    frame();
  });
  rooms.forEach((room) => observer.observe(room));
  window.addEventListener("scroll", frame, { passive: true });
  frame();
}
