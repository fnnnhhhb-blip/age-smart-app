const API = 'http://localhost:5180';

export async function getShared(key: string): Promise<string | null> {
  try {
    const res = await fetch(`${API}/data/${key}`);
    const { value } = await res.json();
    return value !== null ? JSON.stringify(value) : null;
  } catch {
    // Fallback to localStorage if server unavailable
    return localStorage.getItem(key);
  }
}

export async function setShared(key: string, value: unknown): Promise<void> {
  try {
    await fetch(`${API}/data/${key}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value }),
    });
  } catch {
    // Fallback to localStorage
    localStorage.setItem(key, JSON.stringify(value));
  }
}
