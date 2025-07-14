import React, { useEffect, useState } from "react";
import { getSubjects, createSubject, deleteSubject } from "../fetch-api/subjectsapi";
import { Link } from "react-router-dom";

type Subject = {
  _id: string;
  title: string;
};


const Subjects: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubject, setNewSubject] = useState("");
  const [error, setError] = useState("");

  const loadSubjects = async () => {
    try {
      const data = await getSubjects();
      console.log("Subjects response:", data);
      setSubjects(data.userSubs); // or just `data` if backend returns plain array
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadSubjects();
  }, []);

const handleAdd = async () => {
  if (!newSubject.trim()) return;
  try {
    await createSubject(newSubject, "#ffa500"); // Send both title and color
    setNewSubject("");
    loadSubjects();
  } catch (err: any) {
    setError(err.message);
  }
};


  const handleDelete = async (id: string) => {
    try {
      await deleteSubject(id);
      loadSubjects();
    } catch (err: any) {
      setError(err.message);
    }
  };
  {subjects.map((subj) => (
  <li key={subj._id}>
    <Link to={`/topics/${subj._id}`}>{subj.title}</Link>
  </li>
))}

  return (
    <div>
      <h2>Your Subjects</h2>

      <input
        placeholder="New subject"
        value={newSubject}
        onChange={(e) => setNewSubject(e.target.value)}
      />
      <button onClick={handleAdd}>Add</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
  {subjects.map((subj) => (
    <li key={subj._id}>
      <Link to={`/topics/${subj._id}`}>{subj.title}</Link>
      <button onClick={() => handleDelete(subj._id)}>❌</button>
    </li>
  ))}
</ul>
    </div>
  );
};

export default Subjects;
