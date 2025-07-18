import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe, getStreak, getAllSessions } from "../fetch-api/dashboard";
import { Menu } from "@headlessui/react";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [streak, setStreak] = useState<{ count: number; lastSession: string | null }>({ count: 0, lastSession: null });
  const [sessions, setSessions] = useState<any[]>([]);
  const [error, setError] = useState("");

  const [lastSubjectId, setLastSubjectId] = useState<string | null>(null);
  const [lastTopicId, setLastTopicId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await getMe();
        const streakData = await getStreak();
        const sessionData = await getAllSessions();

        setUser(userData.user);
        setStreak(streakData.streak || { count: 0, lastSession: null });
        setSessions(sessionData.sessions || []);

        if (sessionData.sessions.length > 0) {
          const last = sessionData.sessions[sessionData.sessions.length - 1];
          setLastSubjectId(last.subject_id);
          setLastTopicId(last.topic_id);
        }
      } catch (err: any) {
        setError(err.message);
      }
    };

    loadData();
  }, []);

  const today = new Date().toDateString();
  const todaySessions = sessions.filter((s) => new Date(s.createdAt).toDateString() === today);
  const totalTodayMinutes = todaySessions.reduce((sum, s) => sum + s.duration, 0);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">📘 Study Tracker</h1>
        <nav className="space-y-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-100"
          >
            📈 Dashboard
          </button>

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
            onClick={() => navigate("/topics")}
            className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-100"
          >
            📂 Topics
          </button>
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
                  <button
                    onClick={() => navigate("/profile")}
                    className={`${
                      active ? "bg-gray-100" : ""
                    } w-full text-left px-4 py-2 text-sm text-gray-700`}
                  >
                    👤 View Profile
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => alert("Edit info (not implemented yet)")}
                    className={`${
                      active ? "bg-gray-100" : ""
                    } w-full text-left px-4 py-2 text-sm text-gray-700`}
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
                    className={`${
                      active ? "bg-gray-100" : ""
                    } w-full text-left px-4 py-2 text-sm text-red-600`}
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
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          <DashboardCard
            icon="🔥"
            bgColor="bg-gradient-to-tr from-orange-400 to-orange-600"
            title="Current Streak"
            value={streak?.current_streak || 0}
            description={
              streak.lastSession
                ? `Last session: ${new Date(streak.lastSession).toLocaleString()}`
                : "No sessions yet"
            }
            onClick={() => navigate("/streaks")}
          />

          <DashboardCard
            icon="📚"
            bgColor="bg-gradient-to-tr from-blue-400 to-blue-600"
            title="Subjects"
            value="Manage"
            description="Add, edit or delete your subjects"
            onClick={() => navigate("/subjects")}
          />

          <DashboardCard
            icon="📂"
            bgColor="bg-gradient-to-tr from-purple-400 to-purple-600"
            title="Topics"
            value="Explore"
            description={
              lastSubjectId ? "View topics for your last subject" : "Select a subject to get started"
            }
            onClick={() =>
              lastSubjectId ? navigate(`/topics/${lastSubjectId}`) : navigate("/subjects")
            }
          />

          <DashboardCard
            icon="🕒"
            bgColor="bg-gradient-to-tr from-green-400 to-green-600"
            title="Today's Study"
            value={`${totalTodayMinutes} min`}
            description={`${todaySessions.length} session${todaySessions.length !== 1 ? "s" : ""}`}
            onClick={() =>
              lastTopicId && lastSubjectId
                ? navigate(`/sessions/${lastTopicId}?subjectId=${lastSubjectId}`)
                : navigate("/subjects")
            }
          />
        </div>
      </main>
    </div>
  );
};

type CardProps = {
  icon: string;
  title: string;
  value: string;
  description: string;
  onClick: () => void;
  bgColor: string;
};

const DashboardCard: React.FC<CardProps> = ({
  icon,
  title,
  value,
  description,
  onClick,
  bgColor,
}) => (
  <div
    onClick={onClick}
    className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 cursor-pointer p-6 border border-gray-100"
  >
    <div
      className={`w-12 h-12 flex items-center justify-center rounded-full text-white text-xl font-bold shadow-md ${bgColor}`}
    >
      {icon}
    </div>
    <h2 className="text-lg font-semibold mt-4 text-gray-800 group-hover:text-gray-900">{title}</h2>
    <p className="text-3xl font-extrabold mt-1 text-gray-700">{value}</p>
    <p className="text-sm text-gray-500 mt-1">{description}</p>
  </div>
);

export default Dashboard;
