import {
    CalendarToday,
    MailOutline,
    Phone,
    Palette,
    Home,
    EmojiFlags,
    Cake,
    Wc,
    CreditCard,
    InsertDriveFile,
    Star,
    TrendingUp,
    HourglassEmpty,
    CancelPresentation,
    Timelapse,
    Description,
    CurrencyRupee,
    DirectionsCar,
    BrandingWatermark,
    LocalTaxi,
    ConfirmationNumber,
    AirlineSeatReclineNormal,
    Badge,
    PhoneAndroid,
    Memory,
    Android,
    CloseRounded,
    HistoryRounded,
    Block,
} from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./driver.css";
import { capitalizeFirstLetter } from "../../utils/helpers";
import { DriverContext } from "../../context/driverContext/DriverContext";
import { toast } from "react-toastify";
import { approveDriver, deApproveDriver, getDrivers, updateDriver } from "../../context/driverContext/apiCalls";
import axiosInstance from "../../api/axiosInstance";
import { useContext, useEffect, useState } from "react";
import { RidesContext } from "../../context/rideContext/RideContext";
import { getRides } from "../../context/rideContext/apiCalls";
import { formatDateTime } from "../../utils/formatDate";
import DataTable from "../../components/dataTable/DataTable";
import RideViewModal from "../../components/rideModal/RideViewModal";

