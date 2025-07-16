import React from "react";
import type { ReactNode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/login"
import VerifyEmail from "./components/verifyemail"
import Subjects from "./components/subjects";
import Topics from "./components/Topics";
import Sessions from "./components/session";
import Registeruser from "./components/registeruser"
import { Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Dashboard from "./components/dashboard";
import Profile from "./components/profile";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
   
   <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify/:token" element={<VerifyEmail />} />
        <Route path="/register" element={<Registeruser />}/>
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/topics/:subjectId" element={<Topics />} />
        <Route path="/sessions/:topicId" element={<Sessions />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />





      </Routes>
    </BrowserRouter>
    
  </React.StrictMode>,
)
