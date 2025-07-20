const API = "http://localhost:8000/api/v1";

export const getMe = async () => {
  const res = await fetch(`${API}/users/me`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch user");
  return await res.json();
};

export const getStreak = async () => {
  const res = await fetch(`${API}/streaks`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch streak");
  return await res.json();
};

export const getAllSessions = async () => {
  const res = await fetch(`${API}/sessions`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch sessions");
  return await res.json();
};
