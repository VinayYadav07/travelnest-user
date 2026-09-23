import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { firebaseSignUp } from "../firebase/firebase.js";

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const registerUser = async () => {
    const nameValue = name.trim();
    const emailValue = email.trim();

    // Validate required fields.
    if (!nameValue || !emailValue || !password) {
      setErrorMessage("Please fill all fields.");
      return;
    }

    // Validate email format.
    if (!emailValue.includes("@") || !emailValue.includes(".")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    // Validate minimum password length.
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      // Create the account using Firebase Authentication.
      await firebaseSignUp(emailValue, password, nameValue);

      alert("Account created successfully! Please login.");

      navigate("/login");
    } catch (error) {
      setErrorMessage(error.message || "Registration failed.");
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

          <p className="text-muted small mt-1 mb-0">Create your account</p>
        </div>

        {errorMessage && (
          <div className="alert alert-danger py-2 small">{errorMessage}</div>
        )}

        <div className="mb-3">
          <label className="form-label small fw-semibold">Full Name</label>

          <input
            type="text"
            className="form-control"
            placeholder="Enter your full name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label small fw-semibold">Email</label>

          <input
            type="email"
            className="form-control"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="form-label small fw-semibold">Password</label>

          <input
            type="password"
            className="form-control"
            placeholder="Min 6 characters"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <button
          className="btn wn-btn-primary w-100 py-2"
          onClick={registerUser}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        <div className="text-center mt-4">
          <Link to="/login" className="text-muted small text-decoration-none">
            Already have an account? Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
