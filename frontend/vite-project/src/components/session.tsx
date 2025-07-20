import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { createSession, getSessions, deleteSession } from "../fetch-api/session";
import { getMe } from "../fetch-api/dashboard";
import { Menu } from "@headlessui/react";

type Session = {
  _id: string;
  duration: number;
  createdAt: string;
};

const Sessions: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const subjectId = query.get("subjectId");
  const navigate = useNavigate();

  const [lastSubjectId, setLastSubjectId] = useState<string | null>(null);
  const [lastTopicId, setLastTopicId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [timerRunning, setTimerRunning] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsed, setElapsed] = useState<number>(0);
  const [duration, setDuration] = useState<number>(25);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Dark mode state
  const [darkMode, setDarkMode] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Fetch user + sessions
  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await getMe();
        setUser(userData.user);

        if (topicId) {
          const data = await getSessions(topicId);
          setSessions(data.sessions || []);
        }
      } catch (err: any) {
        setError(err.message);
      }
    };

    loadData();
  }, [topicId]);

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && startTime) {
      interval = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, startTime]);

  // Add new session
  const handleAddSession = async (durationOverride?: number) => {
    if (!topicId || !subjectId) {
      setError("Missing topic or subject");
      return;
    }

    const finalDuration = durationOverride ?? duration;
    if (finalDuration < 1) {
      setError("Invalid session duration");
      return;
    }

    setLoading(true);
    try {
      await createSession({ topic_id: topicId, subject_id: subjectId, duration: finalDuration });
      setDuration(25);
      const data = await getSessions(topicId);
      setSessions(data.sessions || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSession(id);
      if (topicId) {
        const data = await getSessions(topicId);
        setSessions(data.sessions || []);
      }
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
          <button onClick={() => navigate("/streaks")} className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-100">🔥 Streaks</button>
          <button onClick={() => navigate("/subjects")} className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-100">📚 Subjects</button>
          <button onClick={() => navigate("/topics")} className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-100">📂 Topics</button>
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

        {/* User */}
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
                  <button onClick={() => alert("Edit info (not implemented yet)")} className={`${active ? "bg-gray-100" : ""} w-full text-left px-4 py-2 text-sm text-gray-700`}>
                    ✏️ Edit Info
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button onClick={() => {
                    localStorage.removeItem("token");
                    navigate("/login");
                  }} className={`${active ? "bg-gray-100" : ""} w-full text-left px-4 py-2 text-sm text-red-600`}>
                    🚪 Logout
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Menu>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 sm:p-10 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
        <h2 className="text-2xl font-semibold text-blue-600 mb-4">🕒 Track Study Sessions</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Use the timer or enter a duration manually to log your session.</p>
        {error && <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>}

        {/* Timer Controls */}
        <div className="mb-6 space-y-3">
          {!timerRunning ? (
            <button onClick={() => {
              setStartTime(new Date());
              setElapsed(0);
              setTimerRunning(true);
            }} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
              ▶️ Start Timer
            </button>
          ) : (
            <button onClick={async () => {
              setTimerRunning(false);
              const minutes = Math.round(elapsed / 60);
              setDuration(minutes);
              await handleAddSession(minutes);
            }} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
              ⏹️ Stop Timer
            </button>
          )}
          {elapsed > 0 && (
            <p className="text-gray-700 dark:text-gray-200">⏱️ Elapsed: {Math.floor(elapsed / 60)} min {elapsed % 60} sec</p>
          )}
        </div>

        {/* Manual Duration Entry */}
        <div className="flex items-center gap-2 mb-6">
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="border px-3 py-2 rounded w-32 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
            placeholder="Duration (mins)"
          />
          <button onClick={() => handleAddSession()} disabled={loading} className={`${loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"} text-white px-4 py-2 rounded`}>
            {loading ? "Adding..." : "Add Session"}
          </button>
        </div>

        {/* Session List */}
        <ul className="space-y-2">
          {sessions.map((session) => (
            <li key={session._id} className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded shadow border border-gray-100 dark:border-gray-700">
              <span className="text-gray-900 dark:text-gray-100">{session.duration} min</span>
              <span className="text-gray-500 dark:text-gray-300">{new Date(session.createdAt).toLocaleString()}</span>
              <button
                onClick={() => handleDelete(session._id)}
                className="ml-4 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-lg cursor-pointer"
                title="Delete session"
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default Sessions;
