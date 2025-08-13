const API_BASE_URL = "http://localhost:8000/api/v1";

export const forgotPassword = async (email: string) => {
  const res = await fetch(`${API_BASE_URL}/users/forgotpassword`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to send reset email");
  }

  return await res.json();
}; 