const API_URL = "http://localhost:8080";

export async function registerUser(email: string, password: string, confirmPassword: string) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, confirm_password: confirmPassword }),
  });
  return res.json();
}

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error("Ошибка авторизации");
  return res.json();
}

export async function getUser(token: string) {
  const res = await fetch(`${API_URL}/api/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Ошибка загрузки профиля");
  return res.json();
}