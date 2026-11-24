import { $, t } from "./shared.js";
export function setupTicket(email) {
  const form = $("#ticket-form");
  if (!form) return;
  $("#ticket-email").hidden = true;
  form.hidden = false;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const fields = [["name", "nameLabel"], ["email", "emailLabel"], ["piece", "pieceLabel"], ["message", "messageLabel"]];
    const body = fields.map(([name, key]) => `${t(key)}: ${data.get(name)}`).join("\r\n\r\n");
    const status = $("#ticket-status");
    status.textContent = t("ticketSent");
    status.hidden = false;
    const ticket = form.closest(".ticket");
    ticket.classList.remove("torn");
    requestAnimationFrame(() => requestAnimationFrame(() => ticket.classList.add("torn")));
    location.href = `mailto:${encodeURIComponent(email.trim()).replace(/%40/gi, "@")}?subject=${encodeURIComponent(t("ticketSubject"))}&body=${encodeURIComponent(body)}`;
  });
}
