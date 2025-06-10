import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signtwo.css"; 
import "../style.css"
import { BASE_URL } from "../../config";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/users/forgotpassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password. Try again.");
      }

      setSuccess("Check your email.");
      setTimeout(() => {
        navigate("/verify-code");
      }, 2000);
    } catch (error) {
      setError(error.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <div className="forgot-heading-three">Enter your email to confirm that this is you</div>
        
        {error && <div className="forgot-error-message">{error}</div>}
        {success && <div className="forgot-success-message">{success}</div>}
        
        <input
          type="email"
          name="email"
          placeholder="john.doe@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <button
          className="forgot-btn"
          onClick={handleForgotPassword}
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Confirm"}
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;