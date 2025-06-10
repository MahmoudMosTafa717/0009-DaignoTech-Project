import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signtwo.css"; 
import "../style.css"
import { BASE_URL } from "../../config";

const VerifyCode = () => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleVerifyCode = async () => {
    setError("");
    setSuccess("");

    if (!code.trim()) {
      setError("Please enter the verification code.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/users/verifyResetCode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Invalid code. Please try again.");
      }

      setSuccess("Code verified successfully!");
      setTimeout(() => {
        navigate("/reset-password");
      }, 2000);
    } catch (error) {
      console.error("Error verifying code:", error);
      setError(error.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <div className="forgot-heading-two">Verify Code</div>
        <p>Enter the code sent to your email</p>
        
        {error && <div className="forgot-error-message">{error}</div>}
        {success && <div className="forgot-success-message">{success}</div>}
        
        <input
          type="text"
          placeholder="Enter verification code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <button
          className="forgot-btn"
          onClick={handleVerifyCode}
          disabled={isLoading}
        >
          {isLoading ? "Verifying..." : "Verify Code"}
        </button>
      </div>
    </div>
  );
};

export default VerifyCode;