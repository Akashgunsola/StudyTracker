import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const VerifyEmail: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [message, setMessage] = useState<string>("Verifying...");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    console.log("Token from URL:", token);
    const verify = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/users/verify/${token}`, {
          method: "POST",
        });

        const data = await res.json();
      console.log("Verify response:", data); // ✅ DEBUG

        if (!res.ok) {
          throw new Error(data.message || "Verification failed");
        }

        setMessage("✅ Email verified successfully. You can now log in.");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (err: any) {
        setError(err.message);
        setMessage("");
      }
    };

    if (token) {
      verify();
    } else {
      setError("Invalid verification link.");
    }
  }, [token, navigate]);

  return (
    <div>
      <h1>Email Verification</h1>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default VerifyEmail;
