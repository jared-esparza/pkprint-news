document.addEventListener("DOMContentLoaded", async () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const status = document.getElementById("form-status");
  const subscriptionState = new URLSearchParams(window.location.search).get(
    "subscription"
  );

  if (status && subscriptionState === "confirmed") {
    status.className = "form-status is-success";
    status.textContent = "Tu suscripción ha sido confirmada correctamente.";
  }
});
