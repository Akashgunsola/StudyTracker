import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTopics, createTopic } from "../fetch-api/Topics";
import { Link } from "react-router-dom";

type Topic = {
  _id: string;
  name: string;
  description: string;
  duration: number;
};

const Topics: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  
  const [topics, setTopics] = useState<Topic[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(30);
  const [error, setError] = useState("");

  const loadTopics = async () => {
    if (!subjectId) return;
    try {
      const data = await getTopics(subjectId);
      console.log("Fetched topics:", data); 
      setTopics(data.topics || []);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadTopics();
  }, [subjectId]);

const handleAddTopic = async () => {
  if (!subjectId || !name) return;

  try {
    const res = await fetch(`http://localhost:8000/api/v1/topics`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
        subject_id: subjectId, // ✅ send subject_id in body
      }),
    });

    const text = await res.text();
    console.log("Response:", text);

    if (!res.ok) throw new Error("Failed to create topic");

    setName("");
    setDescription("");
    setDuration(30);
    loadTopics();
  } catch (err: any) {
    setError(err.message);
  }
};



{topics.map((t) => (
  <li key={t._id}>
    <strong>{t.name}</strong>
    <br />
    <Link to={`/sessions/${t._id}`}>Start Session</Link>
  </li>
))}



  return (
    <div>
      <h2>Topics for this Subject</h2>

      <div>
        <input
          type="text"
          placeholder="Topic name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button onClick={handleAddTopic}>Add Topic</button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

 <ul>
  {topics.map((t) => (
    <li key={t._id}>
      <strong>{t.name}</strong>
      <br />
      <Link to={`/sessions/${t._id}?subjectId=${subjectId}`}>
  Start Session
</Link>
    </li>
  ))}
</ul>
    </div>
  );
};

export default Topics;
