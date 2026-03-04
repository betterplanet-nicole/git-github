const API_BASE = window.API_BASE_URL || "http://localhost:3000";

async function api(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  return response.json();
}

function renderResult(id, data) {
  const el = document.getElementById(id);
  el.hidden = false;
  el.textContent = JSON.stringify(data, null, 2);
}

document.getElementById("lookupBtn").addEventListener("click", async () => {
  const zip = document.getElementById("zipLookup").value;
  const data = await api(`/providers?zip=${encodeURIComponent(zip)}`);
  renderResult("providerResult", data);
});

document.getElementById("leadBtn").addEventListener("click", async () => {
  const payload = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    email: document.getElementById("email").value,
    zip: document.getElementById("zip").value,
    consent: document.getElementById("consent").checked,
  };
  const data = await api("/lead", { method: "POST", body: JSON.stringify(payload) });
  renderResult("leadResult", data);
});

document.getElementById("quoteBtn").addEventListener("click", async () => {
  const payload = {
    leadId: document.getElementById("leadId").value,
    utilityProvider: document.getElementById("utilityProvider").value,
    monthlyBill: document.getElementById("monthlyBill").value,
    serviceState: document.getElementById("state").value,
  };
  const data = await api("/quote", { method: "POST", body: JSON.stringify(payload) });
  renderResult("quoteResult", data);
});

document.getElementById("callbackBtn").addEventListener("click", async () => {
  const payload = {
    leadId: document.getElementById("callbackLeadId").value,
    phone: document.getElementById("phone").value,
    preferredTime: document.getElementById("preferredTime").value,
  };
  const data = await api("/contact", { method: "POST", body: JSON.stringify(payload) });
  renderResult("callbackResult", data);
});
