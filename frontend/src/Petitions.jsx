import { useState } from "react";
import "./civic.css";

const Petitions = ({ userData, onLogout, onNavigate }) => {
  const user = userData || {};
  const displayName = user.name || 'User';
  const userInitial = displayName.charAt(0).toUpperCase();
  const userEmail = user.email || '';
  const userLocation = user.location || 'Bangalore';
  const userRole = user.role === 'official' ? 'Unverified Official' : 'Citizen';

  const [activeTab, setActiveTab] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedPetition, setSelectedPetition] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [petitionsData, setPetitionsData] = useState(() => 
    JSON.parse(localStorage.getItem('civix_petitions')) || []
  );

  // Get petitions from state
  const petitions = petitionsData;

  const handleDeletePetition = (petitionId) => {
    if (window.confirm('Are you sure you want to delete this petition?')) {
      const updatedPetitions = petitionsData.filter(p => p.id !== petitionId);
      setPetitionsData(updatedPetitions);
      localStorage.setItem('civix_petitions', JSON.stringify(updatedPetitions));
      setSelectedPetition(null);
    }
  };

  const mockPetitions = [];
  const indianLocations = [
    "All Locations",
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Delhi",
    "Ladakh",
    "Jammu & Kashmir",
  ];

  const categories = [
    "All Categories",
    "Environment",
    "Infrastructure",
    "Education",
    "Public Safety",
    "Transportation",
    "Healthcare",
    "Housing",
    "Other",
  ];

  const filteredPetitions = petitions.filter((pet) => {
    // Filter by tab
    if (activeTab === "my" && pet.createdBy !== userEmail) return false;
    if (activeTab === "signed" && (!pet.signedBy || !pet.signedBy.includes(userEmail))) return false;
    
    // Filter by location
    if (selectedLocation !== "All Locations" && pet.location !== selectedLocation) return false;
    
    // Filter by category
    if (selectedCategory !== "All Categories" && pet.category !== selectedCategory) return false;
    
    // Filter by status
    if (selectedStatus !== "All Statuses" && pet.status !== selectedStatus) return false;
    
    return true;
  });

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
          <a className="active">Petitions</a>
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
              <div className="info-row muted">
                {userEmail}
              </div>
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
            <button className="menu-item active">
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
            <button className="menu-item">
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
          <section className="petition-header">
            <h1>Petitions</h1>
            <p>Browse, sign, and track petitions in your community.</p>
            <button className="btn-create" onClick={() => onNavigate("create-petition")}>
              + Create New Petition
            </button>
          </section>

          {/* Tabs */}
          <div className="petition-tabs">
            <button
              className={`petition-tab ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              All Petitions
            </button>
            <button
              className={`petition-tab ${activeTab === "my" ? "active" : ""}`}
              onClick={() => setActiveTab("my")}
            >
              My Petitions
            </button>
            <button
              className={`petition-tab ${activeTab === "signed" ? "active" : ""}`}
              onClick={() => setActiveTab("signed")}
            >
              Signed by Me
            </button>
          </div>

          {/* Filters */}
          <div className="petition-filters">
            <div className="filter-group">
              <svg className="filter-icon" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 21s6-6.2 6-11a6 6 0 10-12 0c0 4.8 6 11 6 11z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" />
              </svg>
              <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
                {indianLocations.map((location) => (
                  <option key={location}>{location}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <svg className="filter-icon" viewBox="0 0 24 24" fill="none">
                <path d="M3 4h18v2H3V4zm2 8h14v2H5v-2zm3 8h8v2H8v-2z" fill="currentColor" />
              </svg>
              <div className="dropdown-wrapper">
                <button
                  className="filter-btn"
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                >
                  {selectedCategory}
                </button>
                {showCategoryDropdown && (
                  <div className="dropdown-menu">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        className={`dropdown-item ${selectedCategory === cat ? "active" : ""}`}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setShowCategoryDropdown(false);
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="filter-group">
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                <option>All Statuses</option>
                <option>Active</option>
                <option>Under Review</option>
                <option>Closed</option>
              </select>
            </div>
          </div>

          {/* Petitions Grid */}
          <div className="petitions-grid">
            {filteredPetitions.map((petition) => (
              <div key={petition.id} className="petition-card">
                <div className="petition-status-bar"></div>
                <div className="petition-time">{petition.createdAt}</div>
                <h3>{petition.title}</h3>
                <p className="petition-desc">{petition.category}</p>
                <p className="petition-location">{petition.state || petition.location}</p>
                <div className="petition-footer">
                  <div className="signature-info">
                    <span>{petition.signatures} of {petition.goal} signatures</span>
                    <span className="status-badge">{petition.status}</span>
                  </div>
                  <button 
                    className="btn-view-details"
                    onClick={() => setSelectedPetition(petition)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <section className="petition-cta">
            <h2>Have an issue that needs attention?</h2>
            <button className="btn-create-large" onClick={() => onNavigate("create-petition")}>
              Create a New Petition
            </button>
          </section>
        </main>
      </div>

      {/* Petition Details Modal */}
      {selectedPetition && (
        <div className="modal-overlay" onClick={() => setSelectedPetition(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close"
              onClick={() => setSelectedPetition(null)}
            >
              ✕
            </button>

            <div className="modal-header">
              <h2>{selectedPetition.title}</h2>
              <span className="status-badge-modal">{selectedPetition.status}</span>
            </div>

            <div className="modal-meta">
              <div className="meta-item-modal">
                <span className="meta-label">Category</span>
                <span className="meta-value">{selectedPetition.category}</span>
              </div>
              <div className="meta-item-modal">
                <span className="meta-label">Location</span>
                <span className="meta-value">{selectedPetition.city}, {selectedPetition.state}</span>
              </div>
              <div className="meta-item-modal">
                <span className="meta-label">Created</span>
                <span className="meta-value">{selectedPetition.createdAt}</span>
              </div>
            </div>

            <div className="modal-progress">
              <div className="progress-bar-modal">
                <div 
                  className="progress-fill-modal" 
                  style={{ width: `${(selectedPetition.signatures / selectedPetition.goal) * 100}%` }}
                ></div>
              </div>
              <p className="progress-text-modal">{selectedPetition.signatures} of {selectedPetition.goal} signatures</p>
            </div>

            <div className="modal-description">
              <h3>Description</h3>
              <p>{selectedPetition.description}</p>
            </div>

            <div className="modal-actions">
              <button className="btn-sign-modal">Sign This Petition</button>
              <button className="btn-share-modal">Share</button>
              {selectedPetition.createdBy === userEmail && (
                <button 
                  className="btn-delete-modal"
                  onClick={() => handleDeletePetition(selectedPetition.id)}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Petitions;
