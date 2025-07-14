import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import regibg from "../assets/regibg.png"; 

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      return setError("❌ Passwords do not match");
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-split">
      <div className="login-left" style={{ backgroundImage: `url(${regibg})` }} />
      <div className="login-right">
        <div className="auth-page card">
          <h2>📝 Register</h2>
          <form className="auth-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="👤 Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="📧 Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="🔒 Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="✅ Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <button type="submit">Register</button>
            {error && <p className="error">{error}</p>}
          </form>
          <p style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
          Not ready yet?{" "}
        <span
          onClick={() => navigate("/")}
           style={{
            color: "#0077cc",
            cursor: "pointer",
            }}
          >
           👈 Back to Home
          </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
