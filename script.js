document.addEventListener("DOMContentLoaded", async () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  try {
    const response = await fetch("config.json", { cache: "no-store" });
    if (response.ok) {
      const config = await response.json();
      if (config.contactEmail) {
        const email = document.getElementById("contact-email");
        if (email) {
          email.textContent = config.contactEmail;
          email.href = `mailto:${config.contactEmail}`;
        }
      }
    }
  } catch (error) {
    console.debug("Configuración opcional no cargada.");
  }

  const form = document.getElementById("subscription-form");
  const status = document.getElementById("form-status");
  if (!form || !status) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    status.className = "form-status";
    status.textContent = "";

    const formData = new FormData(form);
    const interests = formData.getAll("interests[]");

    if (interests.length === 0) {
      status.className = "form-status is-error";
      status.textContent = "Selecciona al menos un área de interés.";
      return;
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      clientType: String(formData.get("clientType") || "").trim(),
      sector: String(formData.get("sector") || "").trim(),
      interests,
      consent: Boolean(formData.get("consent")),
      source: "Origen web pk print"
    };

    const button = form.querySelector('button[type="submit"]');
    const originalLabel = button.textContent;
    button.disabled = true;
    button.textContent = "Enviando...";

    try {
      const response = await fetch("subscribe.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "No se ha podido completar la suscripción.");
      }

      status.className = "form-status is-success";
      status.textContent = "¡Gracias! Hemos registrado tus preferencias correctamente.";
      form.reset();
    } catch (error) {
      status.className = "form-status is-error";
      status.textContent = error.message || "Ha ocurrido un error. Inténtalo de nuevo.";
    } finally {
      button.disabled = false;
      button.textContent = originalLabel;
    }
  });
});
