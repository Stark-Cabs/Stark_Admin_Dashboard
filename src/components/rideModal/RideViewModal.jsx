import "./rideModal.css";
import { formatDateTime } from "../../utils/formatDate";
import { useNavigate } from "react-router-dom";
import { CloseRounded, PersonOutlineRounded, LocalTaxiOutlined } from "@mui/icons-material";

const round = (n) => Math.round(n * 100) / 100;

const calculateFareBreakdown = (totalFare = 0) => {
    if (!totalFare) {
        return {
            baseAmount: 0,
            gst: 0,
            platformFee: 0,
            walletDeduction: 0,
        };
    }

    const baseAmount = totalFare / 1.05;
    const gst = baseAmount * 0.05;
    const platformFee = baseAmount * 0.1;

    return {
        baseAmount: round(baseAmount),
        gst: round(gst),
        platformFee: round(platformFee),
        walletDeduction: round(gst + platformFee),
    };
};

export default function RideViewModal({ ride, onClose }) {
    const navigate = useNavigate();

    const driver = ride.driverId;
    const user = ride.userId;
    const isCancelled = ride.status === "Cancelled";
    const cancel = ride.cancelDetails || {};
    const fare = calculateFareBreakdown(ride.totalFare);
    const statusClass = ride.status?.toLowerCase();

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-xl" onClick={(e) => e.stopPropagation()}>

                {/* HEADER */}
                <div className="modal-top">
                    <div className="modal-title">
                        <h3>Ride Details</h3>
                        <span className={`ride-status ride-status--${statusClass}`}>
                            {ride.status}
                        </span>
                    </div>

                    <button className="close-btn" onClick={onClose} aria-label="Close">
                        <CloseRounded fontSize="small" />
                    </button>
                </div>

                <div className="modal-body">

                    {/* SUMMARY */}
                    <div className="card highlight">
                        <div className="summary-grid">
                            <div>
                                <b>Ride Key</b>
                                <span className="mono">{ride.uniqueRideKey}</span>
                            </div>
                            <div>
                                <b>Distance</b>
                                <span>{ride.distance} km</span>
                            </div>
                            <div>
                                <b>Created</b>
                                <span>{formatDateTime(ride.createdAt)}</span>
                            </div>
                            <div>
                                <b>Last Updated</b>
                                <span>{formatDateTime(ride.updatedAt)}</span>
                            </div>
                        </div>
                    </div>

                    {/* LOCATIONS */}
                    <div className="card">
                        <h4>Locations</h4>
                        <div className="location-box">
                            <p><b>Pickup</b> {ride.currentLocationName}</p>
                            <p><b>Drop</b> {ride.destinationLocationName}</p>
                        </div>
                    </div>

                    {/* CUSTOMER */}
                    <div className="card split">
                        <div>
                            <h4>Customer</h4>
                            <div className="grid">
                                <div><b>Name</b><span>{user?.name}</span></div>
                                <div><b>Phone</b><span>{user?.phone_number}</span></div>
                                <div><b>Email</b><span>{user?.email}</span></div>
                            </div>
                        </div>

                        <button
                            className="secondary-btn"
                            onClick={() =>
                                navigate(`/user/${user?._id}`, {
                                    state: { userId: user?._id },
                                })
                            }
                        >
                            <PersonOutlineRounded fontSize="small" />
                            View Customer
                        </button>
                    </div>

                    {/* DRIVER */}
                    <div className="card split">
                        <div>
                            <h4>Driver</h4>
                            <div className="grid">
                                <div><b>Name</b><span>{driver?.name}</span></div>
                                <div><b>Phone</b><span>{driver?.phone_number}</span></div>
                                <div>
                                    <b>Vehicle</b>
                                    <span>
                                        {driver?.vehicle_type} • {driver?.registration_number}
                                    </span>
                                </div>
                                <div><b>Status</b><span>{driver?.status}</span></div>
                            </div>
                        </div>

                        <button
                            className="secondary-btn"
                            onClick={() =>
                                navigate(`/driver/${driver?._id}`, {
                                    state: { driverId: driver?._id },
                                })
                            }
                        >
                            <LocalTaxiOutlined fontSize="small" />
                            View Driver
                        </button>
                    </div>

                    {/* FARE */}
                    <div className="card">
                        <h4>Fare Breakdown</h4>

                        <div className="fare-grid">
                            <div>
                                <b>Total Fare (Incl. GST)</b>
                                <span className="mono">₹{ride.totalFare}</span>
                            </div>

                            <div>
                                <b>Base Fare</b>
                                <span className="mono">₹{fare.baseAmount}</span>
                            </div>

                            <div>
                                <b>GST (5%)</b>
                                <span className="mono">₹{fare.gst}</span>
                            </div>

                            <div>
                                <b>Platform Fee (10%)</b>
                                <span className="mono">₹{fare.platformFee}</span>
                            </div>

                            <div className="highlight-fee">
                                <b>Deducted From Wallet</b>
                                <span className="mono">₹{fare.walletDeduction}</span>
                            </div>

                            <div>
                                <b>Driver Earnings</b>
                                <span className="mono">₹{ride.driverEarnings}</span>
                            </div>
                        </div>

                        {isCancelled && (
                            <>
                                <hr className="divider" />

                                <h4 className="cancel-title">Cancellation Details</h4>

                                <div className="fare-grid cancelled">
                                    <div>
                                        <b>Cancelled By</b>
                                        <span>{cancel.cancelledBy || "—"}</span>
                                    </div>

                                    <div>
                                        <b>Travelled Distance</b>
                                        <span>{cancel.travelledDistance || "0"} km</span>
                                    </div>

                                    <div>
                                        <b>Platform Fee Deducted</b>
                                        <span className="mono">₹{cancel.platformShare || 0}</span>
                                    </div>

                                    <div>
                                        <b>Amount Refunded to Wallet</b>
                                        <span className="mono">₹{cancel.refundedAmount || 0}</span>
                                    </div>

                                    <div>
                                        <b>Total Fare (After Cancel)</b>
                                        <span className="mono">₹{cancel.totalFare || 0}</span>
                                    </div>
                                    <div>
                                        <b>Driver Earnings (After Cancel)</b>
                                        <span className="mono">₹{cancel.driverEarnings || 0}</span>
                                    </div>
                                </div>

                                {cancel.cancelledLocationName && (
                                    <div className="location-box cancelled-box">
                                        <p>
                                            <b>Cancelled At</b> {cancel.cancelledLocationName}
                                        </p>
                                        <p>
                                            <b>Cancelled Time</b>{" "}
                                            {formatDateTime(cancel.cancelledAt)}
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                </div>

                <div className="modal-footer">
                    <button className="primary-btn" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}