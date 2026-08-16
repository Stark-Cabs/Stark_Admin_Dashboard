import "./complaintModal.css";
import { formatDateTime } from "../../utils/formatDate";
import { useNavigate } from "react-router-dom";
import { CloseRounded, PersonOutlineRounded } from "@mui/icons-material";

export default function ComplaintViewModal({ complaint, onClose }) {
    const navigate = useNavigate();

    const user = complaint.registeredBy;
    const ride = complaint.ride;
    const admin = complaint.adminHandledBy;

    const statusClass = complaint.status?.toLowerCase().replace(/\s+/g, "-");
    const priorityClass = complaint.priority?.toLowerCase();

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-xl" onClick={(e) => e.stopPropagation()}>

                {/* HEADER */}
                <div className="modal-top">
                    <div className="user-block">
                        <img
                            src={
                                user?.profilePic ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    user?.name || "User"
                                )}`
                            }
                            alt="profile"
                        />
                        <div>
                            <h3>{user?.name}</h3>
                            <p>
                                {user?.phone_number} · {user?.email}
                            </p>
                        </div>
                    </div>

                    <div className="pill-group">
                        <span className={`pill status-${statusClass}`}>
                            {complaint.status}
                        </span>
                        <span className={`pill priority-${priorityClass}`}>
                            {complaint.priority}
                        </span>
                    </div>
{/* 
                    <button className="close-btn" onClick={onClose} aria-label="Close">
                        <CloseRounded fontSize="small" />
                    </button> */}
                </div>

                {/* BODY */}
                <div className="modal-body">

                    {/* COMPLAINT DETAILS */}
                    <div className="card">
                        <h4>Complaint Details</h4>

                        <div className="meta-grid">
                            <div><b>Category</b><span>{complaint.category}</span></div>
                            <div><b>User Type</b><span>{complaint.userType?.toUpperCase()}</span></div>
                            <div><b>Created At</b><span>{formatDateTime(complaint.createdAt)}</span></div>
                            <div>
                                <b>Resolved At</b>
                                <span>
                                    {complaint.resolvedAt
                                        ? formatDateTime(complaint.resolvedAt)
                                        : "—"}
                                </span>
                            </div>
                        </div>

                        <div className="message-highlight">
                            {complaint.message}
                        </div>
                    </div>

                    {/* ADMIN DETAILS */}
                    <div className="card">
                        <h4>Handled By</h4>

                        {admin ? (
                            <>
                                <div className="meta-grid">
                                    <div><b>Name</b><span>{admin.name}</span></div>
                                    <div><b>Role</b><span>{admin.role}</span></div>
                                    <div><b>Email</b><span>{admin.email}</span></div>
                                    <div><b>Phone</b><span>{admin.phone}</span></div>
                                </div>

                                <div className="admin-actions">
                                    <button
                                        className="secondary-btn"
                                        onClick={() => navigate(`/admin/${admin._id}`, { state: { adminId: admin._id } })}
                                    >
                                        <PersonOutlineRounded fontSize="small" />
                                        View Admin Profile
                                    </button>
                                </div>
                            </>
                        ) : (
                            <p className="muted-text">
                                This complaint has not yet been taken up by any admin.
                            </p>
                        )}
                    </div>

                    {/* RIDE DETAILS */}
                    {ride && (
                        <div className="card">
                            <h4>Ride Information</h4>

                            <div className="meta-grid">
                                <div><b>Ride Key</b><span>{ride.uniqueRideKey}</span></div>
                                <div><b>Status</b><span>{ride.status}</span></div>
                                <div><b>Distance</b><span>{ride.distance} km</span></div>
                                <div><b>Total Fare</b><span className="mono">₹{ride.totalFare}</span></div>
                                <div><b>Driver Earnings</b><span className="mono">₹{ride.driverEarnings}</span></div>
                                <div><b>Platform Share</b><span className="mono">₹{ride.platformShare}</span></div>
                            </div>

                            <div className="location-box">
                                <p><b>From</b> {ride.currentLocationName}</p>
                                <p><b>To</b> {ride.destinationLocationName}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* FOOTER */}
                <div className="modal-footer">
                    <button className="primary-btn" onClick={onClose}>
                        Close
                    </button>
                </div>

            </div>
        </div>
    );
}