export default function Driver() {
    const location = useLocation();
    const navigate = useNavigate();
    const driverId = location.state.driverId;
    const { drivers, dispatch } = useContext(DriverContext);
    const driver = drivers?.find((d) => d._id === driverId);

    const { rides, dispatch: rideDispatch } = useContext(RidesContext);
    const [selectedRide, setSelectedRide] = useState(null);

    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [approvalHistory, setApprovalHistory] = useState([]);
    const [wallet, setWallet] = useState();
    const [showWalletHistoryModal, setShowWalletHistoryModal] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [updatedDriverData, setUpdatedDriverData] = useState({});

    useEffect(() => {
        setShowHistoryModal(false);
        getDrivers(dispatch, toast);
    }, [dispatch]);

    useEffect(() => {
        getRides(rideDispatch, toast);
    }, [rideDispatch]);

    useEffect(() => {
        if (!driver) return;
        setUpdatedDriverData({
            name: driver.name,
            email: driver.email,
            phone_number: driver.phone_number,
            dob: driver.dob,
            gender: driver.gender,
            address: driver.address,
            country: driver.country,
            city: driver.city,

            aadhar: driver.aadhar,
            driving_license: driver.driving_license,
            license_expiry: driver.license_expiry,
            insurance_number: driver.insurance_number,
            insurance_expiry: driver.insurance_expiry,

            vehicle_type: driver.vehicle_type,
            registration_number: driver.registration_number,
            registration_date: driver.registration_date,
            vehicle_color: driver.vehicle_color,
            capacity: driver.capacity,
        });
    }, [driver]);

    useEffect(() => {
        if (!driver?._id) return;

        const getDriverApprovalHistory = async () => {
            try {
                const res = await axiosInstance.get(`/admin/drivers/approval-history/${driver._id}`);
                if (res.data.success) {
                    const sortedHistory = res.data.data.history.sort(
                        (a, b) => new Date(b.actionOn) - new Date(a.actionOn)
                    );
                    setApprovalHistory(sortedHistory);
                } else {
                    setApprovalHistory([]);
                }
            } catch (error) {
                console.error("Error fetching driver approval history:", error);
                setApprovalHistory([]);
            }
        };

        getDriverApprovalHistory();
    }, [driver]);

    useEffect(() => {
        if (!driver?._id) return;

        const getDriverWallerDetails = async () => {
            try {
                const res = await axiosInstance.get(`/admin/drivers/wallet/${driver._id}`);
                if (res.data.success) {
                    setWallet(res.data.wallet);
                } else {
                    setWallet();
                }
            } catch (error) {
                console.error("Error fetching driver wallet details:", error);
                setWallet();
            }
        };

        getDriverWallerDetails();
    }, [driver]);

    const handleUpdateChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUpdatedDriverData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        const driverData = {
            name: driver.name,
            email: driver.email,
            phone_number: driver.phone_number,
            dob: driver.dob,
            gender: driver.gender,
            address: driver.address,
            country: driver.country,
            city: driver.city,

            aadhar: driver.aadhar,
            driving_license: driver.driving_license,
            license_expiry: driver.license_expiry,
            insurance_number: driver.insurance_number,
            insurance_expiry: driver.insurance_expiry,

            vehicle_type: driver.vehicle_type,
            registration_number: driver.registration_number,
            registration_date: driver.registration_date,
            vehicle_color: driver.vehicle_color,
            capacity: driver.capacity,
        };

        const hasChanges = Object.keys(updatedDriverData).some((key) => {
            return updatedDriverData[key] !== driverData[key];
        });

        if (!hasChanges) {
            toast.info("No changes detected.");
            setIsEditing(false);
            return;
        }
        const remark = prompt("Enter a remark for this action:");
        if (remark === null) return;
        await updateDriver(driverId, updatedDriverData, dispatch, remark, toast);
        setIsEditing(false);
    };

    const handleDeleteDriver = async () => {
        // if (window.confirm("Are you sure you want to delete this driver? This action cannot be undone.")) {
        //     try {
        //         const res = await axiosInstance.delete(`/drivers/${driver._id}`);
        //         if (res.data.success) {
        //             toast.success("Driver deleted successfully!");
        //             navigate("/drivers");
        //         } else {
        //             toast.error("Failed to delete driver.");
        //         }
        //     } catch (error) {
        //         toast.error("An error occurred while deleting the driver.");
        //         console.error(error);
        //     }
        // }
    };

    const handleApproveDeapprove = () => {
        const remark = prompt("Enter a remark for this action:");
        if (remark === null) return;
        if (driver.is_approved) {
            deApproveDriver(driver, dispatch, navigate, toast, remark);
        } else {
            approveDriver(driver, dispatch, navigate, toast, remark);
        }
    };

    const driverRides = (rides || [])
        .filter((r) => r.driverId?._id === driverId || r.driverId === driverId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const rideColumns = [
        { Header: "Pickup", accessor: "currentLocationName" },
        { Header: "Drop", accessor: "destinationLocationName" },
        {
            Header: "Status",
            accessor: "status",
            Cell: ({ value }) => (
                <span className={`rideStatusTag rideStatusTag--${value?.toLowerCase()}`}>
                    {value}
                </span>
            ),
        },
        {
            Header: "Fare",
            accessor: "totalFare",
            Cell: ({ value }) => <span className="fareCell">₹{value}</span>,
        },
        {
            Header: "Date",
            accessor: "createdAt",
            Cell: ({ value }) => formatDateTime(value),
        },
    ];

    return (
        <div className="driverDetail">
            <div className="driverDetailTitleContainer">
                <h1 className="driverDetailTitle">Driver Details</h1>
                {driver && (
                    <button
                        className={`editButton ${isEditing ? "cancel" : "edit"}`}
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? "Cancel" : "Edit Details"}
                    </button>
                )}
            </div>

            {driver ? (
                <>
                    <div className="driverContainer">
                        <div className="driverInfoCard">
                            <div className="driverInfoTop">
                                <img
                                    src={
                                        driver.profilePic ||
                                        "/assets/images/logo/IconOnly.png"
                                    }
                                    alt=""
                                    className="driverInfoImg"
                                />

                                <div className="driverInfoTopTitle">
                                    <span className="driverInfoName">{driver.name}</span>
                                    <span className="driverInfoVehicle">
                                        {capitalizeFirstLetter(driver.vehicle_type)}
                                    </span>
                                </div>

                                <div className="driverStatusWrapper">
                                    <span className={`driverStatusTag ${driver.pending_suspension ? "pending" : "neutral"}`}>
                                        {driver.pending_suspension ? "Marked" : "Not Marked"}
                                    </span>
                                    <span className={`driverStatusTag ${driver.is_approved ? "approved" : "pending"}`}>
                                        {driver.is_approved ? "Approved" : "Pending"}
                                    </span>
                                </div>
                            </div>

                            <div className="driverInfoBottom">
                                <h3 className="driverInfoTitle">Personal Information</h3>
                                <div className="driverInfoGrid">
                                    <div className="driverInfoItem">
                                        <span className="driverInfoIconChip driverInfoIconChip--blue"><MailOutline /></span>
                                        <span className="driverInfoText">{driver.email}</span>
                                    </div>
                                    <div className="driverInfoItem">
                                        <span className="driverInfoIconChip driverInfoIconChip--blue"><Phone /></span>
                                        <span className="driverInfoText">{driver.phone_number}</span>
                                    </div>
                                    <div className="driverInfoItem">
                                        <span className="driverInfoIconChip driverInfoIconChip--blue"><EmojiFlags /></span>
                                        <span className="driverInfoText">{driver.country}</span>
                                    </div>
                                    <div className="driverInfoItem">
                                        <span className="driverInfoIconChip driverInfoIconChip--blue"><Home /></span>
                                        <span className="driverInfoText">{driver.city || "N/A"}, {driver.address || "N/A"}</span>
                                    </div>
                                    <div className="driverInfoItem">
                                        <span className="driverInfoIconChip driverInfoIconChip--blue"><Cake /></span>
                                        <span className="driverInfoText">
                                            {driver.dob ? new Date(driver.dob).toLocaleDateString("en-GB") : "N/A"}
                                        </span>
                                    </div>
                                    <div className="driverInfoItem">
                                        <span className="driverInfoIconChip driverInfoIconChip--blue"><Wc /></span>
                                        <span className="driverInfoText">{driver.gender || "N/A"}</span>
                                    </div>
                                </div>

                                <h3 className="driverInfoTitle">Device Details</h3>
                                <div className="driverInfoGrid">
                                    <div className="driverInfoItem">
                                        <span className="driverInfoIconChip driverInfoIconChip--violet"><PhoneAndroid /></span>
                                        <span className="driverInfoText">Brand: {driver?.activeDevice?.brand || "N/A"}</span>
                                    </div>
                                    <div className="driverInfoItem">
                                        <span className="driverInfoIconChip driverInfoIconChip--violet"><Memory /></span>
                                        <span className="driverInfoText">Model: {driver?.activeDevice?.model || "N/A"}</span>
                                    </div>
                                    <div className="driverInfoItem">
                                        <span className="driverInfoIconChip driverInfoIconChip--violet"><Android /></span>
                                        <span className="driverInfoText">OS Name: {driver?.activeDevice?.osName || "N/A"}</span>
                                    </div>
                                    <div className="driverInfoItem">
                                        <span className="driverInfoIconChip driverInfoIconChip--violet"><Badge /></span>
                                        <span className="driverInfoText">OS Build: {driver?.activeDevice?.osBuildId || "N/A"}</span>
                                    </div>
                                </div>

                                <h3 className="driverInfoTitle">Vehicle Details</h3>
                                <div className="driverInfoGrid">
                                    <div className="driverInfoItem">
                                        <span className="driverInfoIconChip driverInfoIconChip--green"><DirectionsCar /></span>
                                        <span className="driverInfoText">Type: {driver.vehicle_type || "N/A"}</span>
                                    </div>
                                    <div className="driverInfoItem">
                                        <span className="driverInfoIconChip driverInfoIconChip--green"><BrandingWatermark /></span>
                                        <span className="driverInfoText">Brand: {driver.vehicle_brand || "N/A"}</span>
                                    </div>
                                    <div className="driverInfoItem">
                                        <span className="driverInfoIconChip driverInfoIconChip--green"><LocalTaxi /></span>
                                        <span className="driverInfoText">Model: {driver.vehicle_model || "N/A"}</span>
                                    </div>
                                    <div className="driverInfoItem">
                                        <span className="driverInfoIconChip driverInfoIconChip--green"><ConfirmationNumber /></span>
                                        <span className="driverInfoText">Reg No: {driver.registration_number || "N/A"}</span>
                                    </div>
                                    <div className="driverInfoItem">
                                        <span className="driverInfoIconChip driverInfoIconChip--green"><CalendarToday /></span>
                                        <span className="driverInfoText">
                                            Reg Date: {driver.registration_date ? new Date(driver.registration_date).toLocaleDateString("en-GB") : "N/A"}
                                        </span>
                                    </div>
                                    <div className="driverInfoItem">
                                        <span className="driverInfoIconChip driverInfoIconChip--green"><Palette /></span>
                                        <span className="driverInfoText">Color: {driver.vehicle_color || "N/A"}</span>
                                    </div>
                                    <div className="driverInfoItem">
                                        <span className="driverInfoIconChip driverInfoIconChip--green"><AirlineSeatReclineNormal /></span>
                                        <span className="driverInfoText">Capacity: {driver.capacity || "N/A"}</span>
                                    </div>
                                </div>

                                <h3 className="driverInfoTitle">Documents</h3>
                                <div className="driverInfoGrid">
                                    <div className="driverInfoItem">
                                        <span className="driverInfoIconChip driverInfoIconChip--amber"><CreditCard /></span>
                                        <span className="driverInfoText">License: {driver.driving_license || "N/A"}</span>
                                    </div>

                                    <div className="driverInfoItem">
                                        <span className="driverInfoIconChip driverInfoIconChip--amber"><Timelapse /></span>
                                        <span className="driverInfoText">
                                            License Expiry: {driver.license_expiry
                                                ? new Date(driver.license_expiry).toLocaleDateString("en-GB")
                                                : "N/A"}
                                        </span>
                                        {driver.license_expiry && new Date(driver.license_expiry) < new Date() && (
                                            <span className="expiredTag">Expired</span>
                                        )}
                                    </div>

                                    <div className="driverInfoItem">
                                        <span className="driverInfoIconChip driverInfoIconChip--amber"><Description /></span>
                                        <span className="driverInfoText">Insurance: {driver.insurance_number || "N/A"}</span>
                                    </div>

                                    <div className="driverInfoItem">
                                        <span className="driverInfoIconChip driverInfoIconChip--amber"><Timelapse /></span>
                                        <span className="driverInfoText">
                                            Insurance Expiry: {driver.insurance_expiry
                                                ? new Date(driver.insurance_expiry).toLocaleDateString("en-GB")
                                                : "N/A"}
                                        </span>
                                        {driver.insurance_expiry && new Date(driver.insurance_expiry) < new Date() && (
                                            <span className="expiredTag">Expired</span>
                                        )}
                                    </div>

                                    <div className="driverInfoItem">
                                        <span className="driverInfoIconChip driverInfoIconChip--amber"><InsertDriveFile /></span>
                                        <span className="driverInfoText">Aadhar: {driver.aadhar || "N/A"}</span>
                                    </div>
                                </div>

                                <h3 className="driverInfoTitle">Statistics</h3>
                                <div className="driverInfoGrid">
                                    <div
                                        className="driverInfoItem driverInfoItem--clickable"
                                        onClick={() => setShowWalletHistoryModal(true)}
                                    >
                                        <span className="driverInfoIconChip driverInfoIconChip--danger"><CurrencyRupee /></span>
                                        <span className="driverInfoText">Wallet Balance: ₹{wallet?.balance ?? "0.00"}</span>
                                    </div>
                                    <div className="driverInfoItem">
                                        <span className="driverInfoIconChip driverInfoIconChip--danger"><Star /></span>
                                        <span className="driverInfoText">Ratings: {driver.ratings ?? "N/A"}</span>
                                    </div>
                                    <div className="driverInfoItem">
                                        <span className="driverInfoIconChip driverInfoIconChip--danger"><TrendingUp /></span>
                                        <span className="driverInfoText">Total Rides: {driver.totalRides ?? 0}</span>
                                    </div>
                                    <div className="driverInfoItem">
                                        <span className="driverInfoIconChip driverInfoIconChip--danger"><HourglassEmpty /></span>
                                        <span className="driverInfoText">Pending Rides: {driver.pendingRides ?? 0}</span>
                                    </div>
                                    <div className="driverInfoItem">
                                        <span className="driverInfoIconChip driverInfoIconChip--danger"><CancelPresentation /></span>
                                        <span className="driverInfoText">Cancelled Rides: {driver.cancelRides ?? 0}</span>
                                    </div>
                                    <div className="driverInfoItem">
                                        <span className="driverInfoIconChip driverInfoIconChip--danger"><CurrencyRupee /></span>
                                        <span className="driverInfoText">Total Earning: ₹{driver.totalEarning?.toFixed(2) ?? "0.00"}</span>
                                    </div>
                                    <div className="driverInfoItem">
                                        <span className="driverInfoIconChip driverInfoIconChip--danger"><CurrencyRupee /></span>
                                        <span className="driverInfoText">Total Share: ₹{driver.totalShare?.toFixed(2) ?? "0.00"}</span>
                                    </div>
                                </div>

                                {showWalletHistoryModal && (
                                    <div className="modalOverlay" onClick={() => setShowWalletHistoryModal(false)}>
                                        <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                                            <div className="modalContentHeader">
                                                <h3>Full Wallet History</h3>
                                                <button
                                                    className="closeModalButton"
                                                    onClick={() => setShowWalletHistoryModal(false)}
                                                    aria-label="Close"
                                                >
                                                    <CloseRounded fontSize="small" />
                                                </button>
                                            </div>
                                            <ul className="historyList">
                                                {wallet?.history?.slice().reverse().map((h) => (
                                                    <li key={h._id} className="historyItem">
                                                        <div className="historyItemTop">
                                                            <span className="historyAction">{h.action?.toUpperCase()}</span>
                                                            <span className="historyDate">{new Date(h.actionOn).toLocaleString('en-GB')}</span>
                                                        </div>
                                                        <p className="historyBy">Amount: ₹{h.amount}</p>
                                                        <p className="historyRemark">Balance after: ₹{h.balanceAfter}</p>
                                                    </li>
                                                ))}
                                                {(!wallet?.history || wallet.history.length === 0) && (
                                                    <p className="historyEmpty">No wallet activity yet.</p>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                <div className="driverApprovalHistory">
                                    <h3 className="driverInfoTitle">Audit & Logs</h3>
                                    <div className="logsGrid">
                                        <div className="logRow">
                                            <span className="logLabel">Created On</span>
                                            <span className="logValue">
                                                {new Date(driver.createdAt).toLocaleString("en-GB", {
                                                    day: "2-digit", month: "2-digit", year: "numeric",
                                                    hour: "2-digit", minute: "2-digit", second: "2-digit",
                                                })}
                                            </span>
                                        </div>
                                        <div className="logRow">
                                            <span className="logLabel">Updated On</span>
                                            <span className="logValue">
                                                {new Date(driver.updatedAt).toLocaleString("en-GB", {
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
                        </div>

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
                                                    <span className="historyDate">{new Date(h.actionOn).toLocaleString("en-GB")}</span>
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
                                                <p className="historyRemark">{h.remark ? h.remark : "No remarks"}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        <div className="driverActionsCard">
                            <h3 className="driverActionsTitle">Approval & Deletion</h3>
                            <div className="driverActionButtons">
                                <button
                                    className={`driverActionButton ${driver.is_approved ? "deapprove" : "approve"}`}
                                    onClick={handleApproveDeapprove}
                                >
                                    {driver.is_approved ? "Deapprove Driver" : "Approve Driver"}
                                </button>
                                <button
                                    className="driverActionButton delete"
                                    onClick={handleDeleteDriver}
                                >
                                    Delete Driver
                                </button>
                            </div>

                            <h3 className="driverActionsTitle updateTitle">Update & Control</h3>
                            <form onSubmit={handleUpdateSubmit} className="driverUpdateForm">
                                <h4 className="driverFormSectionTitle">Basic Information</h4>
                                <div className="driverUpdateGrid">
                                    <div className="driverUpdateFormGroup">
                                        <label htmlFor="name">Name</label>
                                        <input type="text" id="name" name="name" value={updatedDriverData.name || ""} onChange={handleUpdateChange} className="driverUpdateInput" disabled={!isEditing} />
                                    </div>
                                    <div className="driverUpdateFormGroup">
                                        <label htmlFor="email">Email</label>
                                        <input type="email" id="email" name="email" value={updatedDriverData.email || ""} onChange={handleUpdateChange} className="driverUpdateInput" disabled={!isEditing} />
                                    </div>
                                    <div className="driverUpdateFormGroup">
                                        <label htmlFor="phone_number">Phone Number</label>
                                        <input type="text" id="phone_number" name="phone_number" value={updatedDriverData.phone_number || ""} onChange={handleUpdateChange} className="driverUpdateInput" disabled={!isEditing} />
                                    </div>
                                    <div className="driverUpdateFormGroup">
                                        <label htmlFor="dob">Date of Birth</label>
                                        <input type="date" id="dob" name="dob" value={updatedDriverData.dob ? updatedDriverData.dob.split("T")[0] : ""} onChange={handleUpdateChange} className="driverUpdateInput" disabled={!isEditing} />
                                    </div>
                                    <div className="driverUpdateFormGroup">
                                        <label htmlFor="gender">Gender</label>
                                        <select id="gender" name="gender" value={updatedDriverData.gender || ""} onChange={handleUpdateChange} className="driverUpdateInput" disabled={!isEditing}>
                                            <option value="">Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className="driverUpdateFormGroup">
                                        <label htmlFor="country">Country</label>
                                        <input type="text" id="country" name="country" value={updatedDriverData.country || ""} onChange={handleUpdateChange} className="driverUpdateInput" disabled={!isEditing} />
                                    </div>
                                    <div className="driverUpdateFormGroup">
                                        <label htmlFor="city">City</label>
                                        <input type="text" id="city" name="city" value={updatedDriverData.city || ""} onChange={handleUpdateChange} className="driverUpdateInput" disabled={!isEditing} />
                                    </div>
                                    <div className="driverUpdateFormGroup driverUpdateFormGroup--full">
                                        <label htmlFor="address">Address</label>
                                        <input type="text" id="address" name="address" value={updatedDriverData.address || ""} onChange={handleUpdateChange} className="driverUpdateInput" disabled={!isEditing} />
                                    </div>
                                </div>

                                <h4 className="driverFormSectionTitle">Vehicle Information</h4>
                                <div className="driverUpdateGrid">
                                    <div className="driverUpdateFormGroup">
                                        <label htmlFor="vehicle_type">Vehicle Type</label>
                                        <select id="vehicle_type" name="vehicle_type" value={updatedDriverData.vehicle_type || ""} onChange={handleUpdateChange} className="driverUpdateInput" disabled={!isEditing}>
                                            <option value="Hatchback">Hatchback</option>
                                            <option value="Sedan">Sedan</option>
                                            <option value="Suv">SUV</option>
                                        </select>
                                    </div>
                                    <div className="driverUpdateFormGroup">
                                        <label htmlFor="registration_number">Registration Number</label>
                                        <input type="text" id="registration_number" name="registration_number" value={updatedDriverData.registration_number || ""} onChange={handleUpdateChange} className="driverUpdateInput" disabled={!isEditing} />
                                    </div>
                                    <div className="driverUpdateFormGroup">
                                        <label htmlFor="registration_date">Registration Date</label>
                                        <input type="date" id="registration_date" name="registration_date" value={updatedDriverData.registration_date ? updatedDriverData.registration_date.split("T")[0] : ""} onChange={handleUpdateChange} className="driverUpdateInput" disabled={!isEditing} />
                                    </div>
                                    <div className="driverUpdateFormGroup">
                                        <label htmlFor="vehicle_color">Vehicle Color</label>
                                        <input type="text" id="vehicle_color" name="vehicle_color" value={updatedDriverData.vehicle_color || ""} onChange={handleUpdateChange} className="driverUpdateInput" disabled={!isEditing} />
                                    </div>
                                    <div className="driverUpdateFormGroup">
                                        <label htmlFor="capacity">Capacity</label>
                                        <input type="text" id="capacity" name="capacity" value={updatedDriverData.capacity || ""} onChange={handleUpdateChange} className="driverUpdateInput" disabled={!isEditing} />
                                    </div>
                                </div>

                                <h4 className="driverFormSectionTitle">Documents</h4>
                                <div className="driverUpdateGrid">
                                    <div className="driverUpdateFormGroup">
                                        <label htmlFor="aadhar">Aadhar</label>
                                        <input type="text" id="aadhar" name="aadhar" value={updatedDriverData.aadhar || ""} onChange={handleUpdateChange} className="driverUpdateInput" disabled={!isEditing} />
                                    </div>
                                    <div className="driverUpdateFormGroup">
                                        <label htmlFor="driving_license">Driving License</label>
                                        <input type="text" id="driving_license" name="driving_license" value={updatedDriverData.driving_license || ""} onChange={handleUpdateChange} className="driverUpdateInput" disabled={!isEditing} />
                                    </div>
                                    <div className="driverUpdateFormGroup">
                                        <label htmlFor="license_expiry">License Expiry</label>
                                        <input type="date" id="license_expiry" name="license_expiry" value={updatedDriverData.license_expiry ? updatedDriverData.license_expiry.split("T")[0] : ""} onChange={handleUpdateChange} className="driverUpdateInput" disabled={!isEditing} />
                                    </div>
                                    <div className="driverUpdateFormGroup">
                                        <label htmlFor="insurance_number">Insurance Number</label>
                                        <input type="text" id="insurance_number" name="insurance_number" value={updatedDriverData.insurance_number || ""} onChange={handleUpdateChange} className="driverUpdateInput" disabled={!isEditing} />
                                    </div>
                                    <div className="driverUpdateFormGroup">
                                        <label htmlFor="insurance_expiry">Insurance Expiry</label>
                                        <input type="date" id="insurance_expiry" name="insurance_expiry" value={updatedDriverData.insurance_expiry ? updatedDriverData.insurance_expiry.split("T")[0] : ""} onChange={handleUpdateChange} className="driverUpdateInput" disabled={!isEditing} />
                                    </div>
                                </div>

                                {isEditing && (
                                    <button type="submit" className="driverUpdateBtn">Update</button>
                                )}
                            </form>
                        </div>
                    </div>

                    <div className="recentRidesSection">
                        <DataTable
                            title="Recent Rides"
                            data={driverRides}
                            columns={rideColumns}
                            showCreate={false}
                            buttonName="View"
                            onButtonClick={(ride) => setSelectedRide(ride)}
                            searchPlaceholder="Search rides by location..."
                            showFilter={true}
                            filterOptions={["Booked", "Processing", "Arrived", "Ongoing", "Reached", "Completed", "Cancelled"]}
                            filterKey="status"
                        />
                    </div>

                    {selectedRide && (
                        <RideViewModal
                            ride={selectedRide}
                            onClose={() => setSelectedRide(null)}
                        />
                    )}
                </>
            ) : (
                <div className="noDrivers">
                    <Block style={{ fontSize: 28 }} />
                    <span>No driver found.</span>
                </div>
            )}
        </div>
    );
}