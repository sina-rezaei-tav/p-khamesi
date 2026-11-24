import { $, el, rtl, t } from "./shared.js";
const NS = "http://www.w3.org/2000/svg";
const xy = (radius, angle) => {
  const radians = angle * Math.PI / 180;
  return [50 + radius * Math.cos(radians), 50 + radius * Math.sin(radians)].join(" ");
};
export function setupWheel(pieces) {
  const wheel = $("#wheel");
  const svg = $("svg", wheel);
  const links = [];
  const arc = 360 / pieces.length;
  pieces.forEach((piece, index) => {
    const start = -90 - arc / 2 + arc * index;
    const end = start + arc;
    const anchor = document.createElementNS(NS, "a");
    anchor.setAttribute("href", `#room-${piece.id}`);
    anchor.setAttribute("aria-label", piece.title);
    const path = document.createElementNS(NS, "path");
    path.setAttribute("d", `M${xy(48, start)} A48 48 0 0 1 ${xy(48, end)} L${xy(17, end)} A17 17 0 0 0 ${xy(17, start)} Z`);
    path.setAttribute("fill", piece.swatch);
    const title = document.createElementNS(NS, "title");
    title.textContent = piece.title;
    anchor.append(title, path);
    svg.append(anchor);
    links.push(anchor);
  });
  svg.addEventListener("keydown", (event) => {
    const index = links.indexOf(document.activeElement);
    if (index < 0 || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const step = (event.key === "ArrowRight" ? 1 : -1) * (rtl() ? -1 : 1);
    links[(index + step + links.length) % links.length].focus();
  });
  wheel.hidden = false;
  return (index) => {
    links.forEach((link, pos) => pos === index ? link.setAttribute("aria-current", "location") : link.removeAttribute("aria-current"));
    wheel.style.setProperty("--turn", `${Math.max(index, 0) * arc * (rtl() ? 1 : -1)}deg`);
    $("#wheel-number").textContent = index >= 0 ? pieces[index].catalogue : "·";
    $("#wheel-status").textContent = index >= 0 ? t("roomCount", { current: pieces[index].catalogue, total: pieces.length }) : t("roomMap");
  };
}
