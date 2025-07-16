const API = "http://localhost:8000/api/v1";

export const getProfile = async () => {
  const res = await fetch(`${API}/users/me`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to load profile");
  }

  return await res.json();
};
