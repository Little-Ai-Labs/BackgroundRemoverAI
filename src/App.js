import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import AccountModal from "./components/AccountModal";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Editor from "./pages/Editor";
import { useState, useEffect } from "react";
import BulkBgRemover from "./pages/BulkBgRemover";
import "./App.css";

function App() {
  const [mainContentWidth, setMainContentWidth] = useState("85%");
  const [accountModalOpen, setAccountModalOpen] = useState(false);

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
        <Sidebar
          sendCollapsedStateToApp={handleMainContentWidth}
          onOpenAccountModal={(val) => setAccountModalOpen(!!val)}
        />
        <AccountModal open={accountModalOpen} onClose={() => setAccountModalOpen(false)} />
        <main
          className="main-content"
          style={{ width: mainContentWidth, backgroundColor: "black" }}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/bulk-bg-remover" element={<BulkBgRemover />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
