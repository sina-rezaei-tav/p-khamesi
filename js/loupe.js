import { $, $$, onFrame, rtl } from "./shared.js";

export function setupLoupe(content) {
  const pointer = matchMedia("(hover: hover) and (pointer: fine)");
  $("#loupe-help").hidden = false;
  $$("[data-loupe]").forEach((button, index) => {
    const { photo: id, point } = content.loupes[index];
    const [width] = content.photos[id];
    const variant = Math.min(width, 1600);
    const image = button.parentElement.querySelector("img");
    const lens = $(".lens", button.parentElement);
    let x = point[0], y = point[1], pinned = false, hovering = false;
    button.hidden = false;
    function show() {
      const display = image.getBoundingClientRect();
      const zoom = Math.max(1, Math.min(2, variant / display.width));
      const diameter = Math.min(display.width * .66, 165);
      lens.style.width = lens.style.height = `${diameter}px`;
      lens.style.left = `${x}%`;
      lens.style.top = `${y}%`;
      lens.style.backgroundImage = `url("assets/img/photo-${id}-${variant}.webp")`;
      lens.style.backgroundSize = `${display.width * zoom}px ${display.height * zoom}px`;
      lens.style.backgroundPosition = `${diameter / 2 - x / 100 * display.width * zoom}px ${diameter / 2 - y / 100 * display.height * zoom}px`;
      lens.hidden = false;
      button.setAttribute("aria-pressed", "true");
    }
    function hide() {
      lens.hidden = true;
      button.setAttribute("aria-pressed", "false");
    }
    function pointAt(event) {
      const rect = button.getBoundingClientRect();
      x = Math.max(1, Math.min(99, (event.clientX - rect.left) / rect.width * 100));
      y = Math.max(1, Math.min(99, (event.clientY - rect.top) / rect.height * 100));
    }
    button.addEventListener("pointermove", onFrame((event) => {
      if (!hovering) return;
      pointAt(event);
      show();
    }));
    button.addEventListener("pointerenter", (event) => {
      if (!pointer.matches || event.pointerType !== "mouse") return;
      hovering = true;
      pointAt(event);
      show();
    });
    button.addEventListener("pointerleave", () => {
      hovering = false;
      if (!pinned) hide();
    });
    button.addEventListener("click", (event) => {
      if (event.detail && !hovering) pointAt(event);
      else if (!event.detail && !pinned) [x, y] = point;
      pinned = !pinned;
      if (pinned || hovering) show();
      else hide();
    });
    button.addEventListener("keydown", (event) => {
      const step = rtl() ? -6 : 6;
      const movement = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -6], ArrowDown: [0, 6] }[event.key];
      if (event.key === "Escape") { pinned = false; hide(); }
      if (!movement) return;
      event.preventDefault();
      pinned = true;
      x = Math.max(1, Math.min(99, x + movement[0]));
      y = Math.max(1, Math.min(99, y + movement[1]));
      show();
    });
    button.addEventListener("blur", () => {
      pinned = false;
      if (!hovering) hide();
    });
  });
}

export function setupPair() {
  const pins = $$("[data-pin]");
  const captions = $$("[data-pair-caption]");
  function select(active) {
    pins.forEach((pin, index) => {
      pin.setAttribute("aria-pressed", String(index === active));
      captions[index].hidden = index !== active;
    });
  }
  pins.forEach((pin, index) => {
    pin.hidden = false;
    pin.addEventListener("click", () => select(index));
    pin.addEventListener("focus", () => select(index));
    pin.addEventListener("pointerenter", (event) => { if (event.pointerType === "mouse") select(index); });
  });
  select(0);
}
