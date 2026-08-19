import "./sidebar.css";
import {
  LineStyle,
  Timeline,
  PermIdentity,
  WorkOutline,
  Report,
  CarRental,
  AdminPanelSettingsSharp,
  MapOutlined,
  MessageOutlined,
  Payments,
  LocalTaxi,
  CurrencyRupee,
  NotificationsActive,
} from '@mui/icons-material';
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Sidebar({ className, onMenuClick }) {
  const [activeMenu, setActiveMenu] = useState(localStorage.getItem("activeMenu"));

  const handleMenuClick = (path) => {
    localStorage.setItem("activeMenu", path);
    setActiveMenu(path);
    if (onMenuClick) onMenuClick();
  };

  return (
    <div className={className}>
      <div className="sidebarWrapper">

        <div className="sidebarMenu group-dashboard">
          <h3 className="sidebarTitle">Dashboard</h3>
          <ul className="sidebarList">
            <Link to="/" className="link">
              <li className={`sidebarListItem ${activeMenu === "home" ? "active" : ""}`} onClick={() => handleMenuClick("home")}>
                <span className="iconChip"><LineStyle className="sidebarIcon" /></span>
                Home
              </li>
            </Link>
            <li className={`sidebarListItem ${activeMenu === "analytics" ? "active" : ""}`} onClick={() => handleMenuClick("analytics")}>
              <span className="iconChip"><Timeline className="sidebarIcon" /></span>
              Analytics
            </li>
            <Link to="/profile" className="link">
              <li className={`sidebarListItem ${activeMenu === "profile" ? "active" : ""}`} onClick={() => handleMenuClick("profile")}>
                <span className="iconChip"><PermIdentity className="sidebarIcon" /></span>
                Profile
              </li>
            </Link>
          </ul>
        </div>

        <div className="sidebarMenu group-quick">
          <h3 className="sidebarTitle">Quick Menu</h3>
          <ul className="sidebarList">
            <Link to="/users" className="link">
              <li className={`sidebarListItem ${activeMenu === "users" ? "active" : ""}`} onClick={() => handleMenuClick("users")}>
                <span className="iconChip"><PermIdentity className="sidebarIcon" /></span>
                Users
              </li>
            </Link>
            <Link to="/approved-drivers" className="link">
              <li className={`sidebarListItem ${activeMenu === "approved-drivers" ? "active" : ""}`} onClick={() => handleMenuClick("approved-drivers")}>
                <span className="iconChip"><CarRental className="sidebarIcon" /></span>
                Approved Drivers
              </li>
            </Link>
            <Link to="/non-approved-drivers" className="link">
              <li className={`sidebarListItem ${activeMenu === "non-approved-drivers" ? "active" : ""}`} onClick={() => handleMenuClick("non-approved-drivers")}>
                <span className="iconChip"><CarRental className="sidebarIcon" /></span>
                Non-Approved
              </li>
            </Link>
            <Link to="/admins" className="link">
              <li className={`sidebarListItem ${activeMenu === "admins" ? "active" : ""}`} onClick={() => handleMenuClick("admins")}>
                <span className="iconChip"><AdminPanelSettingsSharp className="sidebarIcon" /></span>
                Admins
              </li>
            </Link>
            <Link to="/map" className="link">
              <li className={`sidebarListItem ${activeMenu === "maps" ? "active" : ""}`} onClick={() => handleMenuClick("maps")}>
                <span className="iconChip"><MapOutlined className="sidebarIcon" /></span>
                Maps
              </li>
            </Link>
            <Link to="/complaints" className="link">
              <li className={`sidebarListItem ${activeMenu === "complaints" ? "active" : ""}`} onClick={() => handleMenuClick("complaints")}>
                <span className="iconChip"><MessageOutlined className="sidebarIcon" /></span>
                Complaints
              </li>
            </Link>
          </ul>
        </div>

        <div className="sidebarMenu group-rides">
          <h3 className="sidebarTitle">Rides & Payments</h3>
          <ul className="sidebarList">
            <Link to="/transactions" className="link">
              <li className={`sidebarListItem ${activeMenu === "transactions" ? "active" : ""}`} onClick={() => handleMenuClick("transactions")}>
                <span className="iconChip"><Payments className="sidebarIcon" /></span>
                Transactions
              </li>
            </Link>
            <Link to="/rides" className="link">
              <li className={`sidebarListItem ${activeMenu === "rides" ? "active" : ""}`} onClick={() => handleMenuClick("rides")}>
                <span className="iconChip"><LocalTaxi className="sidebarIcon" /></span>
                Rides
              </li>
            </Link>
            <Link to="/fares" className="link">
              <li className={`sidebarListItem ${activeMenu === "fares" ? "active" : ""}`} onClick={() => handleMenuClick("fares")}>
                <span className="iconChip"><CurrencyRupee className="sidebarIcon" /></span>
                Fare Details
              </li>
            </Link>
            <Link to="/packages" className="link">
              <li className={`sidebarListItem ${activeMenu === "packages" ? "active" : ""}`} onClick={() => handleMenuClick("packages")}>
                <span className="iconChip"><LocalTaxi className="sidebarIcon" /></span>
                Packages
              </li>
            </Link>
          </ul>
        </div>

        <div className="sidebarMenu group-notifications">
          <h3 className="sidebarTitle">Communication</h3>

          <ul className="sidebarList">
            <Link to="/notifications" className="link">
              <li
                className={`sidebarListItem ${activeMenu === "notifications" ? "active" : ""
                  }`}
                onClick={() => handleMenuClick("notifications")}
              >
                <span className="iconChip">
                  <NotificationsActive className="sidebarIcon" />
                </span>
                Notifications
              </li>
            </Link>
          </ul>
        </div>

      </div>
    </div>
  );
}