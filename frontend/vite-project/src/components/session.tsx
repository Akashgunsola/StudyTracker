import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { createSession, getSessions, deleteSession } from "../fetch-api/session";

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
  const [timerRunning, setTimerRunning] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsed, setElapsed] = useState<number>(0);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [duration, setDuration] = useState<number>(25);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadSessions = async () => {
    try {
      if (!topicId) return;
      const data = await getSessions(topicId);
      setSessions(data.sessions || []);
    } catch (err: any) {
      setError(err.message);
    }
  };
  useEffect(() => {
    loadSessions();
  }, [topicId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
  
    if (timerRunning && startTime) {
      interval = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime.getTime()) / 1000));
      }, 1000);
    }
  
    return () => clearInterval(interval);
  }, [timerRunning, startTime]);
  

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
      await createSession({
        topic_id: topicId,
        subject_id: subjectId,
        duration: finalDuration,
      });
      setDuration(25);
      await loadSessions();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  const handleDelete = async (id: string) => {
    try {
      await deleteSession(id);
      await loadSessions(); // reload after delete
    } catch (err: any) {
      setError(err.message);
    }
  };
  

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Track Study Sessions</h2>

      <div className="mb-4">
      <div className="mb-4">
  {!timerRunning && (
    <button onClick={() => {
      setStartTime(new Date());
      setElapsed(0);
      setTimerRunning(true);
    }}>
      ▶️ Start Timer
    </button>
  )}

  {timerRunning && (
    <button onClick={async () => {
      setTimerRunning(false);
      const durationInMinutes = Math.round(elapsed / 60);
      setDuration(durationInMinutes);
      await handleAddSession(durationInMinutes);
    }}>
      ⏹️ Stop Timer
    </button>
  )}

  {elapsed > 0 && (
    <p>⏱️ Elapsed Time: {Math.floor(elapsed / 60)} min {elapsed % 60} sec</p>
  )}
</div>

        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          placeholder="Duration (in mins)"
        />
        <button onClick={() => handleAddSession()} disabled={loading}>
          {loading ? "Adding..." : "Add Session"}
        </button>
        
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul className="mt-4">
        {sessions.map((s) => (
          <li key={s._id}>
            ⏱️ {s.duration} mins | 📅 {new Date(s.createdAt).toLocaleString()}
            <button onClick={() => handleDelete(s._id)}>❌</button>

          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sessions;
