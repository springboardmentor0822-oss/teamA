import { useState, useEffect } from "react";
import Login from "./login";
import Dashboard from "./Dashboard";
import Petitions from "./Petitions";
import CreatePetition from "./CreatePetition";
import Polls from "./Polls";
import CreatePoll from "./CreatePoll";
import Reports from "./Reports";
import Settings from "./Settings";
import HelpSupport from "./HelpSupport";
import "./civic.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [currentPage, setCurrentPage] = useState("dashboard");

  // Check localStorage on app mount
  useEffect(() => {
    const savedUser = localStorage.getItem('civix_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setUserData(user);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error restoring user session:', error);
      }
    }

    // Apply dark mode if enabled
    const darkMode = localStorage.getItem('civix_darkMode') === 'true';
    if (darkMode) {
      document.body.classList.add('dark-mode');
    }
  }, []);

  const handleLogin = (data) => {
    setUserData(data);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUserData(null);
    setIsLoggedIn(false);
    setCurrentPage("dashboard");
    // Clear localStorage on logout
    localStorage.removeItem('civix_user');
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleUpdateUser = (updatedData) => {
    setUserData(updatedData);
  };

  return (
    <div>
      {isLoggedIn ? (
        <>
          {currentPage === "dashboard" && (
            <Dashboard userData={userData} onLogout={handleLogout} onNavigate={handleNavigate} />
          )}
          {currentPage === "petitions" && (
            <Petitions userData={userData} onLogout={handleLogout} onNavigate={handleNavigate} />
          )}
          {currentPage === "create-petition" && (
            <CreatePetition userData={userData} onNavigate={handleNavigate} />
          )}
          {currentPage === "polls" && (
            <Polls userData={userData} onLogout={handleLogout} onNavigate={handleNavigate} />
          )}
          {currentPage === "create-poll" && (
            <CreatePoll userData={userData} onLogout={handleLogout} onNavigate={handleNavigate} />
          )}
          {currentPage === "reports" && (
            <Reports userData={userData} onLogout={handleLogout} onNavigate={handleNavigate} />
          )}
          {currentPage === "settings" && (
            <Settings userData={userData} onLogout={handleLogout} onNavigate={handleNavigate} onUpdateUser={handleUpdateUser} />
          )}
          {currentPage === "help" && (
            <HelpSupport userData={userData} onLogout={handleLogout} onNavigate={handleNavigate} />
          )}
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
