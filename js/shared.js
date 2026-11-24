export const content = window.portfolioContent;
export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
export const reduced = matchMedia("(prefers-reduced-motion: reduce)");
export const rtl = () => document.documentElement.dir === "rtl";
export const pad = (value) => String(value).padStart(2, "0");
export const language = () => document.documentElement.lang;
export function t(key, values = {}) {
  return (content.strings[language()]?.[key] ?? content.strings.en[key] ?? "")
    .replace(/\{(\w+)\}/g, (_, name) => values[name] ?? "");
}
export function el(type, props = {}, children = []) {
  const node = Object.assign(document.createElement(type), props);
  node.append(...children);
  return node;
}
export function onFrame(callback) {
  let frame = 0;
  return (...args) => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      callback(...args);
    });
  };
}
export function safeUrl(value, base) {
  try {
    const url = new URL(value, base);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch { return ""; }
}
export function swipe(node, onSwipe, start, move, cancel) {
  let gesture;
  node.addEventListener("pointerdown", (event) => {
    if (!event.isPrimary || event.button !== 0) return;
    gesture = { x: event.clientX, y: event.clientY, id: event.pointerId, at: performance.now() };
    node.setPointerCapture(event.pointerId);
    start?.();
  });
  node.addEventListener("pointermove", (event) => {
    if (gesture?.id === event.pointerId) move?.(event.clientX - gesture.x, event.clientY - gesture.y);
  });
  node.addEventListener("pointerup", (event) => {
    if (gesture?.id !== event.pointerId) return;
    const x = event.clientX - gesture.x;
    const y = event.clientY - gesture.y;
    const velocity = x / Math.max(1, performance.now() - gesture.at);
    gesture = null;
    if (Math.abs(x) > Math.max(28, Math.abs(y) * 1.15)) {
      onSwipe((x < 0 ? 1 : -1) * (rtl() ? -1 : 1), x, y, velocity);
    } else cancel?.();
  });
  node.addEventListener("pointercancel", () => {
    gesture = null;
    cancel?.();
  });
}
