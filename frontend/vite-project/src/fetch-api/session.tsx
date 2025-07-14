const API = "http://localhost:8000/api/v1";

// ✅ Create a new session
export const createSession = async ({
  topic_id,
  subject_id,
  duration,
}: {
  topic_id: string;
  subject_id: string;
  duration: number;
}) => {
  const res = await fetch(`${API}/sessions`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ topic_id, subject_id, duration }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create session");
  }

  return await res.json(); // returns { success, session, streak }
};

export const deleteSession = async (id: string) => {
  const res = await fetch(`http://localhost:8000/api/v1/sessions/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to delete session");
  }

  return await res.json();
};

// ✅ Get sessions for a topic
export const getSessions = async (topicId: string) => {
  const res = await fetch(`${API}/sessions/topic/${topicId}`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch sessions");

  return await res.json(); // returns { success, sessions: [...] }
};
