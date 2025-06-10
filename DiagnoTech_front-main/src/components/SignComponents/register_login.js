/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Sign.css";
import { BASE_URL } from "../../config";

const Sign = ({ defaultMode = "login" }) => {
  const [isLogin, setIsLogin] = useState(defaultMode === "login");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    age: "",
    email: "",
    password: "",
    confirmPassword: "",
    contact: "",
    agreeToTerms: false,
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [backendError, setBackendError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const passwordInputRef = useRef(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loginPasswordVisible, setLoginPasswordVisible] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (passwordInputRef.current && !passwordInputRef.current.contains(event.target)) {
        setShowPasswordRequirements(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [passwordInputRef]);

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    const rememberedPasswordExpiry = localStorage.getItem("rememberedPasswordExpiry");

    if (rememberedEmail && rememberedPasswordExpiry) {
      if (Date.now() < parseInt(rememberedPasswordExpiry)) {
        setLoginData({
          email: rememberedEmail,
          password: localStorage.getItem("rememberedPassword") || "",
        });
        setRememberMe(true);
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
        localStorage.removeItem("rememberedPasswordExpiry");
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    setBackendError("");

    if (name === "password") {
      validatePassword(value);
    }

    if (name === "confirmPassword" || (name === "password" && formData.confirmPassword)) {
      validateConfirmPassword(
        name === "confirmPassword" ? value : formData.confirmPassword,
        name === "password" ? value : formData.password
      );
    }
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
    setBackendError("");
  };

  const handleRememberMe = (e) => setRememberMe(e.target.checked);

  const handleForgotPassword = () => navigate("/forgot");

  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
    };

    setPasswordRequirements(requirements);

    if (password) {
      const allRequirementsMet = Object.values(requirements).every(Boolean);
      if (!allRequirementsMet) {
        setPasswordError("Password does not meet all requirements");
        return false;
      } else {
        setPasswordError("");
        return true;
      }
    } else {
      setPasswordError("Password is required");
      return false;
    }
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      return false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    } else {
      setConfirmPasswordError("");
      return true;
    }
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setBackendError("Full name is required");
      return false;
    }
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      setBackendError("Valid email is required");
      return false;
    }
    if (!formData.gender) {
      setBackendError("Gender is required");
      return false;
    }
    if (!formData.age.trim() || isNaN(formData.age) || formData.age <= 0) {
      setBackendError("Valid age is required");
      return false;
    }
    if (!formData.contact.trim() || !/^\d{11}$/.test(formData.contact)) {
      setBackendError("Contact number must be exactly 11 digits");
      return false;
    }
    if (!validatePassword(formData.password)) {
      setBackendError("Password does not meet requirements");
      return false;
    }
    if (!validateConfirmPassword(formData.confirmPassword, formData.password)) {
      setBackendError("Passwords do not match");
      return false;
    }
    if (!formData.agreeToTerms) {
      setBackendError("You must agree to the terms");
      return false;
    }

    return true;
  };

  const validateLoginForm = () => {
    if (!loginData.email.trim() || !/^\S+@\S+\.\S+$/.test(loginData.email)) {
      setBackendError("Valid email is required");
      return false;
    }
    if (!loginData.password.trim()) {
      setBackendError("Password is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setBackendError("");

    try {
      const response = await fetch(`${BASE_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          gender: formData.gender,
          age: formData.age,
          email: formData.email,
          password: formData.password,
          contact: formData.contact,
          agreeToTerms: formData.agreeToTerms,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        setBackendError(responseData.data?.error || "Registration failed. Please try again.");
        return;
      }

      setMessage({ type: "success", text: "Registration successful!" });
      setTimeout(() => setIsLogin(true), 2000);

      setFormData({
        fullName: "",
        gender: "",
        age: "",
        email: "",
        password: "",
        confirmPassword: "",
        contact: "",
        agreeToTerms: false,
      });
    } catch (error) {
      setBackendError("Connection error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateLoginForm()) {
      return;
    }

    setIsLoading(true);
    setBackendError("");

    try {
      const response = await fetch(`${BASE_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        setBackendError(responseData.data?.error || "Login failed. Please try again.");
        return;
      }

      const userData = responseData.data || {};
      const token = userData.token;
      const role = userData.user?.role;

      let userRole = role;
      if (!userRole) {
        if (userData.specialty || userData.availableAppointments) {
          userRole = "doctor";
        } else if (userData.isAdmin) {
          userRole = "admin";
        } else {
          userRole = "patient";
        }
      }

      login(token, userRole);

      if (rememberMe) {
        const expiryDate = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
        localStorage.setItem("rememberedEmail", loginData.email);
        localStorage.setItem("rememberedPassword", loginData.password);
        localStorage.setItem("rememberedPasswordExpiry", expiryDate.toString());
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
        localStorage.removeItem("rememberedPasswordExpiry");
      }

      setMessage({ type: "success", text: "Login successful!" });

      if (userRole === "admin") {
        navigate("/admin");
      } else if (userRole === "doctor") {
        navigate("/DoctorView");
      } else {
        navigate("/");
      }

      setLoginData({ email: "", password: "" });
    } catch (error) {
      setBackendError("Connection error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setPasswordVisible(!passwordVisible);
    } else if (field === "confirmPassword") {
      setConfirmPasswordVisible(!confirmPasswordVisible);
    } else if (field === "loginPassword") {
      setLoginPasswordVisible(!loginPasswordVisible);
    }
  };

  const PasswordRequirementsPopup = () => {
    if (!showPasswordRequirements) return null;

    return (
      <div className="sign-password-requirements-popup">
        <div className="sign-requirements-title">Password must contain:</div>
        <div className={`sign-requirement ${passwordRequirements.length ? "sign-met" : ""}`}>
          {passwordRequirements.length && <span className="sign-checkmark">✓</span>}
          At least 8 characters
        </div>
        <div className={`sign-requirement ${passwordRequirements.uppercase ? "sign-met" : ""}`}>
          {passwordRequirements.uppercase && <span className="sign-checkmark">✓</span>}
          At least one uppercase letter
        </div>
        <div className={`sign-requirement ${passwordRequirements.lowercase ? "sign-met" : ""}`}>
          {passwordRequirements.lowercase && <span className="sign-checkmark">✓</span>}
          At least one lowercase letter
        </div>
        <div className={`sign-requirement ${passwordRequirements.number ? "sign-met" : ""}`}>
          {passwordRequirements.number && <span className="sign-checkmark">✓</span>}
          At least one number
        </div>
        <div className={`sign-requirement ${passwordRequirements.special ? "sign-met" : ""}`}>
          {passwordRequirements.special && <span className="sign-checkmark">✓</span>}
          At least one special character
        </div>
      </div>
    );
  };

  return (
    <div className="sign-auth-page-wrapper">
      <div className={`sign-auth-container ${!isLogin ? "sign-active" : ""}`}>
        {/* Login Form */}
        <div className="sign-form-section sign-login">
          <form className="sign-auth-form" onSubmit={handleLoginSubmit}>
            <h2>Welcome Back</h2>
            <p className="sign-form-subtitle">Login to access your account</p>

            {backendError && <div className="sign-form-error">{backendError}</div>}
            {message.text && (
              <div className={`sign-form-message ${message.type}`}>{message.text}</div>
            )}

            <div className="sign-input-group">
              <label>Email</label>
              <div className="sign-input-with-icon">
                <input
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  placeholder="Enter your email"
                  required
                  style={{ boxShadow: "none" }}
                />
                <span className="sign-input-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </span>
              </div>
            </div>
            <div className="sign-input-group">
              <label>Password</label>
              <div className="sign-input-with-icon">
                <input
                  type={loginPasswordVisible ? "text" : "password"}
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  placeholder="Enter your password"
                  required
                  style={{ boxShadow: "none" }}
                />
                <span
                  className="sign-password-toggle"
                  onClick={() => togglePasswordVisibility("loginPassword")}
                  style={{ cursor: "pointer", position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)" }}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none">
                    <path
                      d={
                        loginPasswordVisible
                          ? "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                          : "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                      }
                    ></path>
                    {loginPasswordVisible ? (
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    ) : (
                      <circle cx="12" cy="12" r="3"></circle>
                    )}
                  </svg>
                </span>
              </div>
            </div>
            <div className="sign-form-actions">
              <label className="sign-remember-me">
                <input type="checkbox" checked={rememberMe} onChange={handleRememberMe} />
                <span>Remember me</span>
              </label>
              <span className="sign-forgot-link" onClick={handleForgotPassword}>
                Forgot Password?
              </span>
            </div>

            <button className="sign-primary-btn" type="submit" disabled={isLoading}>
              {isLoading ? (
                <span className="sign-loader-container">
                  <span className="sign-loader"></span>
                </span>
              ) : (
                "Login"
              )}
            </button>

            <div className="sign-divider">
              <span>Or</span>
            </div>

            {/* <button type="button" className="sign-social-btn sign-google-btn">
              <img src="https://img.icons8.com/color/20/000000/google-logo.png" alt="google icon" />
              <span>Sign In with Google</span>
            </button> */}
          </form>
          <div className="sign-switch-form-link">
            <p>
              Don't have an account?
              <button type="button" onClick={() => setIsLogin(false)}>
                Sign Up
              </button>
            </p>
          </div>
        </div>

        {/* Register Form */}
        <div className="sign-form-section sign-register">
          <form className="sign-auth-form sign-grid-two-cols" onSubmit={handleSubmit}>
            <h2>Create Account</h2>
            <p className="sign-form-subtitle">Let's get you set up with a new account</p>

            {backendError && <div className="sign-form-error sign-full-row">{backendError}</div>}
            {message.text && (
              <div className={`sign-form-message ${message.type} sign-full-row`}>{message.text}</div>
            )}

            <div className="sign-input-group">
              <label>Full Name</label>
              <div className="sign-input-with-icon">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  style={{ boxShadow: "none" }}
                />
                <span className="sign-input-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </span>
              </div>
            </div>

            <div className="sign-input-group">
              <label>Email</label>
              <div className="sign-input-with-icon">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  style={{ boxShadow: "none" }}
                />
                <span className="sign-input-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </span>
              </div>
            </div>

            <div className="sign-input-group">
              <label>Gender</label>
              <div className="sign-input-with-icon">
                <select name="gender" value={formData.gender} onChange={handleChange} required>
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div className="sign-input-group">
              <label>Age</label>
              <div className="sign-input-with-icon">
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Enter your age"
                  required
                  style={{ boxShadow: "none" }}
                />
                <span className="sign-input-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </span>
              </div>
            </div>

            <div className="sign-input-group" style={{ position: "relative" }}>
              <label>Password</label>
              <div className="sign-input-with-icon">
                <input
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  ref={passwordInputRef}
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setShowPasswordRequirements(true)}
                  placeholder="Create password"
                  required
                  style={{ boxShadow: "none", paddingRight: "40px" }}
                />
                <span
                  className="sign-password-toggle"
                  onClick={() => togglePasswordVisibility("password")}
                  style={{ cursor: "pointer", position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)" }}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none">
                    <path
                      d={
                        passwordVisible
                          ? "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                          : "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                      }
                    ></path>
                    {passwordVisible ? (
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    ) : (
                      <circle cx="12" cy="12" r="3"></circle>
                    )}
                  </svg>
                </span>
              </div>
              <PasswordRequirementsPopup />
              {passwordError && <p className="sign-field-error">{passwordError}</p>}
            </div>

            <div className="sign-input-group">
              <label>Confirm Password</label>
              <div className="sign-input-with-icon">
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  required
                  style={{ boxShadow: "none", paddingRight: "40px" }}
                />
                <span
                  className="sign-password-toggle"
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                  style={{ cursor: "pointer", position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)" }}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none">
                    <path
                      d={
                        confirmPasswordVisible
                          ? "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                          : "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                      }
                    ></path>
                    {confirmPasswordVisible ? (
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    ) : (
                      <circle cx="12" cy="12" r="3"></circle>
                    )}
                  </svg>
                </span>
              </div>
              {confirmPasswordError && <p className="sign-field-error">{confirmPasswordError}</p>}
            </div>

            <div className="sign-input-group">
              <label>Contact Number</label>
              <div className="sign-input-with-icon">
                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="Enter 11-digit phone number"
                  required
                  style={{ boxShadow: "none" }}
                />
                <span className="sign-input-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </span>
              </div>
              <p className="sign-helper-text">Phone number must be exactly 11 digits</p>
            </div>

            <div className="sign-terms-agreement">
              <label className="sign-checkbox-label">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                />
                <span className="sign-checkmark"></span>
                I agree to the <a href="#">Terms</a> and <a href="#">Privacy Policy</a>
              </label>
            </div>

            <div className="sign-full-row">
              <button className="sign-primary-btn" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <span className="sign-loader-container">
                    <span className="sign-loader"></span>
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>

              {/* <button type="button" className="sign-social-btn sign-google-btn sign-social-btn2">
                <img src="https://img.icons8.com/color/20/000000/google-logo.png" alt="google icon" />
                <span>Sign up with Google</span>
              </button> */}
            </div>
          </form>
          <div className="sign-switch-form-link">
            <p className="sign-already-have">
              Already have an account?
              <button type="button" onClick={() => setIsLogin(true)}>
                Sign In
              </button>
            </p>
          </div>
        </div>

        {/* Overlay Panel */}
        <div className="sign-toggle-panel-wrapper">
          <div className="sign-toggle-panel">
            {!isLogin ? (
              <div className="sign-panel-content">
                <h1>Welcome Back!</h1>
                <p>To keep connected with us please login with your personal info</p>
                <button onClick={() => setIsLogin(true)}>Sign In</button>
              </div>
            ) : (
              <div className="sign-panel-content">
                <h1>Hello, Friend!</h1>
                <p>Enter your personal details and start your journey with us</p>
                <button onClick={() => setIsLogin(false)}>Sign Up</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sign;
