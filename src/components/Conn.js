// src/App.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Conn() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("https://api.flight.lolprostat.com/login", {
        email: formData.email,
        password: formData.password
      });

      if (response.status === 200) {
        // Stocker le token si l'API en renvoie un
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }

        // Redirection vers la page d'accueil
        navigate("/home");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div>
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Sign In</h2>
            <p>Welcome back!</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                className=""
                type="email"
                value={formData.email}
                name="email"
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                className=""
                type="password"
                value={formData.password}
                name="password"
                onChange={handleChange}
                required
              />
            </div>
            <div className="forgot-password">
              <a href="#forgot">Forgot password?</a>
            </div>
            <button type="submit" className="submit-button">Sign In</button>
          </form>
          <div className="auth-footer">
            <p>Don't have an account?
              <button
                className="toggle-button"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Conn;
