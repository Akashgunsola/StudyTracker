const API = "http://localhost:8000/api/v1";

export const getSubjects = async () => {
  const res = await fetch(`${API}/subjects/`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch subjects");
  return res.json();
};

export const createSubject = async (title: string, color: string = "#00bfff") => {
  const res = await fetch("http://localhost:8000/api/v1/subjects/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ title, color }), // ✅ match backend fields
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.message || "Failed to create subject");
  }

  return res.json();
};

export const deleteSubject = async (id: string) => {
  const res = await fetch(`${API}/subjects/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete subject");
  return res.json();
};
