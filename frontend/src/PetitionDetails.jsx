import { useState } from "react";
import "./civic.css";

const PetitionDetails = ({ petition, userData, onNavigate }) => {
  const user = userData || {};
  const displayName = user.name || 'User';
  const userInitial = displayName.charAt(0).toUpperCase();
  const userEmail = user.email || '';

  const [successMessage, setSuccessMessage] = useState('');
  const [currentPetition, setCurrentPetition] = useState(petition);

  const handleSign = () => {
    if (!currentPetition) return;

    // Get petitions from localStorage
    const petitions = JSON.parse(localStorage.getItem('civix_petitions')) || [];
    const petitionIndex = petitions.findIndex(p => p.id === currentPetition.id);
    
    if (petitionIndex === -1) {
      setSuccessMessage('Petition not found');
      setTimeout(() => setSuccessMessage(''), 3000);
      return;
    }

    const targetPetition = petitions[petitionIndex];
    
    // Initialize signatures array if it doesn't exist
    if (!targetPetition.signatures) {
      targetPetition.signatures = 0;
    }
    if (!targetPetition.signedBy) {
      targetPetition.signedBy = [];
    }

    // Check if user already signed
    if (targetPetition.signedBy.includes(userEmail)) {
      setSuccessMessage('You have already signed this petition');
      setTimeout(() => setSuccessMessage(''), 3000);
      return;
    }

    // Add signature
    targetPetition.signedBy.push(userEmail);
    targetPetition.signatures += 1;

    // Check if goal reached and auto-close
    if (targetPetition.signatures >= targetPetition.goal) {
      targetPetition.status = 'Closed';
      setSuccessMessage('🎉 Petition signed successfully! Goal reached - petition is now closed.');
    } else {
      setSuccessMessage('✓ Petition signed successfully!');
    }

    // Save to localStorage
    petitions[petitionIndex] = targetPetition;
    localStorage.setItem('civix_petitions', JSON.stringify(petitions));

    // Update local state
    setCurrentPetition(targetPetition);

    // Clear message after 4 seconds
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const handleShare = () => {
    const url = `${window.location.origin}/petition/${currentPetition.id}`;
    
    // Try to use modern clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url)
        .then(() => {
          setSuccessMessage('✓ Link copied to clipboard!');
          setTimeout(() => setSuccessMessage(''), 3000);
        })
        .catch(() => {
          // Fallback
          fallbackCopyToClipboard(url);
        });
    } else {
      fallbackCopyToClipboard(url);
    }
  };

  const fallbackCopyToClipboard = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setSuccessMessage('✓ Link copied to clipboard!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setSuccessMessage('Failed to copy link');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
    document.body.removeChild(textArea);
  };

  // Use currentPetition instead of petition throughout
  const displayPetition = currentPetition || petition;

  if (!displayPetition) {
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

          {successMessage && (
            <div className="success-message-banner">
              {successMessage}
            </div>
          )}

          <section className="detail-card">
            <div className="detail-header">
              <h1>{displayPetition.title}</h1>
              <span className="status-badge-lg">{displayPetition.status}</span>
            </div>

            <div className="detail-meta">
              <div className="meta-item">
                <span className="meta-label">Category</span>
                <span className="meta-value">{displayPetition.category}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Location</span>
                <span className="meta-value">{displayPetition.city}, {displayPetition.state}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Created</span>
                <span className="meta-value">{displayPetition.createdAt}</span>
              </div>
            </div>

            <div className="detail-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${(displayPetition.signatures / displayPetition.goal) * 100}%` }}
                ></div>
              </div>
              <p className="progress-text">{displayPetition.signatures} of {displayPetition.goal} signatures</p>
            </div>

            <div className="detail-description">
              <h3>Description</h3>
              <p>{displayPetition.description}</p>
            </div>

            <div className="detail-actions">
              <button 
                className="btn-sign-petition" 
                onClick={handleSign}
                disabled={displayPetition.signedBy && displayPetition.signedBy.includes(userEmail)}
              >
                {displayPetition.signedBy && displayPetition.signedBy.includes(userEmail) ? 'Already Signed' : 'Sign This Petition'}
              </button>
              <button className="btn-share-petition" onClick={handleShare}>Share</button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default PetitionDetails;
