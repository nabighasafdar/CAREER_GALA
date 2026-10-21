export type Lead = { name: string; email?: string; phone: string; domain?: string; stage?: string; message?: string; kind?: string; details?: Record<string, unknown> };

/**
 * Sends the enquiry to VITE_FORM_ENDPOINT (any JSON POST endpoint, e.g. Formspree, a serverless
 * function or n8n webhook). With no endpoint configured it only simulates success, so the demo
 * works but NO lead is delivered. Set the variable before launch.
 */
export async function submitLead(lead: Lead) {
  const url = import.meta.env.VITE_FORM_ENDPOINT as string | undefined;
  if (!url) {
    console.warn("VITE_FORM_ENDPOINT is not set: form submission was simulated, nothing was sent.");
    await new Promise((r) => setTimeout(r, 900));
    return;
  }
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(lead) });
  if (!res.ok) throw new Error(`Submit failed (${res.status})`);
}
