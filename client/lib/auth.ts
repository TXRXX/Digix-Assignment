const TOKEN_KEY = "token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function isTokenValid(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1] ?? ""));
    if (!payload.exp) return false;
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function isAuthenticated(): boolean {
  const token = getToken();
  if (!token || !isTokenValid(token)) {
    clearToken();
    return false;
  }
  return true;
}

export function logout() {
  clearToken();
  window.location.href = "/login";
}
