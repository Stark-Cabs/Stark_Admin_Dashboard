import React, { useContext } from "react";
import "./topbar.css";
import { NotificationsNoneOutlined, Menu, Close, KeyboardArrowDown } from "@mui/icons-material";
import { AuthContext } from "../../context/authContext/AuthContext";
import { logout } from "../../context/authContext/apiCalls";
import { Link } from "react-router-dom";

export default function Topbar({ sidebarOpen, onToggleSidebar }) {
  const { user } = useContext(AuthContext);

  const handleLogout = async () => {
    logout(user);
  };

  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          {sidebarOpen ? (
            <Close className="hamburgerMenu" onClick={onToggleSidebar} />
          ) : (
            <Menu className="hamburgerMenu" onClick={onToggleSidebar} />
          )}
          <Link to="/" className="logoLink">
            <img
              src="/assets/images/logo/TextOnlyDark.png"
              alt="Stark Cabs"
              className="logoImg"
            />
          </Link>
        </div>

        <div className="topRight">
          {/* <div className="topbarIconContainer">
            <NotificationsNoneOutlined />
            <span className="topIconBadge">2</span>
          </div> */}

          <div className="profileMenu">
            <img
              src={
                user?.profilePic ||
                "/assets/images/logo/IconOnly.png"
              }
              alt="profile"
              className="topAvatar"
            />
            <span className="profileName">{user?.name || "Admin"}</span>
            <KeyboardArrowDown className="profileCaret" />

            <div className="options">
              <Link className="optionLink" to="/profile">Profile</Link>
              <span className="optionLink" onClick={handleLogout}>Logout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}