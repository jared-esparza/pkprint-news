(() => {
  const scriptUrl = document.currentScript?.src;
  if (!scriptUrl) return;

  const configUrl = new URL("config.json", scriptUrl);

  document.addEventListener("DOMContentLoaded", async () => {
    try {
      const response = await fetch(configUrl, { cache: "no-store" });
      if (!response.ok) throw new Error("Configuración no disponible");

      const config = await response.json();

      if (config.contactEmail) {
        document.querySelectorAll("[data-site-email]").forEach((element) => {
          element.textContent = config.contactEmail;
          if ("href" in element) element.href = `mailto:${config.contactEmail}`;
        });
      }

      if (config.corporateWebsite) {
        document.querySelectorAll("[data-site-website]").forEach((element) => {
          if ("href" in element) element.href = config.corporateWebsite;
        });
      }

      if (config.location) {
        document.querySelectorAll("[data-site-location]").forEach((element) => {
          element.textContent = config.location;
        });
      }
    } catch (error) {
      console.debug("Configuración opcional no cargada.");
    }
  });
})();
