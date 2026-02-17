import { useState } from "react";
import "./civic.css";

const Dashboard = ({ userData, onLogout, onNavigate }) => {
  const user = userData || {};
  const displayName = user.name || 'User';
  const userInitial = displayName.charAt(0).toUpperCase();
  const userEmail = user.email || '';
  const userLocation = user.location || 'Not Set';
  const userRole = user.role === 'official' ? 'Unverified Official' : 'Citizen';
  
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  
  // Calculate user's petition count
  const savedPetitions = JSON.parse(localStorage.getItem('civix_petitions')) || [];
  const myPetitionsCount = savedPetitions.filter(pet => pet.createdBy === userEmail).length;
  
  // Calculate user's poll count
  const savedPolls = JSON.parse(localStorage.getItem('civix_polls')) || [];
  const myPollsCount = savedPolls.filter(poll => poll.createdBy === userEmail).length;

  // Filter petitions for display
  const filteredPetitions = savedPetitions.filter(petition => {
    // Show only active petitions
    if (petition.status !== 'Active') return false;
    
    // Filter by category
    if (selectedCategory !== "All Categories" && petition.category !== selectedCategory) return false;
    
    return true;
  });

  return (
    <div className="dashboard-page">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M4 11.5L12 4l8 7.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7 10.5v8h10v-8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="brand-name">Civix</span>
          <span className="beta-pill">Beta</span>
        </div>

        <nav className="topnav">
          <a className="active" onClick={() => onNavigate("dashboard")}>
            Home
          </a>
          <a onClick={() => onNavigate("petitions")}>Petitions</a>
          <a onClick={() => onNavigate("polls")}>Polls</a>
          <a onClick={() => onNavigate("reports")}>Reports</a>
        </nav>

        <div className="top-actions">
          <button className="icon-btn" aria-label="Notifications">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M15 17H5l1.5-2V10a5.5 5.5 0 0111 0v5L19 17h-4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 19a2 2 0 004 0"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <div className="profile-dropdown">
            <div className="profile-trigger" onClick={() => setShowProfileMenu(!showProfileMenu)}>
              <div className="avatar">{userInitial}</div>
              <span className="user-name">{displayName}</span>
              <span className="chevron" aria-hidden="true">
                v
              </span>
            </div>
            
            {showProfileMenu && (
              <div className="profile-menu">
                <div className="profile-menu-header">
                  <div className="avatar lg">{userInitial}</div>
                  <div>
                    <div className="menu-user-name">{displayName}</div>
                    <div className="menu-user-email">{userEmail}</div>
                    <div className="menu-user-role">{userRole}</div>
                  </div>
                </div>
                <div className="profile-menu-divider"></div>
                <button className="profile-menu-item" onClick={() => { setShowProfileMenu(false); onNavigate("settings"); }}>
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 8.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" stroke="currentColor" strokeWidth="1.8"/>
                    <path d="M19 12a7 7 0 01-.2 1.6l2 1.6-2 3.4-2.3-.8a7 7 0 01-2.7 1.6l-.4 2.4H10l-.4-2.4a7 7 0 01-2.7-1.6l-2.3.8-2-3.4 2-1.6A7 7 0 014 12a7 7 0 01.2-1.6l-2-1.6 2-3.4 2.3.8a7 7 0 012.7-1.6L10 2h4l.4 2.4a7 7 0 012.7 1.6l2.3-.8 2 3.4-2 1.6c.1.5.2 1 .2 1.6z" stroke="currentColor" strokeWidth="1.8"/>
                  </svg>
                  Settings
                </button>
                <button className="profile-menu-item" onClick={() => { setShowProfileMenu(false); onNavigate("help"); }}>
                  <svg viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
                    <path d="M9.5 9.5a2.5 2.5 0 014 2c0 1.5-2 1.5-2 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    <circle cx="12" cy="17" r="1" fill="currentColor"/>
                  </svg>
                  Help & Support
                </button>
                <div className="profile-menu-divider"></div>
                <button className="profile-menu-item danger" onClick={() => { setShowProfileMenu(false); onLogout(); }}>
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    <path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <div className="profile-card">
            <div className="profile-top">
              <div className="avatar lg">{userInitial}</div>
              <div>
                <h4>{displayName}</h4>
                <p>{userRole}</p>
              </div>
            </div>
            <div className="profile-info">
              <div className="info-row">
                <span className="info-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 21s6-6.2 6-11a6 6 0 10-12 0c0 4.8 6 11 6 11z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                </span>
                <span>{userLocation}</span>
              </div>
              {userEmail && (
                <div className="info-row muted">
                  {userEmail}
                </div>
              )}
            </div>
          </div>

          <div className="menu">
            <button className="menu-item active" onClick={() => onNavigate("dashboard")}>
              <span className="menu-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 11.5L12 4l8 7.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 10.5v8h10v-8"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              Dashboard
            </button>
            <button className="menu-item" onClick={() => onNavigate("petitions")}>
              <span className="menu-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M5 8h8M5 12h8M5 16h6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              Petitions
            </button>
            <button className="menu-item" onClick={() => onNavigate("polls")}>
              <span className="menu-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12h4v7H5v-7zM10 5h4v14h-4V5zM15 9h4v10h-4V9z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                </svg>
              </span>
              Polls
            </button>
            <button className="menu-item" onClick={() => onNavigate("officials")}>
              <span className="menu-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M16 11a4 4 0 10-8 0"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M6 20a6 6 0 0112 0"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              Officials
            </button>
            <button className="menu-item" onClick={() => onNavigate("reports")}>
              <span className="menu-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 4h12v16H6z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M9 8h6M9 12h6M9 16h4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              Reports
            </button>
            <button className="menu-item" onClick={() => onNavigate("settings")}>
              <span className="menu-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 8.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M19 12a7 7 0 01-.2 1.6l2 1.6-2 3.4-2.3-.8a7 7 0 01-2.7 1.6l-.4 2.4H10l-.4-2.4a7 7 0 01-2.7-1.6l-2.3.8-2-3.4 2-1.6A7 7 0 014 12a7 7 0 01.2-1.6l-2-1.6 2-3.4 2.3.8a7 7 0 012.7-1.6L10 2h4l.4 2.4a7 7 0 012.7 1.6l2.3-.8 2 3.4-2 1.6c.1.5.2 1 .2 1.6z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              Settings
            </button>
          </div>

          <div className="help-card" onClick={() => onNavigate("help")}>
            <span className="menu-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                <path
                  d="M9.5 9.5a2.5 2.5 0 014 2c0 1.5-2 1.5-2 3"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="17" r="1" fill="currentColor" />
              </svg>
            </span>
            Help & Support
          </div>

          <button className="logout-btn" onClick={onLogout}>
            <span className="menu-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M16 17l5-5-5-5M21 12H9"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            Logout
          </button>
        </aside>

        <main className="content">
          <section className="welcome-card">
            <div>
              <h2>Welcome back, {displayName}!</h2>
              <p>
                See what&apos;s happening in your community and make your voice
                heard.
              </p>
            </div>
            <button className="btn-secondary" onClick={() => onNavigate("create-petition")}>
              + Create Petition
            </button>
          </section>

          <section className="stats-row">
            <div className="stat-card">
              <div className="stat-head">
                <h4>My Petitions</h4>
                <span className="stat-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 7h16v12H4z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M8 7l2-3h4l2 3"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
              <div className="stat-value">{myPetitionsCount}</div>
              <p>petitions</p>
            </div>
            <div className="stat-card">
              <div className="stat-head">
                <h4>Successful Petitions</h4>
                <span className="stat-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                    <path
                      d="M8 12l2.5 2.5L16 9"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
              <div className="stat-value">0</div>
              <p>or under review</p>
            </div>
            <div className="stat-card">
              <div className="stat-head">
                <h4>Polls Created</h4>
                <span className="stat-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M6 10h12v10H6z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M9 6l3 3 6-6"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
              <div className="stat-value">{myPollsCount}</div>
              <p>polls</p>
            </div>
          </section>

          <section className="section-head">
            <h3>Active Petitions Near You</h3>
            <div className="location-pill">
              <span>Showing for:</span>
              <div className="location-select">
                <span className="loc-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 21s6-6.2 6-11a6 6 0 10-12 0c0 4.8 6 11 6 11z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                </span>
                {userLocation}
                <span className="chevron" aria-hidden="true">
                  v
                </span>
              </div>
            </div>
          </section>

          <section className="chip-row">
            <button 
              className={`chip ${selectedCategory === "All Categories" ? "active" : ""}`}
              onClick={() => setSelectedCategory("All Categories")}
            >
              All Categories
            </button>
            <button 
              className={`chip ${selectedCategory === "Environment" ? "active" : ""}`}
              onClick={() => setSelectedCategory("Environment")}
            >
              Environment
            </button>
            <button 
              className={`chip ${selectedCategory === "Infrastructure" ? "active" : ""}`}
              onClick={() => setSelectedCategory("Infrastructure")}
            >
              Infrastructure
            </button>
            <button 
              className={`chip ${selectedCategory === "Education" ? "active" : ""}`}
              onClick={() => setSelectedCategory("Education")}
            >
              Education
            </button>
            <button 
              className={`chip ${selectedCategory === "Public Safety" ? "active" : ""}`}
              onClick={() => setSelectedCategory("Public Safety")}
            >
              Public Safety
            </button>
            <button 
              className={`chip ${selectedCategory === "Transportation" ? "active" : ""}`}
              onClick={() => setSelectedCategory("Transportation")}
            >
              Transportation
            </button>
            <button 
              className={`chip ${selectedCategory === "Healthcare" ? "active" : ""}`}
              onClick={() => setSelectedCategory("Healthcare")}
            >
              Healthcare
            </button>
            <button 
              className={`chip ${selectedCategory === "Housing" ? "active" : ""}`}
              onClick={() => setSelectedCategory("Housing")}
            >
              Housing
            </button>
          </section>

          {filteredPetitions.length === 0 ? (
            <section className="empty-state">
              <p>No petitions found with the current filters.</p>
              <button className="btn-outline" onClick={() => setSelectedCategory("All Categories")}>Clear Filters</button>
            </section>
          ) : (
            <section className="petitions-grid">
              {filteredPetitions.map((petition) => (
                <div key={petition.id} className="petition-card">
                  <div className="petition-status-bar"></div>
                  <div className="petition-time">{petition.createdAt}</div>
                  <h3>{petition.title}</h3>
                  <p className="petition-desc">{petition.category}</p>
                  <p className="petition-location">{petition.city}, {petition.state}</p>
                  <div className="petition-footer">
                    <div className="signature-info">
                      <span>{petition.signatures || 0} of {petition.goal} signatures</span>
                      <span className="status-badge">{petition.status}</span>
                    </div>
                    <button 
                      className="btn-view-details"
                      onClick={() => onNavigate("petitions")}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
