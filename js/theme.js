const key = "dayereh-theme";
const system = matchMedia("(prefers-color-scheme: dark)");
let choice;
try { choice = localStorage.getItem(key); } catch {}
export const theme = () => choice || (system.matches ? "dark" : "light");
function apply() {
  document.documentElement.dataset.theme = theme();
  document.dispatchEvent(new Event("museum-theme"));
}
export function setupTheme(button, t) {
  const label = () => {
    button.textContent = t(theme() === "dark" ? "daylight" : "afterHours");
    button.setAttribute("aria-pressed", String(theme() === "dark"));
  };
  button.hidden = false;
  button.addEventListener("click", () => {
    choice = theme() === "dark" ? "light" : "dark";
    try { localStorage.setItem(key, choice); } catch {}
    apply();
  });
  system.addEventListener("change", apply);
  document.addEventListener("museum-theme", label);
  apply();
}
