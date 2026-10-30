const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://backend-for-ats-model.onrender.com/v1/analyzeResume";
const BACKEND_HEALTH_URL = BACKEND_URL.replace(/\/v1\/analyzeResume\/?$/, "/health");

export async function isBackendAvailable(timeoutMs = 90000): Promise<boolean> {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(BACKEND_HEALTH_URL, { signal: controller.signal });
    clearTimeout(id);
    return res && res.ok;
  } catch (e) {
    return false;
  }
}

export async function analyzeWithBackend(file: Blob, filename: string, timeoutMs = 300000) {
  const url = BACKEND_URL;
  const form = new FormData();
  form.append('file', file, filename);

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { method: 'POST', body: form, signal: controller.signal });
    clearTimeout(id);
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Backend error ${res.status}: ${text}`);
    }
    const body = await res.text();
    try {
      return JSON.parse(body) as unknown;
    } catch {
      throw new Error("Backend returned invalid JSON.");
    }
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

export default BACKEND_URL;
