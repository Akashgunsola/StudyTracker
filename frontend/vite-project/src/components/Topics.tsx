import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getTopics } from "../fetch-api/Topics";
import { getMe, getAllSessions } from "../fetch-api/dashboard";
import { Menu } from "@headlessui/react";

type Topic = {
  _id: string;
  name: string;
  description: string;
  duration: number;
};

const Topics: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [lastSubjectId, setLastSubjectId] = useState<string | null>(null);
  const [lastTopicId, setLastTopicId] = useState<string | null>(null);

  useEffect(() => {
    const loadUserAndSessions = async () => {
      try {
        const userData = await getMe();
        const sessionData = await getAllSessions();
        setUser(userData.user);

        if (sessionData.sessions.length > 0) {
          const last = sessionData.sessions[sessionData.sessions.length - 1];
          setLastSubjectId(last.subject_id);
          setLastTopicId(last.topic_id);
        }
      } catch (err: any) {
        setError(err.message);
      }
    };

    loadUserAndSessions();
  }, []);

  const loadTopics = async () => {
    if (!subjectId) return;
    try {
      const data = await getTopics(subjectId);
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, subject_id: subjectId }),
      });

      if (!res.ok) throw new Error("Failed to create topic");
      setName("");
      setDescription("");
      loadTopics();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">📘 Study Tracker</h1>
        <nav className="space-y-4">

          <button onClick={() => navigate("/dashboard")} className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-100">📈 Dashboard</button>
          <button onClick={() => navigate("/streaks")} className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-100">🔥 Streaks</button>
          <button onClick={() => navigate("/subjects")} className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-100">📚 Subjects</button>
          <button onClick={() => navigate("/topics")} className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-100">📂 Topics</button>
          <button
            onClick={() =>
              lastTopicId && lastSubjectId
                ? navigate(`/sessions/${lastTopicId}?subjectId=${lastSubjectId}`)
                : navigate("/subjects")
            }
            className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-100"
          >
            🕒 Sessions
          </button>
        </nav>

        {/* User Dropdown */}
        {user && (
          <Menu as="div" className="relative mt-auto">
            <Menu.Button className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold">
              {user.name?.[0]?.toUpperCase() || "U"}
            </Menu.Button>
            <Menu.Items className="absolute left-0 mt-2 w-48 bg-white border rounded shadow z-50">
              <div className="px-4 py-2 text-sm text-gray-700 border-b">
                Signed in as <br />
                <strong>{user.email}</strong>
              </div>
              <Menu.Item>
                {({ active }) => (
                  <button onClick={() => navigate("/profile")} className={`${active ? "bg-gray-100" : ""} w-full text-left px-4 py-2 text-sm text-gray-700`}>
                    👤 View Profile
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      navigate("/login");
                    }}
                    className={`${active ? "bg-gray-100" : ""} w-full text-left px-4 py-2 text-sm text-red-600`}
                  >
                    🚪 Logout
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Menu>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 sm:p-10">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">📂 Topics for this Subject</h2>

        <div className="mb-6 bg-white rounded-xl p-6 shadow-md space-y-4 border border-gray-200">
          <input
            type="text"
            placeholder="Topic name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          />
          <button
            onClick={handleAddTopic}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            ➕ Add Topic
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((t) => (
            <li key={t._id} className="bg-white border rounded-xl p-4 shadow hover:shadow-lg transition">
              <h3 className="text-lg font-semibold text-blue-700">{t.name}</h3>
              <p className="text-gray-600">{t.description}</p>
              <Link
                to={`/sessions/${t._id}?subjectId=${subjectId}`}
                className="mt-2 inline-block text-blue-500 hover:underline"
              >
                🕒 Start Session
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default Topics;
