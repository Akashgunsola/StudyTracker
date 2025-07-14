const API = "http://localhost:8000/api/v1";

export const getTopics = async (subjectId: string) => {
  const res = await fetch(`${API}/topics/${subjectId}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to load topics");
  return await res.json();
};

export const createTopic = async (
  subjectId: string,
  topicData: {
    name: string;
    description: string;
  }
) => {
  const res = await fetch(`${API}/topics`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...topicData,
      subject_id: subjectId, // ✅ this is what your backend needs
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create topic");
  }

  return await res.json();
};
