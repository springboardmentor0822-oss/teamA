import { useState } from "react";
import "./civic.css";

function Login({ onLogin }) {
  const [activeForm, setActiveForm] = useState("login");
  const [keepSignedIn, setKeepSignedIn] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    const userData = {
      name: e.target.email.value.split('@')[0],
      email: e.target.email.value,
      role: 'citizen',
      location: 'Your City'
    };
    
    // Save to localStorage if "Keep me signed in" is checked
    if (keepSignedIn) {
      localStorage.setItem('civix_user', JSON.stringify(userData));
    }
    
    if (onLogin) {
      onLogin(userData);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    alert("Account Created Successfully! Please login.");
    setActiveForm("login");
  };

  return (
    <div className="login-container">
      {/* Left Panel */}
      <div className="login-left">
        <div className="login-header">
          <div className="login-logo">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M4 11.5L12 4l8 7.5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7 10.5v8h10v-8"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1>Civix</h1>
          <p className="subtitle-left">Digital Civic Engagement Platform</p>
        </div>

        <div className="login-features">
          <div className="feature-item">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7"
                  stroke="white"
                  strokeWidth="2"
                />
                <path
                  d="M5 8h8M5 12h8M5 16h6"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <h3>Create & Sign Petitions</h3>
              <p>Easily create petitions for issues you care about and gather support from your community.</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12h4v7H5v-7zM10 5h4v14h-4V5zM15 9h4v10h-4V9z"
                  stroke="white"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div>
              <h3>Participate in Polls</h3>
              <p>Vote on local issues and see real-time results of community sentiment.</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 4h12v16H6z"
                  stroke="white"
                  strokeWidth="2"
                />
                <path
                  d="M9 8h6M9 12h6M9 16h4"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <h3>Track Official Responses</h3>
              <p>See how local officials respond to community concerns and track progress on issues.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="login-right">
        <div className="login-card">
          <h2 className="login-title">Welcome to Civix</h2>
          <p className="login-subtitle">
            Join our platform to make your voice heard in local governance.
          </p>

          {/* Tabs */}
          <div className="login-tabs">
            <button
              className={activeForm === "login" ? "login-tab active" : "login-tab"}
              onClick={() => setActiveForm("login")}
            >
              Login
            </button>

            <button
              className={activeForm === "register" ? "login-tab active" : "login-tab"}
              onClick={() => setActiveForm("register")}
            >
              Register
            </button>
          </div>

          {/* LOGIN FORM */}
          {activeForm === "login" && (
            <form className="login-form" onSubmit={handleLogin}>
              <div className="login-field">
                <label>Email</label>
                <input type="email" name="email" placeholder="your@email.com" required />
              </div>

              <div className="login-field">
                <label>Password</label>
                <input type="password" name="password" placeholder="••••••••" required />
              </div>

              <div className="login-checkbox">
                <input 
                  type="checkbox" 
                  id="keep-signed" 
                  checked={keepSignedIn}
                  onChange={(e) => setKeepSignedIn(e.target.checked)}
                />
                <label htmlFor="keep-signed">Keep me signed in</label>
              </div>

              <button type="submit" className="login-btn">
                Sign In
              </button>

              <p className="login-link">
                Don't have an account? <a onClick={() => setActiveForm("register")}>Register now</a>
              </p>
            </form>
          )}

          {/* REGISTER FORM */}
          {activeForm === "register" && (
            <form className="login-form" onSubmit={handleRegister}>
              <div className="login-field">
                <label>Full Name</label>
                <input type="text" placeholder="Jane Doe" required />
              </div>

              <div className="login-field">
                <label>Email</label>
                <input type="email" placeholder="your@email.com" required />
              </div>

              <div className="login-field">
                <label>Password</label>
                <input type="password" placeholder="••••••••" required />
              </div>

              <div className="login-field">
                <label>Location</label>
                <input type="text" placeholder="Your City, State" required />
              </div>

              <div className="login-field">
                <label htmlFor="role">I am registering as:</label>
                <select name="role" required>
                  <option value="">-- Select --</option>
                  <option value="citizen">Citizen</option>
                  <option value="official">Public Official</option>
                </select>
              </div>

              <button type="submit" className="login-btn">
                Create Account
              </button>

              <p className="login-link">
                Already have an account? <a onClick={() => setActiveForm("login")}>Login here</a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
