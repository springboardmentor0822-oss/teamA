import { useState, useEffect } from "react";
import Login from "./login";
import Dashboard from "./Dashboard";
import Petitions from "./Petitions";
import CreatePetition from "./CreatePetition";
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
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
