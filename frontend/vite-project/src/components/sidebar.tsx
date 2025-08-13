import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

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

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-gray-900 dark:bg-gray-800 text-white dark:text-gray-100 h-screen p-4 fixed">
      <h2 className="text-xl font-bold mb-8">Study Tracker</h2>
      <button
        onClick={() => setDarkMode((prev) => !prev)}
        className="mb-4 p-2 rounded bg-gray-700 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-700 w-full"
      >
        {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>
      <nav className="flex flex-col gap-4">
        <Link to="/dashboard" className="hover:bg-gray-700 dark:hover:bg-gray-600 rounded p-2">Dashboard</Link>
        <Link to="/subjects" className="hover:bg-gray-700 dark:hover:bg-gray-600 rounded p-2">Subjects</Link>
        <Link to="/ai" className="hover:bg-gray-700 dark:hover:bg-gray-600 rounded p-2">AI Assistant</Link>
       
        <Link to="/profile" className="hover:bg-gray-700 dark:hover:bg-gray-600 rounded p-2">Profile</Link>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white rounded p-2 mt-auto"
        >
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
