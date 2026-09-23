import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
  firebaseSignIn,
  firebaseSignUp,
  saveSession,
  isLoggedIn,
} from "../firebase/firebase.js";

const Login = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Redirect already logged-in users to the home page
  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  // Switch between login and registration forms
  const changeTab = (tabName) => {
    setActiveTab(tabName);
    setErrorMessage("");
    setPassword("");
    setName("");
    setShowPassword(false);
  };

  // Basic email validation
  const isValidEmail = (emailValue) => {
    return emailValue.includes("@") && emailValue.includes(".");
  };

  // Login user with Firebase Authentication
  const loginUser = async () => {
    const emailValue = email.trim();

    if (!emailValue || !password) {
      setErrorMessage("Please enter email and password.");
      return;
    }

    if (!isValidEmail(emailValue)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const loginData = await firebaseSignIn(emailValue, password);

      // Store login information in localStorage
      saveSession(loginData);

      navigate("/");
    } catch (error) {
      setErrorMessage(
        error.message || "Login failed. Please check your email and password.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Create a new Firebase account
  const registerUser = async () => {
    const nameValue = name.trim();
    const emailValue = email.trim();

    if (!nameValue || !emailValue || !password) {
      setErrorMessage("Please fill all fields.");
      return;
    }

    if (!isValidEmail(emailValue)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      await firebaseSignUp(emailValue, password, nameValue);

      alert("Account created successfully! Please login.");

      setActiveTab("login");
      setPassword("");
      setName("");
      setShowPassword(false);
    } catch (error) {
      setErrorMessage(
        error.message || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="text-center mb-4">
          <div className="auth-logo">
            <i className="fa-solid fa-plane-departure me-2"></i>
            TravelNest
          </div>

          <p className="text-muted small mt-1 mb-0">Your home away from home</p>
        </div>

        <ul className="nav border-bottom mb-4">
          <li className="nav-item">
            <button
              className="nav-link border-0 px-4"
              style={{
                borderRadius: 0,
                background: "transparent",
                color: activeTab === "login" ? "var(--wn-teal)" : "#6b7280",
                fontWeight: activeTab === "login" ? 600 : 400,
                borderBottom:
                  activeTab === "login"
                    ? "2px solid var(--wn-teal)"
                    : "2px solid transparent",
              }}
              onClick={() => changeTab("login")}
            >
              Sign In
            </button>
          </li>

          <li className="nav-item">
            <button
              className="nav-link border-0 px-4"
              style={{
                borderRadius: 0,
                background: "transparent",
                color: activeTab === "register" ? "var(--wn-teal)" : "#6b7280",
                fontWeight: activeTab === "register" ? 600 : 400,
                borderBottom:
                  activeTab === "register"
                    ? "2px solid var(--wn-teal)"
                    : "2px solid transparent",
              }}
              onClick={() => changeTab("register")}
            >
              Create Account
            </button>
          </li>
        </ul>

        {errorMessage && (
          <div className="alert alert-danger py-2 small">{errorMessage}</div>
        )}

        {activeTab === "login" && (
          <>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Email</label>

              <div className="input-group">
                <span className="input-group-text">
                  <i className="fa-solid fa-envelope text-muted"></i>
                </span>

                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      loginUser();
                    }
                  }}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label small fw-semibold">Password</label>

              <div className="input-group">
                <span className="input-group-text">
                  <i className="fa-solid fa-lock text-muted"></i>
                </span>

                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      loginUser();
                    }
                  }}
                  autoComplete="current-password"
                />

                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i
                    className={
                      showPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"
                    }
                  ></i>
                </button>
              </div>
            </div>

            <button
              className="btn wn-btn-primary w-100 py-2"
              onClick={loginUser}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Signing in...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-right-to-bracket me-2"></i>
                  Sign In
                </>
              )}
            </button>
          </>
        )}

        {activeTab === "register" && (
          <>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Full Name</label>

              <div className="input-group">
                <span className="input-group-text">
                  <i className="fa-solid fa-user text-muted"></i>
                </span>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold">Email</label>

              <div className="input-group">
                <span className="input-group-text">
                  <i className="fa-solid fa-envelope text-muted"></i>
                </span>

                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label small fw-semibold">Password</label>

              <div className="input-group">
                <span className="input-group-text">
                  <i className="fa-solid fa-lock text-muted"></i>
                </span>

                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                />

                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i
                    className={
                      showPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"
                    }
                  ></i>
                </button>
              </div>
            </div>

            <button
              className="btn wn-btn-primary w-100 py-2"
              onClick={registerUser}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Creating...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-user-plus me-2"></i>
                  Create Account
                </>
              )}
            </button>
          </>
        )}

        <div className="text-center mt-4">
          <Link to="/" className="text-muted small text-decoration-none">
            <i className="fa-solid fa-arrow-left me-1"></i>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
