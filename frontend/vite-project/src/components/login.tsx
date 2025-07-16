import React, { useState } from "react";
import { loginUser } from "../fetch-api/loginUser";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginUser({ email, password });

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      alert("Login successful!");
      window.location.href = "/dashboard";

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    
<div className="min-h-screen flex items-center justify-center bg-gray-300">
      <div className="bg-white p-12 rounded-lg shadow-md w-full max-w-7xl min-h-[600px] flex flex-col lg:flex-row">
        {/* Left Side - Login Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8">
          <div className="mb-8">
            <img src="/logo.png" alt="PrepPilot Logo" className="w-32 h-auto" />
          </div>

          <h2 className="text-3xl font-thin mb-2">Welcome Back!</h2>
          <p className="font-thin mb-6">Sign in to your dashboard and start grinding</p>

          <form onSubmit={handleLogin}>
            <h3 className="text-xl font-semibold mb-4">Login</h3>

            <div className="mb-4">
              <label className="block mb-1">Email:</label>
              <Input
                className="w-full p-2"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1">Password:</label>
              <Input
                className="w-full p-2"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button className="mt-2" variant="outline" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>

            {error && <p className="mt-2 text-red-500">{error}</p>}
          </form>

          <div className="mt-6">
            <p>
              Don't have an account?{" "}
              <Button
                className="ml-2"
                variant="outline"
                onClick={() => (window.location.href = "/register")}
              >
                Sign Up
              </Button>
            </p>
          </div>
        </div>

        {/* Right Side - Illustration / Info Panel */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-300 to-gray-600 p-12 items-center justify-center rounded-lg">
          <div className="text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Your Productivity Companion</h2>
            <p className="text-xl mb-8">Study smarter, not harder with PrepPilot</p>
            <div className="bg-white/20 p-6 rounded-xl backdrop-blur-sm">
              <p className="italic">"PrepPilot helped me organize my study routine..."</p>
              <p className="mt-4 font-medium">- Happy User</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
