import React, { useEffect, useState } from "react";
import { getProfile } from "../fetch-api/profile";

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getProfile();
        setUser(data.user);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchUser();
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!user) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">👤 Your Profile</h1>
      <div className="space-y-4">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>User ID:</strong> {user._id}</p>
      </div>
    </div>
  );
};

export default Profile;
