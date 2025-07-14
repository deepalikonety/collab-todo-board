import React from "react";
import { Link } from "react-router-dom";
import taskBg from "../assets/taskbg.jpg"; 
const HomePage = () => {
  const bgStyle = {
    backgroundImage: `url(${taskBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <div style={bgStyle}>
      <div className="home-content">
        <h1>Welcome to Task-Tracker</h1>
        <p>Manage your team tasks collaboratively <br />with real-time updates.</p>
        <div className="home-buttons">
          <Link to="/login">
            <button className="home-btn">🔐 Login</button>
          </Link>
          <Link to="/register">
            <button className="home-btn">📝 Register</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
