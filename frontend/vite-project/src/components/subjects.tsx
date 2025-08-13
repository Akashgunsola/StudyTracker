import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getSubjects, createSubject, deleteSubject } from "../fetch-api/subjectsapi";
import { getMe } from "../fetch-api/dashboard"; // Import to get logged-in user
import { Menu } from "@headlessui/react";

type Subject = {
  _id: string;
  title: string;
};

const Subjects: React.FC = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubject, setNewSubject] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);
  const [lastTopicId, setLastTopicId] = useState<string | null>(null);
  const [lastSubjectId, setLastSubjectId] = useState<string | null>(null);
  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  const loadSubjects = async () => {
    try {
      const data = await getSubjects();
      setSubjects(data.userSubs); // or `data` if API returns a flat array
    } catch (err: any) {
      setError(err.message);
    }
  };

  const loadUser = async () => {
    try {
      const res = await getMe();
      setUser(res.user);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadUser();
    loadSubjects();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleAdd = async () => {
    if (!newSubject.trim()) return;
    try {
      await createSubject(newSubject, "#ffa500"); // Assuming color is fixed
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

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg p-6 space-y-6 text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">📘 Study Tracker</h1>
        <button
          onClick={() => setDarkMode((prev) => !prev)}
          className="mb-4 p-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 w-full"
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
        <nav className="space-y-4">
          <button onClick={() => navigate("/dashboard")} className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-100">📈 Dashboard</button>
          <button
            onClick={() => navigate("/streaks")}
            className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-100"
          >
            🔥 Streaks
          </button>
          <button
            onClick={() => navigate("/subjects")}
            className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-100"
          >
            📚 Subjects
          </button>
          <button
            onClick={() => navigate("/ai")}
            className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-100"
          >
            🤖 AI Assistant
          </button>
          <button
            onClick={() => navigate("/topics")}
            className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-100"
          >
            📂 Topics
          </button>
          <button
            onClick={() =>
              lastTopicId && lastSubjectId
                ? navigate(`/sessions/${lastTopicId}?subjectId=${lastSubjectId}`)
                : navigate("/sessions")
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
                  <button
                    onClick={() => navigate("/profile")}
                    className={`${active ? "bg-gray-100" : ""} w-full text-left px-4 py-2 text-sm text-gray-700`}
                  >
                    👤 View Profile
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => alert("Edit info (not implemented yet)")}
                    className={`${active ? "bg-gray-100" : ""} w-full text-left px-4 py-2 text-sm text-gray-700`}
                  >
                    ✏️ Edit Info
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

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
        <h2 className="text-xl font-semibold mb-4">Your Subjects</h2>

        <div className="mb-4 flex gap-2">
          <input
            placeholder="New subject"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            className="border px-4 py-2 rounded w-64 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
          />
          <button onClick={handleAdd} className="bg-blue-500 text-white px-4 py-2 rounded">Add</button>
        </div>

        {error && <p className="text-red-500 dark:text-red-400">{error}</p>}

        <ul className="space-y-2">
          {subjects.map((subj) => (
            <li key={subj._id} className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded shadow border border-gray-100 dark:border-gray-700">
              <Link to={`/topics/${subj._id}`} className="text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300">
                {subj.title}
              </Link>
              <button onClick={() => handleDelete(subj._id)} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                ❌
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Subjects;
