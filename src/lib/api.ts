const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

async function request(
  endpoint: string,
  options: RequestInit = {}
) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  })

  if (!res.ok) {
    throw new Error("API Error")
  }

  return res.json()
}

export const api = {
  getParagraph: (language: string, difficulty: string) =>
    request(`/paragraphs?language=${language}&difficulty=${difficulty}`),

  login: (data: { email: string; password: string }) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  register: (data: { email: string; password: string }) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  saveResult: (data: any) =>
    request("/results", {
      method: "POST",
      body: JSON.stringify(data),
    }),
}
