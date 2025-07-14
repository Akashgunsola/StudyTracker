// utils/api.ts (optional: create a reusable API helper)
const API_BASE_URL = "http://localhost:8000/api/v1";

export const registerUser = async (userData: {
  username: string;
  email: string;
  password: string;
}) => {
  const res = await fetch(`${API_BASE_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Registration failed");
  }

  return await res.json();
};
