// src/App.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Insc() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    emoji: "" // Nouvel état pour l'émoji
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
      const response = await axios.post("https://api.flight.lolprostat.com/create", {
        email: formData.email,
        password: formData.password,
        username: formData.name,
        emoji: formData.emoji // Ajout de l'émoji dans les données envoyées
      });

      if (response.status === 200 || response.status === 201) {
        navigate("/signin");
      }
    } catch (err) {
      console.error("Error during registration:", err);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div>
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Create Account</h2>
            <p>Join us today!</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                className=""
                type="text"
                value={formData.name}
                name="name"
                onChange={handleChange}
                required
              />
            </div>
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
            {/* <div className="form-group">
              <label htmlFor="emoji">Profile Emoji ✈️</label>
              <input
                id="emoji"
                className=""
                type="text"
                value={formData.emoji}
                name="emoji"
                onChange={handleChange}
                maxLength="2" // Limite à 2 caractères pour un émoji standard
                required
              />
            </div> */}
            <button type="submit" className="submit-button">Sign Up</button>
          </form>
          <div className="auth-footer">
            <p>Already have an account?
              <button
                className="toggle-button"
                onClick={() => navigate("/signin")}
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Insc;
