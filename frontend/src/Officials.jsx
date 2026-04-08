import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { notifyError, notifySuccess } from "./notify";
import "./civic.css";

const API_BASE_URL = "http://localhost:5000/api";

const Officials = ({ userData, onLogout, onNavigate, onUpdateUser }) => {
  const user = userData || {};
  const displayName = user.name || "User";
  const userInitial = displayName.charAt(0).toUpperCase();
  const userEmail = user.email || "";
  const userLocation = user.location || "Your City";
  const isOfficialUser = ["official", "admin"].includes(user.role);

  const [activePetitionTab, setActivePetitionTab] = useState("pending");
  const [responseNotes, setResponseNotes] = useState({});
  const [issueNotes, setIssueNotes] = useState({});
  const [pollRegionFilter, setPollRegionFilter] = useState("all");
  const [pollCategoryFilter, setPollCategoryFilter] = useState("all");
  const [officialUpdateText, setOfficialUpdateText] = useState("");
  const [officialUpdates, setOfficialUpdates] = useState([]);
  const [monthlyLogs, setMonthlyLogs] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${now.getFullYear()}-${month}`;
  });
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("civix_darkMode") === "true",
  );
  const [petitions, setPetitions] = useState([]);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDarkModeToggle = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("civix_darkMode", String(next));
    if (next) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  };

  const fetchOfficialData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const [petitionsRes, pollsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/petitions/official/locality`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE_URL}/polls/official/locality`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setPetitions(Array.isArray(petitionsRes.data) ? petitionsRes.data : []);
      setPolls(Array.isArray(pollsRes.data) ? pollsRes.data : []);
    } catch (error) {
      notifyError(error.response?.data?.message || "Failed to load official dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyLogs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API_BASE_URL}/official/logs/monthly?month=${selectedMonth}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setMonthlyLogs(Array.isArray(res.data?.logs) ? res.data.logs : []);
    } catch {
      setMonthlyLogs([]);
    }
  };

  useEffect(() => {
    if (!isOfficialUser) return;
    fetchOfficialData();
  }, [isOfficialUser]);



  useEffect(() => {
    if (!isOfficialUser) return;
    fetchMonthlyLogs();
  }, [isOfficialUser, selectedMonth]);

  const normalizeStatus = (status) => String(status || "").trim().toLowerCase();

  const petitionStats = useMemo(() => {
    const pending = petitions.filter((p) => normalizeStatus(p.status) === "active").length;
    const underReview = petitions.filter((p) => normalizeStatus(p.status) === "under_review").length;
    const approved = petitions.filter((p) => normalizeStatus(p.status) === "resolved").length;
    const rejected = petitions.filter((p) => normalizeStatus(p.status) === "closed").length;
    const highPriority = petitions.filter((p) => (p.signatureCount || 0) >= 50 && normalizeStatus(p.status) !== "resolved").length;

    return {
      pending,
      underReview,
      approved,
      rejected,
      highPriority,
      activeIssues: pending + underReview,
    };
  }, [petitions]);

  const petitionTabs = useMemo(
    () => ({
      pending: petitions.filter((p) => normalizeStatus(p.status) === "active"),
      under_review: petitions.filter((p) => normalizeStatus(p.status) === "under_review"),
      approved: petitions.filter((p) => normalizeStatus(p.status) === "resolved"),
      rejected: petitions.filter((p) => normalizeStatus(p.status) === "closed"),
    }),
    [petitions],
  );

  const issueReports = useMemo(
    () => petitions.map((p) => ({
      id: p._id,
      title: p.title,
      location: p.location,
      evidence: p.description || "No evidence attached",
      status: normalizeStatus(p.status) === "resolved"
        ? "resolved"
        : normalizeStatus(p.status) === "under_review"
          ? "in_progress"
          : "open",
      signatures: p.signatureCount || 0,
    })),
    [petitions],
  );

  const pollCategoryFromText = (poll) => {
    const text = `${poll.question || ""} ${poll.description || ""}`.toLowerCase();
    if (text.includes("water") || text.includes("pollution") || text.includes("waste")) return "Environment";
    if (text.includes("road") || text.includes("transport") || text.includes("traffic")) return "Infrastructure";
    if (text.includes("school") || text.includes("education")) return "Education";
    if (text.includes("hospital") || text.includes("health")) return "Healthcare";
    return "General";
  };

  const pollRegions = useMemo(() => {
    const unique = [...new Set(polls.map((p) => p.state).filter(Boolean))];
    return ["all", ...unique];
  }, [polls]);

  const pollCategories = useMemo(() => {
    const unique = [...new Set(polls.map((p) => pollCategoryFromText(p)))];
    return ["all", ...unique];
  }, [polls]);

  const filteredPolls = useMemo(
    () => polls.filter((poll) => {
      if (pollRegionFilter !== "all" && poll.state !== pollRegionFilter) return false;
      if (pollCategoryFilter !== "all" && pollCategoryFromText(poll) !== pollCategoryFilter) return false;
      return true;
    }),
    [polls, pollRegionFilter, pollCategoryFilter],
  );

  const totalPollVotes = (poll) =>
    Array.isArray(poll.options)
      ? poll.options.reduce((sum, option) => sum + (Number(option?.votes) || 0), 0)
      : 0;

  const petitionSuccessRate = petitions.length
    ? Math.round((petitionStats.approved / petitions.length) * 100)
    : 0;

  const engagementMetric = petitions.reduce((sum, p) => sum + (p.signatureCount || 0), 0)
    + filteredPolls.reduce((sum, poll) => sum + totalPollVotes(poll), 0);

  const exportCsv = (filename, rows) => {
    const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleExportPetitions = () => {
    const rows = [
      ["Title", "Location", "Status", "Signatures", "Created At"],
      ...petitions.map((p) => [p.title, p.location, p.status, p.signatureCount || 0, p.createdAt]),
    ];
    exportCsv("official-petitions.csv", rows);
  };

  const handleExportReports = () => {
    const rows = [
      ["Issue", "Location", "Status", "Signatures", "Evidence"],
      ...issueReports.map((r) => [r.title, r.location, r.status, r.signatures, r.evidence]),
    ];
    exportCsv("official-issue-reports.csv", rows);
  };

  const handleExportPolls = () => {
    const rows = [
      ["Question", "Region", "Category", "Total Votes", "Status"],
      ...filteredPolls.map((p) => [p.question, p.state, pollCategoryFromText(p), totalPollVotes(p), p.status]),
    ];
    exportCsv("official-poll-insights.csv", rows);
  };

  const handleModerationAction = async (petitionId, status) => {
    try {
      const token = localStorage.getItem("token");
      const comment = responseNotes[petitionId] || "";

      await axios.post(
        `${API_BASE_URL}/petitions/official/respond/${petitionId}`,
        { comment, status },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      notifySuccess("Petition updated successfully");
      setResponseNotes((prev) => ({ ...prev, [petitionId]: "" }));
      fetchOfficialData();
      fetchMonthlyLogs();
    } catch (error) {
      notifyError(error.response?.data?.message || "Unable to update petition");
    }
  };

  const handleIssueStatusUpdate = async (issueId, status) => {
    try {
      const token = localStorage.getItem("token");
      const statusMap = {
        open: "active",
        in_progress: "under_review",
        resolved: "resolved",
      };

      await axios.post(
        `${API_BASE_URL}/petitions/official/respond/${issueId}`,
        { comment: issueNotes[issueId] || "", status: statusMap[status] },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      notifySuccess("Issue report updated");
      fetchOfficialData();
      fetchMonthlyLogs();
    } catch (error) {
      notifyError(error.response?.data?.message || "Failed to update issue report");
    }
  };

  const handlePostOfficialUpdate = () => {
    const value = officialUpdateText.trim();
    if (!value) {
      notifyError("Please write an official update first");
      return;
    }

    setOfficialUpdates((prev) => [
      {
        id: Date.now(),
        message: value,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    setOfficialUpdateText("");
    notifySuccess("Official update posted");
  };

  if (!isOfficialUser) {
    return (
      <div className="official-admin-wrap">
        <div className="official-admin-shell">
          <h2>Official Access Only</h2>
          <p>This workspace is available only to verified public officials.</p>
          <button className="official-logout-btn" onClick={() => onNavigate("dashboard")}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="official-admin-wrap">
      <header className="official-admin-top">
        <div className="official-admin-brand">
          <span className="official-admin-logo">Civix</span>
          <span className="official-admin-badge">Official Command Center</span>
        </div>
        <div className="official-admin-top-right">
          <div className="official-profile-mini">
            <span className="official-avatar">{userInitial}</span>
            <div>
              <strong>{displayName}</strong>
              <p>{userEmail}</p>
            </div>
          </div>
          <button className="official-logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </header>

      <div className="official-admin-shell">
        <aside className="official-admin-sidebar">
          <h3>Official Policy</h3>
          <ul>
            <li>Officials cannot create polls by default.</li>
            <li>Officials cannot sign petitions.</li>
            <li>Officials can only moderate and respond.</li>
            <li>All actions are logged for monthly reports.</li>
          </ul>

          <div className="official-verify-card">
            <h4>Profile & Verification</h4>
            <p><strong>Badge:</strong> Verified Official</p>
            <p><strong>Jurisdiction:</strong> {userLocation}</p>
            <p><strong>Department:</strong> Civic Administration</p>
          </div>

          <button className="official-settings-btn" onClick={() => onNavigate("settingsOfficials")}>Settings</button>
        </aside>

        <main className="official-admin-main">
          <section className="official-section">
            <div className="official-section-head">
              <h2>Dashboard Overview</h2>
              {loading && <span>Loading data...</span>}
            </div>
            <div className="official-stats-grid">
              <article className="official-stat-card"><h4>Pending</h4><strong>{petitionStats.pending}</strong></article>
              <article className="official-stat-card"><h4>Approved</h4><strong>{petitionStats.approved}</strong></article>
              <article className="official-stat-card"><h4>Rejected</h4><strong>{petitionStats.rejected}</strong></article>
              <article className="official-stat-card"><h4>Active Issues</h4><strong>{petitionStats.activeIssues}</strong></article>
            </div>
            <div className="official-alerts-box">
              <h4>High-Priority Alerts</h4>
              {petitionStats.highPriority === 0 ? (
                <p>No high-priority petitions currently.</p>
              ) : (
                <p>{petitionStats.highPriority} high-priority petitions need immediate moderation.</p>
              )}
            </div>
          </section>

          <section className="official-section">
            <div className="official-section-head">
              <h2>Petition Management</h2>
              <p>Moderation, status decisions, and official responses</p>
            </div>

            <div className="official-tabs">
              <button className={activePetitionTab === "pending" ? "active" : ""} onClick={() => setActivePetitionTab("pending")}>Pending Review</button>
              <button className={activePetitionTab === "under_review" ? "active" : ""} onClick={() => setActivePetitionTab("under_review")}>Under Review</button>
              <button className={activePetitionTab === "approved" ? "active" : ""} onClick={() => setActivePetitionTab("approved")}>Approved</button>
              <button className={activePetitionTab === "rejected" ? "active" : ""} onClick={() => setActivePetitionTab("rejected")}>Rejected</button>
            </div>

            <div className="official-list">
              {(petitionTabs[activePetitionTab] || []).map((petition) => (
                <article key={petition._id} className="official-list-card">
                  <div className="official-list-top">
                    <h4>{petition.title}</h4>
                    <span>{petition.location}</span>
                  </div>
                  <p>{petition.description}</p>
                  <div className="official-chip-row">
                    <span>Signatures: {petition.signatureCount || 0}</span>
                    <span>Status: {petition.status}</span>
                  </div>

                  <textarea
                    placeholder="Add official response"
                    value={responseNotes[petition._id] || ""}
                    onChange={(e) => setResponseNotes((prev) => ({ ...prev, [petition._id]: e.target.value }))}
                  />

                  <div className="official-actions-row">
                    <button onClick={() => handleModerationAction(petition._id, "under_review")}>Mark Under Review</button>
                    <button onClick={() => handleModerationAction(petition._id, "resolved")}>Approve</button>
                    <button className="danger" onClick={() => handleModerationAction(petition._id, "closed")}>Reject</button>
                  </div>
                </article>
              ))}
              {(petitionTabs[activePetitionTab] || []).length === 0 && <p>No petitions in this tab.</p>}
            </div>
          </section>

          <section className="official-section">
            <div className="official-section-head">
              <h2>Issue Reports</h2>
              <p>Citizen-submitted incidents with location and evidence</p>
            </div>

            <div className="official-list">
              {issueReports.map((issue) => (
                <article key={issue.id} className="official-list-card">
                  <div className="official-list-top">
                    <h4>{issue.title}</h4>
                    <span>{issue.location}</span>
                  </div>
                  <p><strong>Evidence:</strong> {issue.evidence}</p>
                  <div className="official-chip-row">
                    <span>Current Status: {issue.status}</span>
                    <span>Support: {issue.signatures}</span>
                  </div>

                  <textarea
                    placeholder="Resolution notes"
                    value={issueNotes[issue.id] || ""}
                    onChange={(e) => setIssueNotes((prev) => ({ ...prev, [issue.id]: e.target.value }))}
                  />

                  <div className="official-actions-row">
                    <button onClick={() => handleIssueStatusUpdate(issue.id, "open")}>Open</button>
                    <button onClick={() => handleIssueStatusUpdate(issue.id, "in_progress")}>In Progress</button>
                    <button onClick={() => handleIssueStatusUpdate(issue.id, "resolved")}>Resolved</button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="official-section">
            <div className="official-section-head">
              <h2>Public Communication</h2>
              <p>Official updates, clarifications, and response threads</p>
            </div>
            <div className="official-comm-grid">
              <article className="official-panel">
                <h4>Post Official Update</h4>
                <textarea
                  placeholder="Write an official announcement or clarification"
                  value={officialUpdateText}
                  onChange={(e) => setOfficialUpdateText(e.target.value)}
                />
                <button onClick={handlePostOfficialUpdate}>Post Update</button>
              </article>

              <article className="official-panel">
                <h4>Recent Updates</h4>
                {officialUpdates.length === 0 && <p>No official updates posted yet.</p>}
                {officialUpdates.map((update) => (
                  <div key={update.id} className="official-update-item">
                    <p>{update.message}</p>
                    <span>{new Date(update.createdAt).toLocaleString()}</span>
                  </div>
                ))}
              </article>

              <article className="official-panel">
                <h4>FAQ / Clarification Threads</h4>
                <ul className="official-faq-list">
                  <li>Why is this petition under review? Pending legal and budget checks.</li>
                  <li>When does status change to approved? After field validation and department sign-off.</li>
                  <li>Can citizens escalate? Yes, through Help & Support with petition ID.</li>
                </ul>
              </article>
            </div>
          </section>

          <section className="official-section">
            <div className="official-section-head">
              <h2>Poll Insights</h2>
              <p>Regional trends and decision support (officials cannot create polls here)</p>
            </div>

            <div className="official-filter-row">
              <label>
                Region
                <select value={pollRegionFilter} onChange={(e) => setPollRegionFilter(e.target.value)}>
                  {pollRegions.map((region) => (
                    <option key={region} value={region}>{region === "all" ? "All Regions" : region}</option>
                  ))}
                </select>
              </label>
              <label>
                Category
                <select value={pollCategoryFilter} onChange={(e) => setPollCategoryFilter(e.target.value)}>
                  {pollCategories.map((category) => (
                    <option key={category} value={category}>{category === "all" ? "All Categories" : category}</option>
                  ))}
                </select>
              </label>
              <button onClick={handleExportPolls}>Export Poll Data</button>
            </div>

            <div className="official-list">
              {filteredPolls.map((poll) => (
                <article key={poll._id} className="official-list-card">
                  <div className="official-list-top">
                    <h4>{poll.question}</h4>
                    <span>{poll.state}</span>
                  </div>
                  <p>{poll.description}</p>
                  <div className="official-chip-row">
                    <span>Category: {pollCategoryFromText(poll)}</span>
                    <span>Total Votes: {totalPollVotes(poll)}</span>
                    <span>Status: {poll.status}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="official-section">
            <div className="official-section-head">
              <h2>Analytics & Reports</h2>
              <p>Engagement metrics and petition outcomes</p>
            </div>
            <div className="official-stats-grid">
              <article className="official-stat-card"><h4>Engagement Score</h4><strong>{engagementMetric}</strong></article>
              <article className="official-stat-card"><h4>Petition Success Rate</h4><strong>{petitionSuccessRate}%</strong></article>
              <article className="official-stat-card"><h4>Monthly Official Logs</h4><strong>{monthlyLogs.length}</strong></article>
            </div>

            <div className="official-filter-row">
              <label>
                Report Month
                <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} />
              </label>
            </div>

            <div className="official-log-list">
              {monthlyLogs.length === 0 && <p>No logs available for this month.</p>}
              {monthlyLogs.map((log) => (
                <div key={log._id} className="official-log-item">
                  <p>{log.action}</p>
                  <span>{new Date(log.timestamp).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </section>



          <section className="official-section">
            <div className="official-section-head">
              <h2>Download Center</h2>
              <p>Export petitions, issue reports, and poll insights</p>
            </div>
            <div className="official-download-grid">
              <button onClick={handleExportPetitions}>Export Petitions CSV</button>
              <button onClick={handleExportReports}>Export Issue Reports CSV</button>
              <button onClick={handleExportPolls}>Export Poll Insights CSV</button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Officials;
