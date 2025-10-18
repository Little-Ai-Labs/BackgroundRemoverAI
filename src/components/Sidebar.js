import { useEffect, useState } from "react";
import "./Sidebar.css";
import logo from "../assets/logo.png";
import removeBgIcon from "../assets/remove-bg-icon.png";
import removeBgNavIcon from "../assets/remove-bg-nav-icon.png";
import bulkBgRemoveIcon from "../assets/bulk-bg-remove-icon.png";
import videoBgRemoverIcon from "../assets/video-bg-remover-icon.png";
import pricingIcon from "../assets/pricing-icon.png";
import creditsIcon from "../assets/credits-icon.png";
import inviteFriendsImg from "../assets/invite-friends-img.png";
import userProfileIcon from "../assets/user-profile-icon.png";
import settingsIcon from "../assets/settings-icon.png";
import sidebarCollapseIcon from "../assets/sidebar-collapse-icon.png";
import loginIcon from "../assets/login-icon.png";
import { NavLink } from "react-router-dom";
import { BiColor } from "react-icons/bi";

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
        <img
          id={collapsed ? "app-logo-collapsed" : "app-logo"}
          src={removeBgIcon}
        />
        <div className="logo-title-container">
          <p className={collapsed ? "app-title-collapsed" : "app-title"}>
            removebg
          </p>
          <p
            className={
              collapsed
                ? "app-title-collapsed"
                : "app-title app-title-extension"
            }
          >
            .world
          </p>
        </div>

        {collapsed == false && (
          <img
            src={sidebarCollapseIcon}
            id="collapse-icon"
            onClick={toggleSidebar}
          />
        )}
      </div>
      {collapsed == true && (
        <img
          src={sidebarCollapseIcon}
          id="expand-icon"
          onClick={toggleSidebar}
        />
      )}
      <div className={collapsed ? "nav-item-collapsed" : "nav-item"}>
        <NavLink
          to="/"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          style={{
            justifyContent: collapsed ? "center" : "flex-start",
          }}
        >
          <img
            id={collapsed ? "logo-collapsed" : "logo"}
            src={removeBgNavIcon}
          />
          {!collapsed && <span>Remove BG</span>}
        </NavLink>
      </div>
      <div className={collapsed ? "nav-item-collapsed" : "nav-item"}>
        <NavLink
          to="/bulk-bg-remover"
          className="nav-link"
          style={{
            justifyContent: collapsed ? "center" : "flex-start",
          }}
        >
          <img
            id={collapsed ? "logo-collapsed" : "logo"}
            src={bulkBgRemoveIcon}
          />
          {!collapsed && <span>Bulk BG Remove</span>}
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
          <img
            id={collapsed ? "logo-collapsed" : "logo"}
            src={videoBgRemoverIcon}
          />
          {!collapsed && <span>Video BG Remover</span>}
        </NavLink>
      </div>
      <hr className="divider" />
      {!collapsed && <p className="sidebar-headings">SUBSCRIPTION</p>}
      <div className={collapsed ? "nav-item-collapsed" : "nav-item"}>
        <NavLink
          to="/profile"
          className="nav-link"
          style={{
            justifyContent: collapsed ? "center" : "flex-start",
          }}
        >
          <img id={collapsed ? "logo-collapsed" : "logo"} src={pricingIcon} />
          {!collapsed && <span>Pricing</span>}
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
          <img id={collapsed ? "logo-collapsed" : "logo"} src={creditsIcon} />
          {!collapsed && <span>Credits</span>}
        </NavLink>
      </div>
      <hr className="divider" />
      <div className={collapsed ? "nav-item-collapsed" : "nav-item"}>
        <NavLink
          to="/login"
          className="nav-link"
          style={{
            justifyContent: collapsed ? "center" : "flex-start",
          }}
        >
          <img id={collapsed ? "logo-collapsed" : "logo"} src={loginIcon} />
          {!collapsed && <span>Login</span>}
        </NavLink>
      </div>

      <div className="sidebar-footer">
        {!collapsed && <img id="invite-friends-img" src={inviteFriendsImg} />}
        <div className="user-profile-section">
          {!collapsed && <img id="user-profile-icon" src={userProfileIcon} />}
          {!collapsed && <p>Naveen Kumar</p>}
          <img
            id={collapsed ? "settings-icon-collapsed" : "settings-icon"}
            src={settingsIcon}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
