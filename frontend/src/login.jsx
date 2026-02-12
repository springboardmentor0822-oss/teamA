import { useState } from "react";
import "./civic.css";

function Login({ onLogin }) {
  const [activeForm, setActiveForm] = useState("login");

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: Send login request to backend
    // For now, pass user data structure that will come from backend
    const userData = {
      name: e.target.email.value.split('@')[0],
      email: e.target.email.value,
      role: 'citizen',
      location: 'Your City'
    };
    if (onLogin) {
      onLogin(userData);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    // TODO: Send registration request to backend
    alert("Account Created Successfully! Please login.");
    setActiveForm("login");
  };

  return (
    <div className="login-page">
      <div className="card">
      <h2 className="title">Welcome to Civix</h2>
      <p className="subtitle">
        Join our platform to make your voice heard in local governance.
      </p>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeForm === "login" ? "active" : ""}
          onClick={() => setActiveForm("login")}
        >
          Login
        </button>

        <button
          className={activeForm === "register" ? "active" : ""}
          onClick={() => setActiveForm("register")}
        >
          Register
        </button>
      </div>

      {/* LOGIN FORM */}
      {activeForm === "login" && (
        <form className="form" onSubmit={handleLogin}>
          <div className="field">
            <label>Email</label>
            <input type="email" name="email" placeholder="your@gmail.com" required />
          </div>

          <div className="field">
            <label>Password</label>
            <input type="password" name="password" placeholder="******" required />
          </div>

          <button type="submit" className="primary-btn">
            Sign In
          </button>
        </form>
      )}

      {/* REGISTER FORM */}
      {activeForm === "register" && (
        <form className="form" onSubmit={handleRegister}>
          <div className="field">
            <label>Full Name</label>
            <input type="text" placeholder="Jane Doe" required />
          </div>

          <div className="field">
            <label>Email</label>
            <input type="email" placeholder="your@gmail.com" required />
          </div>

          <div className="field">
            <label>Password</label>
            <input type="password" placeholder="password" required />
          </div>

          <div className="field">
            <label>Location</label>
            <input type="text" placeholder="Delhi, India" required />
          </div>

          <div className="dropdown-group">
            <label htmlFor="role">I am registering as:</label>
            <select name="role" required>
              <option value="">-- Select --</option>
              <option value="citizen">Citizen</option>
              <option value="public">Public Official</option>
            </select>
          </div>

          <button type="submit" className="primary-btn">
            Create Account
          </button>
        </form>
      )}
      </div>
    </div>
  );
}

export default Login;