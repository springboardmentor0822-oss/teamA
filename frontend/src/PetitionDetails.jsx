import "./civic.css";

const PetitionDetails = ({ petition, userData, onNavigate }) => {
  const user = userData || {};
  const displayName = user.name || 'User';
  const userInitial = displayName.charAt(0).toUpperCase();

  if (!petition) {
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
        </header>
        <main className="content">
          <p>Petition not found</p>
          <button onClick={() => onNavigate("petitions")}>Back to Petitions</button>
        </main>
      </div>
    );
  }

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
          <a onClick={() => onNavigate("petitions")} className="active">
            Petitions
          </a>
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
          <div className="avatar">{userInitial}</div>
          <span className="user-name">{displayName}</span>
          <span className="chevron" aria-hidden="true">v</span>
        </div>
      </header>

      <div className="layout">
        <main className="content petition-detail-container">
          <button className="btn-back" onClick={() => onNavigate("petitions")}>
            ← Back to Petitions
          </button>

          <section className="detail-card">
            <div className="detail-header">
              <h1>{petition.title}</h1>
              <span className="status-badge-lg">{petition.status}</span>
            </div>

            <div className="detail-meta">
              <div className="meta-item">
                <span className="meta-label">Category</span>
                <span className="meta-value">{petition.category}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Location</span>
                <span className="meta-value">{petition.city}, {petition.state}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Created</span>
                <span className="meta-value">{petition.createdAt}</span>
              </div>
            </div>

            <div className="detail-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${(petition.signatures / petition.goal) * 100}%` }}
                ></div>
              </div>
              <p className="progress-text">{petition.signatures} of {petition.goal} signatures</p>
            </div>

            <div className="detail-description">
              <h3>Description</h3>
              <p>{petition.description}</p>
            </div>

            <div className="detail-actions">
              <button className="btn-sign-petition">Sign This Petition</button>
              <button className="btn-share-petition">Share</button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default PetitionDetails;
