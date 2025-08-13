const API_BASE_URL = "http://localhost:8000/api/v1";

export const resetPassword = async (token: string, password: string) => {
  const res = await fetch(`${API_BASE_URL}/users/resetpassword`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to reset password");
  }

  return await res.json();
}; 