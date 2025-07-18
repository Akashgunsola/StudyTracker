import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen p-4 fixed">
      <h2 className="text-xl font-bold mb-8">Study Tracker</h2>
      <nav className="flex flex-col gap-4">
        <Link to="/dashboard" className="hover:bg-gray-700 rounded p-2">Dashboard</Link>
        <Link to="/subjects" className="hover:bg-gray-700 rounded p-2">Subjects</Link>
        <Link to="/profile" className="hover:bg-gray-700 rounded p-2">Profile</Link>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white rounded p-2 mt-auto"
        >
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
