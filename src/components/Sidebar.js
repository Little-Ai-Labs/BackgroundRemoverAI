import { useEffect, useState } from "react";
import "./Sidebar.css";
import logo from "../assets/logo.png";
import { NavLink } from "react-router-dom";

const Sidebar = (props) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
    props.sendCollapsedStateToApp(!collapsed);
  };

  useEffect(() => {
    // Function to check screen width
    const handleResize = () => {
      if (window.innerWidth <= 1700) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
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
    <div
      className={
        collapsed ? "sidebar-container-collapsed" : "sidebar-container"
      }
    >
      <div className={collapsed ? "logo-section-collapsed" : "logo-section"}>
        <img id={collapsed ? "logo-collapsed" : "logo"} src={logo} />
        <p id={collapsed ? "app-title-collapsed" : "app-title"}>BG Remover</p>
        {collapsed == false && (
          <p id="collapse-icon" onClick={toggleSidebar}>
            &#60;
          </p>
        )}
      </div>
      {collapsed == true && (
        <p id="expand-icon" onClick={toggleSidebar}>
          &#62;
        </p>
      )}
      <div className={collapsed ? "nav-item-collapsed" : "nav-item"}>
        <NavLink
          to="/"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          style={{
            justifyContent: collapsed ? "center" : "flex-start",
          }}
        >
          <img id={collapsed ? "logo-collapsed" : "logo"} src={logo} />
          {!collapsed && <span>Explore</span>}
        </NavLink>
      </div>
      <div className={collapsed ? "nav-item-collapsed" : "nav-item"}>
        <NavLink
          to="/settings"
          className="nav-link"
          style={{
            justifyContent: collapsed ? "center" : "flex-start",
          }}
        >
          <img id={collapsed ? "logo-collapsed" : "logo"} src={logo} />
          {!collapsed && <span>Settings</span>}
        </NavLink>
      </div>
      <div className={collapsed ? "nav-item-collapsed" : "nav-item"}>
        <NavLink
          to="/profile"
          className="nav-link"
          style={{
            justifyContent: collapsed ? "center" : "flex-start",
          }}
        >
          <img id={collapsed ? "logo-collapsed" : "logo"} src={logo} />
          {!collapsed && <span>Profile</span>}
        </NavLink>
      </div>
      <div className={collapsed ? "nav-item-collapsed" : "nav-item"}>
        <NavLink
          to="/login"
          className="nav-link"
          style={{
            justifyContent: collapsed ? "center" : "flex-start",
          }}
        >
          <img id={collapsed ? "logo-collapsed" : "logo"} src={logo} />
          {!collapsed && <span>Login</span>}
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
