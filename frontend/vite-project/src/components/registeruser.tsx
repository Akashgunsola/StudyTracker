import React, { useState } from "react";
import { registerUser } from "../fetch-api/registerUser";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const RegisterForm: React.FC = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await registerUser({ username, email, password });
      alert("User registered! Please verify your email.");
      console.log(data); // Token or message from server
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (<div className="min-h-screen flex items-center justify-center bg-gray-300">
  <div className="bg-white p-12 rounded-lg shadow-md w-full max-w-7xl min-h-[600px] flex flex-col lg:flex-row">
    
    {/* Left Side - Registration Form */}
    <div className="w-full lg:w-1/2 flex flex-col justify-center px-8">
      <div className="mb-8">
        <img src="/logo.png" alt="PrepPilot Logo" className="w-32 h-auto" />
      </div>

      <h2 className="text-3xl font-thin mb-2">New? Register and start your journey of levelling up</h2>
      <p className="font-thin mb-6">Create an account to begin your productivity boost</p>

      <form onSubmit={handleRegister}>
        <h3 className="text-xl font-semibold mb-4">Register</h3>

        <div className="mb-4">
          <label className="block mb-1">Name:</label>
          <Input
            type="text"
            placeholder="Name"
            value={username}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Email:</label>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Password:</label>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="mt-2"
          variant="outline"
        >
          {loading ? "Registering..." : "Register"}
        </Button>

        {error && <p className="mt-2 text-red-500">{error}</p>}
      </form>

      <div className="mt-6">
        <p>
          Already have an account?{" "}
          <Button
            className="ml-2"
            variant="outline"
            onClick={() => (window.location.href = "/login")}
          >
            Login
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
  )
};

export default RegisterForm;
