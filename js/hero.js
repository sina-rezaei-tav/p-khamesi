import { $, el, language, onFrame, reduced } from "./shared.js";

export function setupHero() {
  const clock = $(".clock");
  const art = $(".entrance-art");
  const time = $("#opening-time");
  clock.hidden = time.parentElement.hidden = false;
  const formatter = new Intl.DateTimeFormat(language(), { hour: "numeric", minute: "2-digit" });
  const hands = ["hour", "minute", "second"].map((key) => $(`#clock-${key}`));
  let lastMinute = -1;
  function tick() {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const second = now.getSeconds();
    [30 * (hour + minute / 60), 6 * (minute + second / 60), 6 * second].forEach((angle, index) => {
      hands[index].setAttribute("transform", `rotate(${angle} 96 83)`);
    });
    if (lastMinute !== minute) {
      time.textContent = formatter.format(now);
      time.dateTime = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
      lastMinute = minute;
    }
  }
  tick();
  setInterval(tick, reduced.matches ? 15000 : 1000);
  let restore;
  clock.addEventListener("click", () => {
    clock.classList.add("is-melted");
    clearTimeout(restore);
    restore = setTimeout(() => clock.classList.remove("is-melted"), 1250);
  });
  const heading = $("#entrance-title");
  if (reduced.matches) return;
  if (language() !== "fa") {
    const title = heading.textContent;
    heading.setAttribute("aria-label", title);
    let index = 0;
    heading.replaceChildren(...title.split(" ").flatMap((word, pos) => {
      const group = el("span");
      group.className = "reveal-word";
      group.setAttribute("aria-hidden", "true");
      for (const char of word) {
        const letter = el("span", { textContent: char, className: "reveal-letter" });
        letter.style.setProperty("--letter", index++);
        group.append(letter);
      }
      return pos ? [document.createTextNode(" "), group] : [group];
    }));
  }
  let idleTimer;
  let idle = false;
  const slump = onFrame(() => {
    clock.style.setProperty("--slump", 1 + Math.min(scrollY / 1700, .32) + (idle ? .17 : 0));
  });
  function activity() {
    if (idle) { idle = false; slump(); }
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => { idle = true; slump(); }, 10000);
  }
  window.addEventListener("scroll", () => { activity(); slump(); }, { passive: true });
  window.addEventListener("pointermove", onFrame(activity), { passive: true });
  window.addEventListener("keydown", activity);
  activity();
  art.addEventListener("pointermove", onFrame((event) => {
    if (document.documentElement.dataset.theme !== "dark") return;
    const rect = art.getBoundingClientRect();
    art.style.setProperty("--beam-x", `${(event.clientX - rect.left - rect.width / 2) * .33}px`);
    art.style.setProperty("--beam-y", `${(event.clientY - rect.top - rect.height / 2) * .25}px`);
  }), { passive: true });
}
