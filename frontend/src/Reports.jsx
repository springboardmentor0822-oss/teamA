import { useEffect, useState } from "react";
import "./civic.css";

const Reports = ({ userData, onLogout, onNavigate }) => {
  const user = userData || {};
  const displayName = user.name || 'User';
  const userInitial = displayName.charAt(0).toUpperCase();
  const userEmail = user.email || '';
  const userLocation = user.location || 'Your City';
  const userRole = user.role === 'official' ? 'Unverified Official' : 'Citizen';

  const [activeTab, setActiveTab] = useState("community");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const parseStoredArray = (key) => {
    try {
      const rawValue = localStorage.getItem(key);
      if (!rawValue) {
        return [];
      }
      const parsed = JSON.parse(rawValue);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const [petitionsData, setPetitionsData] = useState(() => parseStoredArray('civix_petitions'));
  const [pollsData, setPollsData] = useState(() => parseStoredArray('civix_polls'));

  useEffect(() => {
    const refreshData = () => {
      setPetitionsData(parseStoredArray('civix_petitions'));
      setPollsData(parseStoredArray('civix_polls'));
    };

    refreshData();
    const intervalId = window.setInterval(refreshData, 2000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  // Calculate stats
  const totalPetitions = petitionsData.length;
  const totalPolls = pollsData.length;
  const myPetitions = petitionsData.filter(p => p.createdBy === userEmail).length;
  const myPolls = pollsData.filter(p => p.createdBy === userEmail).length;
  const activeEngagement = totalPetitions + totalPolls;
  const myActiveEngagement = myPetitions + myPolls;

  const normalizeStatus = (status) => String(status || "").trim().toLowerCase();
  const isPollExpired = (closesOn) => {
    if (!closesOn) return false;
    const closeDate = new Date(`${closesOn}T23:59:59`);
    if (Number.isNaN(closeDate.getTime())) return false;
    return Date.now() > closeDate.getTime();
  };
  const getPetitionStatus = (petition) => {
    const status = normalizeStatus(petition.status);
    if (status === "closed") return "closed";
    if (status === "under review" || status === "under_review" || status === "under-review") return "under review";

    const signatures = Number(petition.signatures) || 0;
    const goal = Number(petition.goal) || 1;
    if (signatures >= goal) return "closed";

    return "active";
  };
  const getPollStatus = (poll) => {
    const status = normalizeStatus(poll.status);
    if (status === "closed" || isPollExpired(poll.closesOn)) {
      return "closed";
    }
    return "active";
  };

  // Petition breakdown
  const activePetitions = petitionsData.filter((petition) => getPetitionStatus(petition) === "active").length;
  const underReviewPetitions = petitionsData.filter((petition) => getPetitionStatus(petition) === "under review").length;
  const closedPetitions = petitionsData.filter((petition) => getPetitionStatus(petition) === "closed").length;

  // Poll breakdown
  const activePolls = pollsData.filter((poll) => getPollStatus(poll) === "active").length;
  const closedPolls = pollsData.filter((poll) => getPollStatus(poll) === "closed").length;

  return (
    <div className="dashboard-page">
      {/* Topbar */}
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
          <a onClick={() => onNavigate("dashboard")}>Home</a>
          <a onClick={() => onNavigate("petitions")}>Petitions</a>
          <a onClick={() => onNavigate("polls")}>Polls</a>
          <a className="active">Reports</a>
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
              <span className="chevron" aria-hidden="true">v</span>
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
        {/* Sidebar */}
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
            <button className="menu-item" onClick={() => onNavigate("dashboard")}>
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
            <button className="menu-item active">
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

        {/* Main Content */}
        <main className="content">
          <section className="reports-header">
            <div>
              <h1>Reports & Analytics</h1>
              <p>Track community engagement and activity metrics.</p>
            </div>
            <button className="btn-export">
              <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5-5 5 5M12 5v12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Export Data
            </button>
          </section>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon purple">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M4 7h16v12H4z" stroke="currentColor" strokeWidth="1.8"/>
                  <path d="M8 7l2-3h4l2 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-value">{activeTab === "community" ? totalPetitions : myPetitions}</div>
                <div className="stat-label">Total Petitions</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon pink">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h4v7H5v-7zM10 5h4v14h-4V5zM15 9h4v10h-4V9z" stroke="currentColor" strokeWidth="1.8"/>
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-value">{activeTab === "community" ? totalPolls : myPolls}</div>
                <div className="stat-label">Total Polls</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon cyan">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-value">{activeTab === "community" ? activeEngagement : myActiveEngagement}</div>
                <div className="stat-label">Active Engagement</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="reports-tabs">
            <button
              className={`reports-tab ${activeTab === "community" ? "active" : ""}`}
              onClick={() => setActiveTab("community")}
            >
              Community Overview
            </button>
            <button
              className={`reports-tab ${activeTab === "my" ? "active" : ""}`}
              onClick={() => setActiveTab("my")}
            >
              My Activity
            </button>
          </div>

          {/* Charts Grid */}
          <div className="charts-grid">
            {/* Petition Status Breakdown */}
            <div className="chart-card">
              <h3>Petition Status Breakdown</h3>
              <div className="chart-container">
                {totalPetitions === 0 || (activePetitions + underReviewPetitions + closedPetitions) === 0 ? (
                  <div className="empty-chart">
                    <p>No petitions available</p>
                  </div>
                ) : (
                  <div className="pie-chart">
                    <svg viewBox="0 0 200 200" className="pie-svg" width="200" height="200">
                      {(() => {
                        const total = activePetitions + underReviewPetitions + closedPetitions;
                        let currentAngle = 0;
                        const slices = [];
                        
                        const createSlice = (value, color, index) => {
                          if (value === 0) return null;
                          const percentage = value / total;
                          const angle = percentage * 360;
                          const startAngle = currentAngle;
                          const endAngle = currentAngle + angle;
                          
                          const startRad = (startAngle - 90) * Math.PI / 180;
                          const endRad = (endAngle - 90) * Math.PI / 180;
                          
                          const x1 = 100 + 80 * Math.cos(startRad);
                          const y1 = 100 + 80 * Math.sin(startRad);
                          const x2 = 100 + 80 * Math.cos(endRad);
                          const y2 = 100 + 80 * Math.sin(endRad);
                          
                          const largeArc = angle > 180 ? 1 : 0;
                          
                          const path = `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`;
                          
                          currentAngle = endAngle;
                          
                          return <path key={index} d={path} fill={color} stroke="none" strokeWidth="0" />;
                        };
                        
                        slices.push(createSlice(activePetitions, '#10b981', 0));
                        slices.push(createSlice(underReviewPetitions, '#f59e0b', 1));
                        slices.push(createSlice(closedPetitions, '#ef4444', 2));
                        
                        return slices;
                      })()}
                    </svg>
                  </div>
                )}
                <div className="chart-legend">
                  <div className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: '#10b981' }}></span>
                    <span>Active ({activePetitions})</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: '#f59e0b' }}></span>
                    <span>Under Review ({underReviewPetitions})</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: '#ef4444' }}></span>
                    <span>Closed ({closedPetitions})</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Poll Status Breakdown */}
            <div className="chart-card">
              <h3>Poll Status Breakdown</h3>
              <div className="chart-container">
                {totalPolls === 0 || (activePolls + closedPolls) === 0 ? (
                  <div className="empty-chart">
                    <p>No polls available</p>
                  </div>
                ) : (
                  <div className="pie-chart">
                    <svg viewBox="0 0 200 200" className="pie-svg" width="200" height="200">
                      {(() => {
                        const total = activePolls + closedPolls;
                        let currentAngle = 0;
                        const slices = [];
                        
                        const createSlice = (value, color, index) => {
                          if (value === 0) return null;
                          const percentage = value / total;
                          const angle = percentage * 360;
                          const startAngle = currentAngle;
                          const endAngle = currentAngle + angle;
                          
                          const startRad = (startAngle - 90) * Math.PI / 180;
                          const endRad = (endAngle - 90) * Math.PI / 180;
                          
                          const x1 = 100 + 80 * Math.cos(startRad);
                          const y1 = 100 + 80 * Math.sin(startRad);
                          const x2 = 100 + 80 * Math.cos(endRad);
                          const y2 = 100 + 80 * Math.sin(endRad);
                          
                          const largeArc = angle > 180 ? 1 : 0;
                          
                          const path = `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`;
                          
                          currentAngle = endAngle;
                          
                          return <path key={index} d={path} fill={color} stroke="none" strokeWidth="0" />;
                        };
                        
                        slices.push(createSlice(activePolls, '#06b6d4', 0));
                        slices.push(createSlice(closedPolls, '#64748b', 1));
                        
                        return slices;
                      })()}
                    </svg>
                  </div>
                )}
                <div className="chart-legend">
                  <div className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: '#06b6d4' }}></span>
                    <span>Active ({activePolls})</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: '#64748b' }}></span>
                    <span>Closed ({closedPolls})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reports;
