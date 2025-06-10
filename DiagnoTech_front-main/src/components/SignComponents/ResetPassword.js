import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Sign.css";
import "../style.css";
import { BASE_URL } from "../../config";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    setError("");
    setSuccess("");

    if (newPassword.length < 6) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/users/resetPassword`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password. Try again.");
      }

      setSuccess("Password changed successfully!");
      setTimeout(() => {
        navigate("/login");
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
        <div className="forgot-heading-two">Reset Password</div>
        
        {error && <div className="forgot-error-message">{error}</div>}
        {success && <div className="forgot-success-message">{success}</div>}
        
        <div className="forgot-input-group">
          <label>Enter your new password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        
        <button 
          className="forgot-btn" 
          onClick={handleResetPassword} 
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Reset Password"}
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;