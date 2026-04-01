import { useState } from "react";
import "./civic.css";

const Officials = ({ userData, onLogout, onNavigate }) => {
  const user = userData || {};
  const displayName = user.name || "User";
  const userInitial = displayName.charAt(0).toUpperCase();
  const userEmail = user.email || "";
  const userLocation = user.location || "Your City";
  const userRole = user.role === "official" ? "Unverified Official" : "Citizen";

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const departments = [
    {
      name: "Environmental Department",
      scope: "Air quality, pollution control, waste management, sustainability",
      contact: "1800-11-8600",
      email: "support@cpcb.gov.in",
      website: "https://cpcb.nic.in/",
      grievance: "https://pgportal.gov.in/",
    },
    {
      name: "Infrastructure Department",
      scope: "Roads, public utilities, urban works and civic infrastructure",
      contact: "1800-11-3434",
      email: "info@morth.nic.in",
      website: "https://morth.nic.in/",
      grievance: "https://pgportal.gov.in/",
    },
    {
      name: "Education Department",
      scope: "Schools, higher education, skill development and literacy",
      contact: "1800-11-6969",
      email: "feedback@education.gov.in",
      website: "https://www.education.gov.in/",
      grievance: "https://pgportal.gov.in/",
    },
    {
      name: "Public Safety Department",
      scope: "Law & order, emergency response, disaster management support",
      contact: "112",
      email: "citizen@ndma.gov.in",
      website: "https://ndma.gov.in/",
      grievance: "https://pgportal.gov.in/",
    },
    {
      name: "Transportation Department",
      scope: "Public transport planning, traffic systems, mobility services",
      contact: "1800-11-0400",
      email: "helpdesk@transport.gov.in",
      website: "https://parivahan.gov.in/",
      grievance: "https://pgportal.gov.in/",
    },
    {
      name: "Healthcare Department",
      scope:
        "Public health services, hospitals, disease control, health schemes",
      contact: "1075",
      email: "helpdesk-nhm@gov.in",
      website: "https://www.mohfw.gov.in/",
      grievance: "https://pgportal.gov.in/",
    },
  ];

  const publicResources = [
    {
      title: "Centralized Public Grievance Portal",
      description:
        "File complaints and track resolution by ministry/department.",
      link: "https://pgportal.gov.in/",
    },
    {
      title: "MyGov India",
      description: "Participate in policy discussions and civic campaigns.",
      link: "https://www.mygov.in/",
    },
    {
      title: "Open Government Data Platform",
      description: "Access government datasets for insights and transparency.",
      link: "https://data.gov.in/",
    },
    {
      title: "National Portal of India",
      description:
        "Official directory of ministries, schemes, and citizen services.",
      link: "https://www.india.gov.in/",
    },
  ];

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
          <a onClick={() => onNavigate("dashboard")}>Home</a>
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
            <div
              className="profile-trigger"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
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
                <button
                  className="profile-menu-item"
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigate("settings");
                  }}
                >
                  Settings
                </button>
                <button
                  className="profile-menu-item"
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigate("help");
                  }}
                >
                  Help & Support
                </button>
                <div className="profile-menu-divider"></div>
                <button
                  className="profile-menu-item danger"
                  onClick={() => {
                    setShowProfileMenu(false);
                    onLogout();
                  }}
                >
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
                <span>{userLocation}</span>
              </div>
              {userEmail && <div className="info-row muted">{userEmail}</div>}
            </div>
          </div>

          <div className="menu">
            <button
              className="menu-item"
              onClick={() => onNavigate("dashboard")}
            >
              Dashboard
            </button>
            <button
              className="menu-item"
              onClick={() => onNavigate("petitions")}
            >
              Petitions
            </button>
            <button className="menu-item" onClick={() => onNavigate("polls")}>
              Polls
            </button>
            <button className="menu-item active">Officials</button>
            <button className="menu-item" onClick={() => onNavigate("reports")}>
              Reports
            </button>
            <button
              className="menu-item"
              onClick={() => onNavigate("settings")}
            >
              Settings
            </button>
          </div>

          <div className="help-card" onClick={() => onNavigate("help")}>
            Help & Support
          </div>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </aside>

        <main className="content">
          <section className="reports-header">
            <div>
              <h1>Government Officials & Departments</h1>
              <p>
                Find verified public department information, contacts, and
                official service portals for civic issues.
              </p>
            </div>
          </section>

          <section className="officials-section">
            <h2 className="officials-title">
              Government Departments Reviewing Petitions
            </h2>
            <div className="officials-grid">
              {departments.map((department) => (
                <article key={department.name} className="official-card">
                  <h3>{department.name}</h3>
                  <p>{department.scope}</p>
                  <div className="official-meta">
                    <span>
                      <strong>Contact:</strong> {department.contact}
                    </span>
                    <span>
                      <strong>Email:</strong> {department.email}
                    </span>
                  </div>
                  <div className="official-links">
                    <a
                      href={department.website}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Official Website
                    </a>
                    <a
                      href={department.grievance}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Grievance Portal
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="officials-section">
            <h2 className="officials-title">
              Public Service & Transparency Portals
            </h2>
            <div className="officials-grid">
              {publicResources.map((resource) => (
                <article key={resource.title} className="official-card">
                  <h3>{resource.title}</h3>
                  <p>{resource.description}</p>
                  <div className="official-links">
                    <a href={resource.link} target="_blank" rel="noreferrer">
                      Visit Public Site
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Officials;
