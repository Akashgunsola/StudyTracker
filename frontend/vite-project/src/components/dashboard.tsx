import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe, getStreak, getAllSessions } from "../fetch-api/dashboard";
import { Menu } from "@headlessui/react";
import { startOfMonth, endOfMonth, eachDayOfInterval, format, getDay, isSameDay } from 'date-fns';
import { getSubjects } from '../fetch-api/subjectsapi';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [streak, setStreak] = useState<{ count: number; lastSession: string | null }>({ count: 0, lastSession: null });
  const [sessions, setSessions] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [subjects, setSubjects] = useState<any[]>([]);

  const [lastSubjectId, setLastSubjectId] = useState<string | null>(null);
  const [lastTopicId, setLastTopicId] = useState<string | null>(null);

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

  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await getMe();
        const streakData = await getStreak();
        const sessionData = await getAllSessions();
        const subjectsData = await getSubjects();
        setUser(userData.user);
        setStreak(streakData.streak || { count: 0, lastSession: null });
        setSessions(sessionData.sessions || []);
        setSubjects(subjectsData.userSubs || subjectsData.subjects || []);
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
            onClick={() => navigate("/ai")}
            className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-100"
          >
            🤖 AI Assistant
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
      <main className="flex-1 p-6 sm:p-10 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
        {error && <p className="text-red-500 dark:text-red-400">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          <DashboardCard
            icon="🔥"
            bgColor="bg-gradient-to-tr from-orange-400 to-orange-600"
            title="Current Streak"
            value={streak?.current_streak || 0}
            description={
              streak.lastSession
                ? `Last session: ${new Date(streak.lastSession).toLocaleString()}`
                : "Adding session everyday increases your streak"
            }
            onClick={() => navigate("/streaks")}
          />

          {/* <DashboardCard
            icon="📚"
            bgColor="bg-gradient-to-tr from-blue-400 to-blue-600"
            title="Subjects"
            value="Manage"
            description="Add, edit or delete your subjects"
            onClick={() => navigate("/subjects")}
          /> */}

          {/* <DashboardCard
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
          /> */}

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
          <CalendarHeatmapCard sessions={sessions} />
          <SubjectDonutCard sessions={sessions} subjects={subjects} />
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
    className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 cursor-pointer p-6 border border-gray-100 dark:border-gray-700"
  >
    <div
      className={`w-12 h-12 flex items-center justify-center rounded-full text-white text-xl font-bold shadow-md ${bgColor}`}
    >
      {icon}
    </div>
    <h2 className="text-lg font-semibold mt-4 text-gray-800 dark:text-gray-100 group-hover:text-gray-900 dark:group-hover:text-white">{title}</h2>
    <p className="text-3xl font-extrabold mt-1 text-gray-700 dark:text-gray-200">{value}</p>
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
  </div>
);

