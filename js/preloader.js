import { $, reduced, t } from "./shared.js";

export function openDoors() {
  if (reduced.matches || location.hash) return;
  try {
    if (sessionStorage.getItem("museum-admitted")) return;
    sessionStorage.setItem("museum-admitted", "1");
  } catch {}
  const doors = $("#doors");
  const image = $(".hero-portrait img");
  if (image.complete && image.naturalWidth) return;
  const skip = $("#door-skip");
  const main = $("#main");
  const covered = $(".museum");
  const siblings = [...covered.children].filter((node) => node !== doors);
  let done = false;
  const timeout = setTimeout(finish, 1700);
  function finish() {
    if (done) return;
    done = true;
    clearTimeout(timeout);
    const restore = doors.contains(document.activeElement);
    doors.classList.add("parting");
    siblings.forEach((node) => { node.inert = false; });
    skip.tabIndex = -1;
    if (restore) main.focus({ preventScroll: true });
    setTimeout(() => { doors.hidden = true; }, 460);
  }
  doors.hidden = false;
  siblings.forEach((node) => { node.inert = true; });
  skip.addEventListener("click", finish, { once: true });
  doors.addEventListener("keydown", (event) => { if (event.key === "Escape") finish(); });
  const loaded = () => {
    if (done) return;
    $("#door-progress").textContent = `${t("hang")} 100%`;
    setTimeout(finish, 100);
  };
  if (image.decode) image.decode().then(loaded, finish);
  else {
    image.addEventListener("load", loaded, { once: true });
    image.addEventListener("error", finish, { once: true });
  }
}
