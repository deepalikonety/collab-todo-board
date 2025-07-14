import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import loginBg from "../assets/logreg.jpg"; 

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      login(data.user, data.token);
      navigate("/board");
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="login-split">
      <div className="login-left" style={{ backgroundImage: `url(${loginBg})` }} />
      <div className="login-right">
        <div className="auth-page card">
          <h2>🔐 Login</h2>
          <form className="auth-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="emailOrUsername"
              placeholder="📧 Email or 👤 Username"
              value={formData.emailOrUsername}
              onChange={handleChange}
              required
            />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="🔒 Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <label style={{ fontSize: "0.85rem" }}>
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                style={{ marginRight: "6px" }}
              />
              Show Password
            </label>
            {error && <p className="error">{error}</p>}
            <button type="submit">Login</button>
          </form>
          <p style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{
               color: "#0077cc" }}>
              Register here 👉
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
