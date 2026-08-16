import {
    PermIdentity,
    MailOutline,
    CalendarToday,
    Badge,
    Timeline,
    Login,
    Logout,
    PhoneAndroid,
    PersonAdd,
    PersonOutline,
    Security,
    Block,
    Public,
    CloseRounded,
    HistoryRounded,
    CheckCircleRounded,
    CancelRounded,
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from 'react';
import "./admin.css";
import { AdminContext } from '../../context/adminContext/AdminContext';
import { activateAdmin, deActivateAdmin, getAdmins, updateAdmin } from '../../context/adminContext/apiCalls';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axiosInstance';

export default function Admin() {
    const location = useLocation();
    const navigate = useNavigate();
    const adminId = location.state.adminId;
    const { admins, dispatch } = useContext(AdminContext);
    const admin = admins?.find((a) => a._id === adminId);

    const [isEditing, setIsEditing] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [approvalHistory, setApprovalHistory] = useState([]);

    const [updatedAdmin, setUpdatedAdmin] = useState({
        name: admin?.name || "",
        email: admin?.email || "",
        phone: admin?.phone || "",
        role: admin?.role || "Admin",
        status: admin?.status || "active",
        profileImage: admin?.profileImage || "",
        password: "",
        identityType: admin?.identityType || "Other",
        identityNumber: admin?.identityNumber || "",
        identityDocument: admin?.identityDocument || "",
        isVerified: admin?.isVerified || false,
        dob: admin?.dob ? new Date(admin.dob).toISOString().split("T")[0] : "",
        gender: admin?.gender || "Other",
        address: admin?.address || "",
        city: admin?.city || "",
        branch: admin?.branch || "",
        state: admin?.state || "",
        country: admin?.country || "India",
    });

    useEffect(() => {
        if (admin) {
            setUpdatedAdmin({
                name: admin.name || "",
                email: admin.email || "",
                phone: admin.phone || "",
                role: admin.role || "Admin",
                status: admin.status || "active",
                profileImage: admin.profileImage || "",
                password: "",
                identityType: admin.identityType || "Other",
                identityNumber: admin.identityNumber || "",
                identityDocument: admin.identityDocument || "",
                isVerified: admin.isVerified || false,
                dob: admin.dob ? new Date(admin.dob).toISOString().split("T")[0] : "",
                gender: admin.gender || "Other",
                address: admin.address || "",
                city: admin.city || "",
                branch: admin.branch || "",
                state: admin.state || "",
                country: admin.country || "India",
            });
        }
    }, [admin]);

    useEffect(() => {
        setShowHistoryModal(false);
        getAdmins(dispatch, toast);
    }, [dispatch]);

    useEffect(() => {
        if (!admin?._id) return;

        const getAdminApprovalHistory = async () => {
            try {
                const res = await axiosInstance.get(`/admin/admins/history/${admin._id}`);
                if (res.data.success) {
                    const sortedHistory = res.data.data.history.sort(
                        (a, b) => new Date(b.actionOn) - new Date(a.actionOn)
                    );
                    setApprovalHistory(sortedHistory);
                } else {
                    setApprovalHistory([]);
                }
            } catch (error) {
                console.error("Error fetching admin approval history:", error);
                setApprovalHistory([]);
            }
        };

        getAdminApprovalHistory();
    }, [admin]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // isVerified is rendered as a boolean-valued <select>, but the DOM always
        // reports e.target.value as a string — coerce back to a real boolean here
        // so updatedAdmin.isVerified doesn't silently become "true"/"false" strings.
        if (name === "isVerified") {
            setUpdatedAdmin({ ...updatedAdmin, isVerified: value === "true" });
            return;
        }
        setUpdatedAdmin({ ...updatedAdmin, [name]: value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const adminData = {
            name: admin.name || "",
            email: admin.email || "",
            phone: admin.phone || "",
            role: admin.role || "Admin",
            status: admin.status || "active",
            profileImage: admin.profileImage || "",
            password: "",
            identityType: admin.identityType || "Other",
            identityNumber: admin.identityNumber || "",
            identityDocument: admin.identityDocument || "",
            isVerified: admin.isVerified || false,
            dob: admin.dob ? new Date(admin.dob).toISOString().split("T")[0] : "",
            gender: admin.gender || "Other",
            address: admin.address || "",
            city: admin.city || "",
            branch: admin.branch || "",
            state: admin.state || "",
            country: admin.country || "India",
        };

        const hasChanges = Object.keys(updatedAdmin).some((key) => {
            if (key === "password" && !updatedAdmin[key]) return false;
            return updatedAdmin[key] !== adminData[key];
        });

        if (!hasChanges) {
            toast.info("No changes detected.");
            setIsEditing(false);
            return;
        }
        const remark = prompt("Enter a remark for this action:");
        if (remark === null) return;
        await updateAdmin(adminId, updatedAdmin, dispatch, remark, toast);
        setIsEditing(false);
    };

    const handleApproval = () => {
        if (admin?.status === 'active') {
            deActivateAdmin(admin, dispatch, toast);
        } else {
            activateAdmin(admin, dispatch, toast);
        }
    };

    const handleDelete = (id) => {
        // deleteAdmin(id, dispatch); // implement later
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (!admin) {
        return (
            <div className="adminDetail">
                <div className="adminTitleContainer">
                    <h1 className="adminTitle">Admin Details</h1>
                </div>
                <div className="noAdminFound">
                    <Block style={{ fontSize: 32 }} />
                    <p>Admin not found or you are not granted to perform this.</p>
                </div>
            </div>
        );
    }

    const infoSections = [
        {
            label: "Account Info",
            fields: [
                { icon: <MailOutline />, label: "Email", value: admin.email, accent: "blue" },
                admin.phone && { icon: <PhoneAndroid />, label: "Phone", value: admin.phone, accent: "blue" },
                { icon: <Badge />, label: "Role", value: admin.role, accent: "blue" },
                { icon: <Timeline />, label: "Status", value: admin.status, accent: "blue" },
            ].filter(Boolean),
        },
        {
            label: "Identity Verification",
            fields: [
                { icon: <Badge />, label: "ID Type", value: admin.identityType || "N/A", accent: "violet" },
                { icon: <Badge />, label: "ID Number", value: admin.identityNumber || "N/A", accent: "violet" },
                {
                    icon: admin.isVerified ? <CheckCircleRounded /> : <CancelRounded />,
                    label: "Verified",
                    value: admin.isVerified ? "Yes" : "No",
                    accent: admin.isVerified ? "green" : "danger",
                },
                { icon: <PermIdentity />, label: "Gender", value: admin.gender || "N/A", accent: "violet" },
                { icon: <CalendarToday />, label: "Date of Birth", value: admin.dob ? new Date(admin.dob).toLocaleDateString("en-GB") : "N/A", accent: "violet" },
                { icon: <MailOutline />, label: "Address", value: admin.address || "N/A", accent: "violet" },
            ],
        },
        {
            label: "Location Details",
            fields: [
                { icon: <Badge />, label: "City", value: admin.city || "N/A", accent: "green" },
                { icon: <Badge />, label: "Branch", value: admin.branch || "N/A", accent: "green" },
                { icon: <Badge />, label: "State", value: admin.state || "N/A", accent: "green" },
                { icon: <Badge />, label: "Country", value: admin.country || "N/A", accent: "green" },
                admin.lastIp && { icon: <Public />, label: "Last IP", value: admin.lastIp, accent: "green" },
            ].filter(Boolean),
        },
        {
            label: "Activity & Dates",
            fields: [
                { icon: <CalendarToday />, label: "Created", value: formatDate(admin.createdAt), accent: "amber" },
                { icon: <CalendarToday />, label: "Last Updated", value: formatDate(admin.updatedAt), accent: "amber" },
                admin.lastLoggedIn && { icon: <Login />, label: "Last Logged In", value: formatDate(admin.lastLoggedIn), accent: "amber" },
                admin.lastLoggedOut && { icon: <Logout />, label: "Last Logged Out", value: formatDate(admin.lastLoggedOut), accent: "amber" },
            ].filter(Boolean),
        },
        {
            label: "Security & Audit",
            fields: [
                { icon: <Security />, label: "Login Attempts", value: admin.loginAttempts, accent: "danger" },
                admin.lockedUntil && { icon: <Block />, label: "Locked Until", value: formatDate(admin.lockedUntil), accent: "danger" },
                admin.createdBy && {
                    icon: <PersonAdd />,
                    label: "Created By",
                    value: (
                        <Link to={`/admin/${admin.createdBy._id}`} state={{ adminId: admin.createdBy._id }} className="fieldLink">
                            {admin.createdBy.name} ({admin.createdBy.email})
                        </Link>
                    ),
                    accent: "danger",
                },
                admin.updatedBy && {
                    icon: <PersonOutline />,
                    label: "Last Updated By",
                    value: (
                        <Link to={`/admin/${admin.updatedBy._id}`} state={{ adminId: admin.updatedBy._id }} className="fieldLink">
                            {admin.updatedBy.name} ({admin.updatedBy.email})
                        </Link>
                    ),
                    accent: "danger",
                },
            ].filter(Boolean),
        },
    ];

    return (
        <div className="adminDetail">
            <div className="adminTitleContainer">
                <h1 className="adminTitle">Admin Details</h1>
                <button
                    className={`editButton ${isEditing ? "cancel" : "edit"}`}
                    onClick={() => setIsEditing(!isEditing)}
                >
                    {isEditing ? "Cancel" : "Edit Details"}
                </button>
            </div>

            <div className="adminContainer">
                {/* Left Info Card */}
                <div className="adminShow">
                    <div className="adminShowTop">
                        <img
                            src={admin.profileImage || "https://th.bing.com/th?id=OIP.EwG6x9w6RngqsKrPJYxULAHaHa&w=250&h=250"}
                            alt={admin.name}
                            className="adminShowImg"
                        />
                        <div className="adminShowTopTitle">
                            <span className="adminShowUsername">{admin.name}</span>
                            <span className="adminShowUserRole">{admin.role}</span>
                        </div>
                        <span className={`adminStatusTag adminStatusTag--${admin.status}`}>
                            {admin.status}
                        </span>
                    </div>

                    {infoSections.map((section) => (
                        <div className="adminShowSection" key={section.label}>
                            <h3 className="adminShowTitle">{section.label}</h3>
                            <div className="adminShowGrid">
                                {section.fields.map((f) => (
                                    <div className="adminShowInfo" key={f.label}>
                                        <span className={`adminShowIconChip adminShowIconChip--${f.accent}`}>
                                            {f.icon}
                                        </span>
                                        <div className="adminShowInfoText">
                                            <span className="adminShowInfoLabel">{f.label}</span>
                                            <span className="adminShowInfoValue">{f.value}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="adminShowSection">
                        <h3 className="adminShowTitle">Logs</h3>
                        <div className="logsGrid">
                            <div className="logRow">
                                <span className="logLabel">Created On</span>
                                <span className="logValue">
                                    {new Date(admin.createdAt).toLocaleString("en-GB", {
                                        day: "2-digit", month: "2-digit", year: "numeric",
                                        hour: "2-digit", minute: "2-digit", second: "2-digit",
                                    })}
                                </span>
                            </div>
                            <div className="logRow">
                                <span className="logLabel">Updated On</span>
                                <span className="logValue">
                                    {new Date(admin.updatedAt).toLocaleString("en-GB", {
                                        day: "2-digit", month: "2-digit", year: "numeric",
                                        hour: "2-digit", minute: "2-digit", second: "2-digit",
                                    })}
                                </span>
                            </div>

                            {approvalHistory.length > 0 && (
                                <>
                                    <div className="logRow">
                                        <span className="logLabel">Last Action By</span>
                                        <span className="logValue">
                                            <Link
                                                to={`/admin/${approvalHistory[0].actionBy._id}`}
                                                state={{ adminId: approvalHistory[0].actionBy._id }}
                                                className="fieldLink"
                                            >
                                                {approvalHistory[0].actionBy?.name} ({approvalHistory[0].actionBy?.role})
                                            </Link>
                                        </span>
                                    </div>

                                    <div className="logRow">
                                        <span className="logLabel">Last Action On</span>
                                        <span className="logValue">
                                            {new Date(approvalHistory[0].actionOn).toLocaleString("en-GB", {
                                                day: "2-digit", month: "2-digit", year: "numeric",
                                                hour: "2-digit", minute: "2-digit", second: "2-digit",
                                            })}
                                        </span>
                                    </div>

                                    <div className="logRow">
                                        <span className="logLabel">Last Action</span>
                                        <span className="logValue">{approvalHistory[0].action}</span>
                                    </div>

                                    <div className="logRow">
                                        <span className="logLabel">Remarks</span>
                                        <span className="logValue">{approvalHistory[0].remark || "—"}</span>
                                    </div>

                                    <button
                                        className="viewFullHistoryButton"
                                        onClick={() => setShowHistoryModal(true)}
                                    >
                                        <HistoryRounded fontSize="small" />
                                        View Full History
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Full History Modal */}
                {showHistoryModal && (
                    <div className="modalOverlay" onClick={() => setShowHistoryModal(false)}>
                        <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                            <div className="modalContentHeader">
                                <h3>Full Audit & Logs</h3>
                                <button
                                    className="closeModalButton"
                                    onClick={() => setShowHistoryModal(false)}
                                    aria-label="Close"
                                >
                                    <CloseRounded fontSize="small" />
                                </button>
                            </div>
                            <ul className="historyList">
                                {approvalHistory.map((h) => (
                                    <li key={h._id} className="historyItem">
                                        <div className="historyItemTop">
                                            <span className="historyAction">{h.action}</span>
                                            <span className="historyDate">
                                                {new Date(h.actionOn).toLocaleString("en-GB")}
                                            </span>
                                        </div>
                                        <p className="historyBy">
                                            By {h.actionBy?.name} ({h.actionBy?.role})
                                            <Link
                                                to={`/admin/${h.actionBy?._id}`}
                                                state={{ adminId: h.actionBy?._id }}
                                                className="viewAdminButton"
                                            >
                                                View Admin
                                            </Link>
                                        </p>
                                        <p className="historyRemark">
                                            {h.remark ? h.remark : "No remarks"}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Right Actions and Edit Card */}
                <div className="adminActionsCard">
                    <h3 className="adminActionsTitle">Actions</h3>

                    <div className="adminActionButtons">
                        <button
                            className={`adminActionButton ${admin.status === "active" ? "deactivate" : "activate"}`}
                            onClick={handleApproval}
                        >
                            {admin.status === "active" ? "Deactivate Admin" : "Activate Admin"}
                        </button>

                        <button
                            className="adminActionButton delete"
                            onClick={() => handleDelete(admin._id)}
                        >
                            Delete Admin
                        </button>
                    </div>

                    <h3 className="adminActionsTitle updateTitle">Update Admin Details</h3>
                    <form className="adminUpdateForm" onSubmit={handleUpdate}>
                        <div className="adminUpdateGrid">
                            <div className="adminUpdateItem">
                                <label>Name</label>
                                <input type="text" name="name" value={updatedAdmin.name} onChange={handleChange} className="adminUpdateInput" disabled={!isEditing} />
                            </div>

                            <div className="adminUpdateItem">
                                <label>Email</label>
                                <input type="email" name="email" value={updatedAdmin.email} onChange={handleChange} className="adminUpdateInput" disabled={!isEditing} />
                            </div>

                            <div className="adminUpdateItem">
                                <label>Phone Number</label>
                                <input type="text" name="phone" value={updatedAdmin.phone} onChange={handleChange} className="adminUpdateInput" disabled={!isEditing} />
                            </div>

                            <div className="adminUpdateItem">
                                <label>Role</label>
                                <select name="role" value={updatedAdmin.role} onChange={handleChange} className="adminUpdateInput" disabled={!isEditing}>
                                    <option value="Moderator">Moderator</option>
                                    <option value="Admin">Admin</option>
                                    <option value="SuperAdmin">Super Admin</option>
                                </select>
                            </div>

                            <div className="adminUpdateItem">
                                <label>Status</label>
                                <select name="status" value={updatedAdmin.status} onChange={handleChange} className="adminUpdateInput" disabled={!isEditing}>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            <div className="adminUpdateItem">
                                <label>Gender</label>
                                <select name="gender" value={updatedAdmin.gender} onChange={handleChange} className="adminUpdateInput" disabled={!isEditing}>
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="adminUpdateItem">
                                <label>Date of Birth</label>
                                <input
                                    type="date"
                                    name="dob"
                                    value={updatedAdmin.dob ? new Date(updatedAdmin.dob).toISOString().split("T")[0] : ""}
                                    onChange={handleChange}
                                    className="adminUpdateInput"
                                    disabled={!isEditing}
                                />
                            </div>

                            <div className="adminUpdateItem">
                                <label>Address</label>
                                <input type="text" name="address" value={updatedAdmin.address} onChange={handleChange} className="adminUpdateInput" disabled={!isEditing} />
                            </div>

                            <div className="adminUpdateItem">
                                <label>City</label>
                                <input type="text" name="city" value={updatedAdmin.city} onChange={handleChange} className="adminUpdateInput" disabled={!isEditing} />
                            </div>

                            <div className="adminUpdateItem">
                                <label>Branch</label>
                                <input type="text" name="branch" value={updatedAdmin.branch} onChange={handleChange} className="adminUpdateInput" disabled={!isEditing} />
                            </div>

                            <div className="adminUpdateItem">
                                <label>State</label>
                                <input type="text" name="state" value={updatedAdmin.state} onChange={handleChange} className="adminUpdateInput" disabled={!isEditing} />
                            </div>

                            <div className="adminUpdateItem">
                                <label>Country</label>
                                <input type="text" name="country" value={updatedAdmin.country} onChange={handleChange} className="adminUpdateInput" disabled={!isEditing} />
                            </div>

                            <div className="adminUpdateItem">
                                <label>Identity Type</label>
                                <select name="identityType" value={updatedAdmin.identityType} onChange={handleChange} className="adminUpdateInput" disabled={!isEditing}>
                                    <option value="Aadhar">Aadhar</option>
                                    <option value="PAN">PAN</option>
                                    <option value="Passport">Passport</option>
                                    <option value="Driving License">Driving License</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="adminUpdateItem">
                                <label>Identity Number</label>
                                <input type="text" name="identityNumber" value={updatedAdmin.identityNumber} onChange={handleChange} className="adminUpdateInput" disabled={!isEditing} />
                            </div>

                            <div className="adminUpdateItem">
                                <label>Verified</label>
                                <select name="isVerified" value={String(updatedAdmin.isVerified)} onChange={handleChange} className="adminUpdateInput" disabled={!isEditing}>
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>
                            </div>

                            <div className="adminUpdateItem adminUpdateItem--full">
                                <label>Profile Image URL</label>
                                <input type="text" name="profileImage" value={updatedAdmin.profileImage} onChange={handleChange} className="adminUpdateInput" disabled={!isEditing} />
                            </div>

                            <div className="adminUpdateItem adminUpdateItem--full">
                                <label>Password (leave blank if unchanged)</label>
                                <input type="password" name="password" value={updatedAdmin.password || ""} onChange={handleChange} className="adminUpdateInput" disabled={!isEditing} />
                            </div>
                        </div>

                        {isEditing && (
                            <button type="submit" className="adminUpdateButton">
                                Update
                            </button>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}