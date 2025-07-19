import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getSubjects, deleteSubject } from "../fetch-api/subjectsapi"; // Removed createSubject as per logic
import { getMe } from "../fetch-api/dashboard";
import { Menu } from "@headlessui/react";

type Subject = {
  _id: string;
  title: string;
};

const Subjects: React.FC = () => { // Corrected component name to Sessionfrontpage
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);
  const [lastTopicId, setLastTopicId] = useState<string | null>(null);
  const [lastSubjectId, setLastSubjectId] = useState<string | null>(null);

  const loadSubjects = async () => {
    try {
      const data = await getSubjects();
      setSubjects(data.userSubs);
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

  // Removed handleAdd as the form to add subjects is removed from this page.

  const handleDelete = async (id: string) => {
    try {
      await deleteSubject(id);
      loadSubjects();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar - Retained existing structure for consistency */}
      <aside className="w-64 bg-white shadow-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">📘 Study Tracker</h1>
        <nav className="space-y-4">
          <button onClick={() => navigate("/dashboard")} className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-100 transition-colors duration-200">📈 Dashboard</button>
          <button
            onClick={() => navigate("/streaks")}
            className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-100 transition-colors duration-200"
          >
            🔥 Streaks
          </button>
          <button
            onClick={() => navigate("/subjects")}
            className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-100 transition-colors duration-200"
          >
            📚 Subjects
          </button>
          <button
            onClick={() => navigate("/topics")}
            className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-100 transition-colors duration-200"
          >
            📂 Topics
          </button>
          <button
            onClick={() =>
              lastTopicId && lastSubjectId
                ? navigate(`/sessions/${lastTopicId}?subjectId=${lastSubjectId}`)
                : navigate("/sessions")
            }
            className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-100 transition-colors duration-200"
          >
            🕒 Sessions
          </button>
        </nav>

        {/* User Dropdown */}
        {user && (
          <Menu as="div" className="relative mt-auto">
            <Menu.Button className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold hover:bg-blue-600 transition-colors duration-200">
              {user.name?.[0]?.toUpperCase() || "U"}
            </Menu.Button>
            <Menu.Items className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 focus:outline-none">
              <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                Signed in as <br />
                <strong className="font-medium">{user.email}</strong>
              </div>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => navigate("/profile")}
                    className={`${active ? "bg-blue-50 text-blue-700" : "text-gray-700"} w-full text-left px-4 py-2 text-sm transition-colors duration-150`}
                  >
                    👤 View Profile
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => alert("Edit info (not implemented yet)")}
                    className={`${active ? "bg-blue-50 text-blue-700" : "text-gray-700"} w-full text-left px-4 py-2 text-sm transition-colors duration-150`}
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
                    className={`${active ? "bg-red-50 text-red-700" : "text-red-600"} w-full text-left px-4 py-2 text-sm transition-colors duration-150`}
                  >
                    🚪 Logout
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Menu>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 p-8 md:p-12">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-blue-300 pb-2">
          Select a subject to add a session to it
        </h2>

        {/* Removed 'Add Subject Form' section */}

        {/* Error Display */}
        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded-md mb-6 border border-red-300 animate-fade-in">
            Error: {error}
          </p>
        )}

        {/* Subjects List */}
        {subjects.length === 0 ? (
          <p className="text-gray-600 text-lg text-center py-10 bg-white rounded-lg shadow-md">
            No subjects found. Please add subjects from the 'Subjects' page first.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {subjects.map((subj) => (
              <li key={subj._id} className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col justify-between">
                {/* Link now directs to /sessionstopic/:subjectId */}
                <Link to={`/sessionstopic/${subj._id}`} className="text-lg font-bold text-blue-700 hover:text-blue-900 transition-colors duration-200 mb-2">
                  {subj.title}
                </Link>
                <div className="mt-auto">
                  <button
                    onClick={() => handleDelete(subj._id)}
                    className="mt-3 text-red-500 hover:text-red-700 text-sm font-medium transition-colors duration-200"
                    aria-label={`Delete subject ${subj.title}`}
                  >
                    Delete Subject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Subjects;