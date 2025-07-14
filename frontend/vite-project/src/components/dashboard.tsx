import React, { useEffect, useState } from "react";
import { getMe, getStreak, getAllSessions } from "../fetch-api/dashboard";

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [streak, setStreak] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Fetching /me...");
        const userData = await getMe();
        console.log("Fetching /streak...");
        const streakData = await getStreak();
        console.log("Fetching /sessions...");
        const sessionData = await getAllSessions();
        console.log("Fetched data:", { userData, streakData, sessionData });

        setUser(userData.user);
        setStreak(streakData.streak);
        setSessions(sessionData.sessions);
      } catch (err: any) {
        setError(err.message);
      }
    };

    loadData();
  }, []);

  const today = new Date().toDateString();
  const todaySessions = sessions.filter(
    (s) => new Date(s.createdAt).toDateString() === today
  );
  const totalTodayMinutes = todaySessions.reduce((sum, s) => sum + s.duration, 0);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📊 Dashboard</h1>

      {error && <p className="text-red-500">{error}</p>}

      {user && (
        <div className="mb-4">
          <p>👋 Welcome, <strong>{user.name || user.email}</strong></p>
        </div>
      )}

      <div className="space-y-2">
        <p>🔥 Streak: <strong>{streak?.current_streak || 0 }</strong> days</p>
        <p>🕒 Total sessions: <strong>{sessions.length}</strong></p>
        <p>📅 Sessions today: <strong>{todaySessions.length}</strong></p>
        <p>⏱️ Minutes studied today: <strong>{totalTodayMinutes}</strong> mins</p>
      </div>
    </div>
  );
};

export default Dashboard;

