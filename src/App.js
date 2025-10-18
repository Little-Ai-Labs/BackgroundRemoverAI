import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import { useState, useEffect } from "react";
import BulkBgRemover from "./pages/BulkBgRemover";
import "./App.css";

function App() {
  const [mainContentWidth, setMainContentWidth] = useState("85%");

  const handleMainContentWidth = (isCollapsed) => {
    if (isCollapsed) {
      setMainContentWidth("100%");
    } else {
      setMainContentWidth("85%");
    }
  };

  useEffect(() => {
    // Function to check screen width
    const handleResize = () => {
      if (window.innerWidth <= 1700) {
        setMainContentWidth("100%");
      } else {
        setMainContentWidth("85%");
      }
    };
    // Initial check
    handleResize();
    // Add resize listener
    window.addEventListener("resize", handleResize);
    // Cleanup listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Sidebar sendCollapsedStateToApp={handleMainContentWidth} />
        <main
          className="main-content"
          style={{ width: mainContentWidth, backgroundColor: "black" }}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/bulk-bg-remover" element={<BulkBgRemover />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
