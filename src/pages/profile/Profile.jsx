import React, { useContext } from "react";
import { AuthContext } from "../../context/authContext/AuthContext";
import "./profile.css";
import {
    Email,
    Phone,
    LocationCity,
    Public,
    Lock,
    CalendarToday,
    Badge,
    Home,
    AssignmentInd,
    ExitToApp,
} from "@mui/icons-material";
import { logout } from "../../context/authContext/apiCalls";

export default function Profile() {
    const { user, dispatch } = useContext(AuthContext);

    const handleLogout = () => {
        logout(user);
    };

    const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-GB') : "N/A");

    if (!user) {
        return (
            <div className="profile flex-4">
                <h2 className="profileTitle">Admin Profile</h2>
                <p className="noUser">No admin data available.</p>
            </div>
        );
    }

    const sections = [
        {
            label: "Contact",
            fields: [
                { icon: <Email />, label: "Email", value: user.email, accent: "blue" },
                { icon: <Phone />, label: "Phone", value: user.phone || "N/A", accent: "blue" },
            ],
        },
        {
            label: "Identity",
            fields: [
                { icon: <AssignmentInd />, label: user.identityType || "ID", value: user.identityNumber || "N/A", accent: "violet" },
                { icon: <Badge />, label: "Gender", value: user.gender || "N/A", accent: "violet" },
                { icon: <CalendarToday />, label: "Date of Birth", value: fmtDate(user.dob), accent: "violet" },
            ],
        },
        {
            label: "Location",
            fields: [
                { icon: <Home />, label: "Address", value: user.address || "N/A", accent: "green" },
                { icon: <LocationCity />, label: "City / State", value: `${user.city || "N/A"}, ${user.state || "N/A"}`, accent: "green" },
                { icon: <LocationCity />, label: "Branch", value: user.branch || "N/A", accent: "green" },
                { icon: <Public />, label: "Country", value: user.country || "India", accent: "green" },
            ],
        },
        {
            label: "Account",
            fields: [
                { icon: <Lock />, label: "Last Login", value: fmtDate(user.lastLoggedIn), accent: "amber" },
                { icon: <Lock />, label: "Created On", value: fmtDate(user.createdAt), accent: "amber" },
                { icon: <Lock />, label: "Updated On", value: fmtDate(user.updatedAt), accent: "amber" },
            ],
        },
    ];

    return (
        <div className="profile flex-4">
            <div className="profileHeaderContainer">
                <h2 className="profileTitle">Admin Profile</h2>
                <button onClick={handleLogout} className="logoutButton">
                    <ExitToApp fontSize="small" />
                    <span>Logout</span>
                </button>
            </div>

            <div className="profileCard">
                <div className="profileMainHeader">
                    <img
                        src={user.profileImage || "/assets/images/logo/FullLogo.png"}
                        alt="Admin"
                        className="profileImg"
                    />
                    <div className="profileInfo">
                        <h3>{user.name}</h3>
                        <div className="profileBadges">
                            <span className={`roleBadge role-${user.role?.toLowerCase()}`}>
                                {user.role}
                            </span>
                            <span className={`statusBadge ${user.status}`}>
                                <span className="statusDot" />
                                {user.status?.toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>

                {sections.map((section) => (
                    <div className="profileSection" key={section.label}>
                        <h4 className="profileSectionLabel">{section.label}</h4>
                        <div className="profileDetails">
                            {section.fields.map((f) => (
                                <div className="detailItem" key={f.label}>
                                    <span className={`detailIconChip detailIconChip--${f.accent}`}>
                                        {f.icon}
                                    </span>
                                    <div className="detailText">
                                        <span className="detailLabel">{f.label}</span>
                                        <span className="detailValue">{f.value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}