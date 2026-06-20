(function () {
  if (typeof window === "undefined") {
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const storageKey = "luv_subscribers";
  const defaultMailerLiteEndpoint = "https://assets.mailerlite.com/jsonp/2374679/forms/190533263957165697/subscribe";
  const mailerLiteMeta = document.querySelector('meta[name="mailerlite-endpoint"]');
  const globalMailerLiteEndpoint = mailerLiteMeta ? mailerLiteMeta.getAttribute("content") : defaultMailerLiteEndpoint;

  function subscribers() {
    try {
      return JSON.parse(window.localStorage.getItem(storageKey) || "[]");
    } catch (_error) {
      return [];
    }
  }

  function saveSubscriber(entry) {
    const existing = subscribers();
    const found = existing.find((item) => item.email === entry.email);
    const next = found
      ? existing.map((item) => (item.email === entry.email ? { ...item, ...entry, updatedAt: new Date().toISOString() } : item))
      : [...existing, { ...entry, createdAt: new Date().toISOString() }];
    window.localStorage.setItem(storageKey, JSON.stringify(next));
  }

  function setMessage(form, message, type) {
    const target = form.querySelector("[data-form-message]");
    if (!target) return;
    target.textContent = message;
    target.classList.toggle("error", type === "error");
    target.classList.toggle("success", type === "success");
  }

  function emitEvent(name, detail) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: name, ...detail });
    window.dispatchEvent(new CustomEvent(`luv:${name}`, { detail }));
  }

  function mailerLiteEndpoint(form) {
    const endpoint = form.getAttribute("data-mailerlite-endpoint") || form.getAttribute("action") || globalMailerLiteEndpoint || "";
    if (!endpoint || endpoint.includes("YOUR_")) return "";
    return endpoint;
  }

  async function submitToMailerLite(form, entry) {
    const endpoint = mailerLiteEndpoint(form);
    if (!endpoint) return { mode: "local" };

    const payload = new FormData(form);
    payload.set("fields[email]", entry.email);
    payload.set("fields[source]", entry.source);
    payload.set("fields[interest]", entry.interest);
    payload.set("fields[language]", "spanish");
    payload.set("fields[lead_magnet]", "la-guerra-silenciosa");
    payload.set("groups", form.getAttribute("data-mailerlite-group") || "");

    await fetch(endpoint, {
      method: "POST",
      body: payload,
      mode: "no-cors",
      credentials: "omit"
    });

    return { mode: "mailerlite" };
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.querySelector('input[type="email"]');
    const button = form.querySelector("button");
    const email = input ? input.value.trim().toLowerCase() : "";
    const source = form.getAttribute("data-source") || "unknown";
    const interest = form.getAttribute("data-interest") || "la-guerra-silenciosa";

    if (!email) {
      setMessage(form, "Escribe tu correo para recibir el recurso.", "error");
      input && input.focus();
      return;
    }

    if (!emailPattern.test(email)) {
      setMessage(form, "Ese correo no parece válido. Revísalo y vuelve a enviarlo.", "error");
      input && input.focus();
      return;
    }

    if (button) {
      button.disabled = true;
      button.dataset.originalText = button.dataset.originalText || button.textContent;
      button.textContent = "Enviando...";
    }

    const entry = {
        email,
        source,
        interest,
        tags: [
          "lead-magnet-la-guerra-silenciosa",
          `source-${source}`,
          interest === "el-remanente" ? "interested-el-remanente" : "",
          "language-spanish"
        ].filter(Boolean)
    };

    emitEvent("lead_form_submit", { source, interest });

    try {
      const result = await submitToMailerLite(form, entry);
      saveSubscriber(entry);
      emitEvent("lead_form_success", { source, interest, provider: result.mode });

      setMessage(form, "Listo. Te llevamos al siguiente paso.", "success");

      window.location.href = "/bienvenido/";
    } catch (_error) {
      emitEvent("lead_form_error", { source, interest, provider: "mailerlite" });
      setMessage(form, "No se pudo completar el envio. Revisa tu conexion e intentalo otra vez.", "error");
      if (button) {
        button.disabled = false;
        button.textContent = button.dataset.originalText || "Enviar";
      }
    }
  }

  function enhanceForms() {
    document.querySelectorAll("[data-email-form]").forEach((form) => {
      emitEvent("lead_form_view", {
        source: form.getAttribute("data-source") || "unknown",
        interest: form.getAttribute("data-interest") || "la-guerra-silenciosa"
      });
      form.addEventListener("submit", handleSubmit);
    });
  }

  document.addEventListener("DOMContentLoaded", enhanceForms);
})();