const CalendarHeatmapCard: React.FC<{ sessions: any[] }> = ({ sessions }) => {
  // Get all days in the current month
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Map: date string (YYYY-MM-DD) -> total minutes
  const minutesByDay: Record<string, number> = {};
  sessions.forEach((s) => {
    const d = format(new Date(s.createdAt), 'yyyy-MM-dd');
    minutesByDay[d] = (minutesByDay[d] || 0) + s.duration;
  });

  // Color scale (light to dark)
  const colorScale = [
    'bg-green-100 dark:bg-green-900',
    'bg-green-200 dark:bg-green-800',
    'bg-green-300 dark:bg-green-700',
    'bg-green-400 dark:bg-green-600',
    'bg-green-500 dark:bg-green-500',
    'bg-green-600 dark:bg-green-400',
  ];
  const getColor = (mins: number) => {
    if (!mins) return 'bg-gray-100 dark:bg-gray-800';
    if (mins < 30) return colorScale[0];
    if (mins < 60) return colorScale[1];
    if (mins < 120) return colorScale[2];
    if (mins < 180) return colorScale[3];
    if (mins < 300) return colorScale[4];
    return colorScale[5];
  };

  // Prepare grid: pad start with empty days if month doesn't start on Monday
  const firstDayOfWeek = getDay(monthStart); // 0=Sunday, 1=Monday...
  const padStart = (firstDayOfWeek + 6) % 7; // Make Monday=0
  const gridDays = [
    ...Array(padStart).fill(null),
    ...days,
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Monthly Study Heatmap</h2>
      <div className="grid grid-cols-7 gap-2">
        {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d) => (
          <div key={d} className="text-xs font-bold text-center text-gray-500 dark:text-gray-400 mb-1">{d}</div>
        ))}
        {gridDays.map((day, idx) => {
          if (!day) return <div key={"pad-" + idx}></div>;
          const dStr = format(day, 'yyyy-MM-dd');
          const mins = minutesByDay[dStr] || 0;
          const hours = Math.floor(mins / 60);
          const minsRem = mins % 60;
          return (
            <div
              key={dStr}
              className={`flex flex-col items-center justify-center rounded-lg h-12 w-12 ${getColor(mins)} text-gray-900 dark:text-gray-100 font-semibold`}
            >
              <span className="text-[10px] font-medium text-gray-500 dark:text-gray-300">{format(day, 'd')}</span>
              <span className="text-sm font-bold">
                {mins > 0 ? `${hours ? hours + 'h' : ''}${minsRem ? minsRem + 'm' : ''}` : ''}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SubjectDonutCard: React.FC<{ sessions: any[]; subjects: any[] }> = ({ sessions, subjects }) => {
  // Aggregate total minutes by subject_id
  const totals: Record<string, number> = {};
  sessions.forEach((s) => {
    if (!s.subject_id) return;
    totals[s.subject_id] = (totals[s.subject_id] || 0) + s.duration;
  });
  // Prepare chart data
  const subjectLabels = subjects.map((subj) => subj.title);
  const subjectIds = subjects.map((subj) => subj._id);
  const data = {
    labels: subjectLabels,
    datasets: [
      {
        data: subjectIds.map((id) => totals[id] || 0),
        backgroundColor: [
          '#3b82f6', // blue
          '#f59e42', // orange
          '#10b981', // teal
          '#f43f5e', // red
          '#a21caf', // purple
          '#fbbf24', // yellow
          '#6366f1', // indigo
          '#14b8a6', // cyan
          '#eab308', // gold
          '#ef4444', // bright red
          '#8b5cf6', // violet
          '#22d3ee', // light blue
          '#f472b6', // pink
          '#84cc16', // lime
          '#e11d48', // rose
          '#0ea5e9', // sky
          '#f97316', // amber
          '#a3e635', // light green
          '#facc15', // gold
          '#64748b', // slate
          '#334155', // dark slate
          '#eab308', // gold
          '#f59e42', // orange
          '#f472b6', // pink
          '#a3e635', // light green
          '#f43f5e', // red
          '#f87171', // light red
          '#fbbf24', // yellow
          '#facc15', // gold
          '#fde68a', // light yellow
          '#fef08a', // pale yellow
          '#fef9c3', // cream
          '#f3f4f6', // light gray
          '#e5e7eb', // gray
          '#d1d5db', // gray
          '#9ca3af', // gray
          '#6b7280', // gray
          '#4b5563', // gray
          '#374151', // gray
          '#1f2937', // gray
          '#111827', // gray
          '#000000', // black
          '#ffffff', // white
        ],
        borderWidth: 2,
      },
    ],
  };
  const options = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const hours = Math.floor(value / 60);
            const mins = value % 60;
            return `${label}: ${hours ? hours + 'h ' : ''}${mins}m`;
          },
        },
      },
    },
    cutout: '70%',
    responsive: true,
    maintainAspectRatio: false,
  };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center" style={{ minHeight: 300 }}>
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Subject-wise Study Time</h2>
      <div className="w-full h-60 flex items-center justify-center">
        <Doughnut data={data} options={options} />
      </div>
      <div className="flex flex-wrap justify-center mt-4 gap-2">
        {subjects.map((subj, idx) => (
          <div key={subj._id} className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-200">
            <span style={{ backgroundColor: data.datasets[0].backgroundColor[idx], width: 12, height: 12, display: 'inline-block', borderRadius: 3 }}></span>
            {subj.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
