import {
    CalendarToday,
    LocationSearching,
    MailOutline,
    Phone,
    Palette,
    Approval,
    Person,
    MonetizationOn,
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
    FileCopy,
    Business,
    Timelapse,
    Description,
    CurrencyRupee,
    DirectionsCar,
    LocalTaxi,
    BrandingWatermark,
    ConfirmationNumber,
    AirlineSeatReclineNormal,
    Badge,
    Security,
    PhoneAndroid,
    Memory,
    Android
} from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./driver.css";
import { capitalizeFirstLetter } from "../../utils/helpers";
import { DriverContext } from "../../context/driverContext/DriverContext";
import { toast } from "react-toastify";
import { approveDriver, deApproveDriver, getDrivers, updateDriver } from "../../context/driverContext/apiCalls";
import axiosInstance from "../../api/axiosInstance";
import { useContext, useEffect, useState } from "react";
export default function Driver() {
    const location = useLocation();
    const navigate = useNavigate();
    const driverId = location.state.driverId;
    const { drivers, dispatch } = useContext(DriverContext);
    const driver = drivers?.find((d) => d._id === driverId);

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

            // status: driver.status,
            // is_approved: driver.is_approved,

            // baseFare: driver.baseFare,
            // perKmRate: driver.perKmRate,
            // perMinRate: driver.perMinRate,
            // minFare: driver.minFare,

            // ratings: driver.ratings,
            // totalEarning: driver.totalEarning,
            // earnings: driver.earnings,
            // totalShare: driver.totalShare,
            // shares: driver.shares,
            // totalRides: driver.totalRides,
            // pendingRides: driver.pendingRides,
            // cancelRides: driver.cancelRides,
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
                    console.log(res.data.wallet)
                    setWallet(res.data.wallet);
                } else {
                    setWallet();
                }
            } catch (error) {
                console.error("Error fetching driver wallet details:", error);
                setWallet([]);
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

            // status: driver.status,
            // is_approved: driver.is_approved,

            // baseFare: driver.baseFare,
            // perKmRate: driver.perKmRate,
            // perMinRate: driver.perMinRate,
            // minFare: driver.minFare,

            // ratings: driver.ratings,
            // totalEarning: driver.totalEarning,
            // earnings: driver.earnings,
            // totalShare: driver.totalShare,
            // shares: driver.shares,
            // totalRides: driver.totalRides,
            // pendingRides: driver.pendingRides,
            // cancelRides: driver.cancelRides,
        }
        // Compare field by field
        const hasChanges = Object.keys(updatedDriverData).some((key) => {
            return updatedDriverData[key] !== driverData[key];
        });

        console.log("Has Changes?", hasChanges);

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

    return (
        <div className="driverDetail">
            <div className="driverDetailTitleContainer">
                <h1 className="driverDetailTitle">Driver Details</h1>
                <button
                    className={`editButton ${isEditing ? "cancel" : "edit"}`}
                    onClick={() => setIsEditing(!isEditing)}
                >
                    {isEditing ? "Cancel" : "Edit Details"}
                </button>
            </div>

            {driver ? (
                <div className="driverContainer">
                    <div className="driverInfoCard">
                        <div className="driverInfoTop">
                            <img
                                src={
                                    driver.profilePic ||
                                    "https://th.bing.com/th?id=OIP.EwG6x9w6RngqsKrPJYxULAHaHa&w=250&h=250"
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

                            {/* STATUS SECTION */}
                            <div className="driverStatusWrapper">
                                <span
                                    className={`driverStatusTag ${driver.pending_suspension ? "pending" : "approved"
                                        }`}
                                >
                                    {driver.pending_suspension ? "Marked" : "Not Marked"}
                                </span>

                                <span
                                    className={`driverStatusTag ${driver.is_approved ? "approved" : "pending"
                                        }`}
                                >
                                    {driver.is_approved ? "Approved" : "Pending"}
                                </span>
                            </div>
                        </div>


                        <div className="driverInfoBottom">
                            <h3 className="driverInfoTitle">Personal Information</h3>
                            <div className="driverInfoItem">
                                <MailOutline className="driverInfoIcon" />
                                <span className="driverInfoText">{driver.email}</span>
                            </div>
                            <div className="driverInfoItem">
                                <Phone className="driverInfoIcon" />
                                <span className="driverInfoText">{driver.phone_number}</span>
                            </div>
                            <div className="driverInfoItem">
                                <EmojiFlags className="driverInfoIcon" />
                                <span className="driverInfoText">{driver.country}</span>
                            </div>
                            <div className="driverInfoItem">
                                <Home className="driverInfoIcon" />
                                <span className="driverInfoText">{driver.city || "N/A (city)"}, {driver.address || "N/A"}</span>
                            </div>
                            <div className="driverInfoItem">
                                <Cake className="driverInfoIcon" />
                                <span className="driverInfoText">
                                    {driver.dob ? new Date(driver.dob).toLocaleString("en-GB", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric"
                                    }) : "NA"}
                                </span>
                            </div>
                            <div className="driverInfoItem">
                                <Wc className="driverInfoIcon" />
                                <span className="driverInfoText">{driver.gender || "N/A"}</span>
                            </div>

                            <h3 className="driverInfoTitle">Device Details</h3>

                            <div className="driverInfoItem">
                                <PhoneAndroid className="driverInfoIcon" />
                                <span className="driverInfoText">
                                    Brand: {driver?.activeDevice?.brand || "N/A"}
                                </span>
                            </div>

                            <div className="driverInfoItem">
                                <Memory className="driverInfoIcon" />
                                <span className="driverInfoText">
                                    Model: {driver?.activeDevice?.model || "N/A"}
                                </span>
                            </div>

                            <div className="driverInfoItem">
                                <Android className="driverInfoIcon" />
                                <span className="driverInfoText">
                                    OS Name: {driver?.activeDevice?.osName || "N/A"}
                                </span>
                            </div>

                            <div className="driverInfoItem">
                                <Badge className="driverInfoIcon" />
                                <span className="driverInfoText">
                                    OS Build: {driver?.activeDevice?.osBuildId || "N/A"}
                                </span>
                            </div>

                            <h3 className="driverInfoTitle">Vehicle Details</h3>

                            <div className="driverInfoItem">
                                <DirectionsCar className="driverInfoIcon" />
                                <span className="driverInfoText">
                                    Vehicle Type: {driver.vehicle_type || "N/A"}
                                </span>
                            </div>

                            <div className="driverInfoItem">
                                <BrandingWatermark className="driverInfoIcon" />
                                <span className="driverInfoText">
                                    Brand: {driver.vehicle_brand || "N/A"}
                                </span>
                            </div>

                            <div className="driverInfoItem">
                                <LocalTaxi className="driverInfoIcon" />
                                <span className="driverInfoText">
                                    Model: {driver.vehicle_model || "N/A"}
                                </span>
                            </div>

                            <div className="driverInfoItem">
                                <ConfirmationNumber className="driverInfoIcon" />
                                <span className="driverInfoText">
                                    Registration No: {driver.registration_number || "N/A"}
                                </span>
                            </div>

                            <div className="driverInfoItem">
                                <CalendarToday className="driverInfoIcon" />
                                <span className="driverInfoText">
                                    Registration Date:{" "}
                                    {driver.registration_date
                                        ? new Date(driver.registration_date).toLocaleDateString("en-GB")
                                        : "N/A"}
                                </span>
                            </div>

                            {/* <div className="driverInfoItem">
                                <CreditCard className="driverInfoIcon" />
                                <span className="driverInfoText">
                                    Driving License: {driver.driving_license || "N/A"}
                                </span>
                            </div>

                            <div className="driverInfoItem">
                                <CalendarToday className="driverInfoIcon" />
                                <span className="driverInfoText">
                                    License Expiry:{" "}
                                    {driver.license_expiry
                                        ? new Date(driver.license_expiry).toLocaleDateString("en-GB")
                                        : "N/A"}
                                </span>
                            </div> */}

                            <div className="driverInfoItem">
                                <Palette className="driverInfoIcon" />
                                <span className="driverInfoText">
                                    Vehicle Color: {driver.vehicle_color || "N/A"}
                                </span>
                            </div>

                            <div className="driverInfoItem">
                                <AirlineSeatReclineNormal className="driverInfoIcon" />
                                <span className="driverInfoText">
                                    Capacity: {driver.capacity || "N/A"}
                                </span>
                            </div>

                            {/* <div className="driverInfoItem">
                                <Security className="driverInfoIcon" />
                                <span className="driverInfoText">
                                    Insurance Number: {driver.insurance_number || "N/A"}
                                </span>
                            </div>

                            <div className="driverInfoItem">
                                <CalendarToday className="driverInfoIcon" />
                                <span className="driverInfoText">
                                    Insurance Expiry:{" "}
                                    {driver.insurance_expiry
                                        ? new Date(driver.insurance_expiry).toLocaleDateString("en-GB")
                                        : "N/A"}
                                </span> */}
                            {/* </div> */}

                            <h3 className="driverInfoTitle">Documents</h3>

                            {/* Driving License */}
                            <div className="driverInfoItem">
                                <CreditCard className="driverInfoIcon" />
                                <span className="driverInfoText">
                                    Driving License: {driver.driving_license || "N/A"}
                                </span>
                            </div>
                            <div className="driverInfoItem">
                                <Timelapse className="driverInfoIcon" />
                                {driver.license_expiry ? (
                                    new Date(driver.license_expiry) < new Date() ? (
                                        <>
                                            <span className="driverInfoText">
                                                License Expiry:{" "}
                                                {new Date(driver.license_expiry).toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                })}
                                            </span>
                                            <span className="expiredTag">Expired</span>
                                        </>
                                    ) : (
                                        <span className="driverInfoText">
                                            License Expiry:{" "}
                                            {new Date(driver.license_expiry).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                            })}
                                        </span>
                                    )
                                ) : (
                                    <span className="driverInfoText">License Expiry: NA</span>
                                )}
                            </div>

                            {/* Insurance */}
                            <div className="driverInfoItem">
                                <Description className="driverInfoIcon" />
                                <span className="driverInfoText">
                                    Insurance: {driver.insurance_number || "N/A"}
                                </span>
                            </div>
                            <div className="driverInfoItem">
                                <Timelapse className="driverInfoIcon" />
                                {driver.insurance_expiry ? (
                                    new Date(driver.insurance_expiry) < new Date() ? (
                                        <>
                                            <span className="driverInfoText">
                                                Insurance Expiry:{" "}
                                                {new Date(driver.insurance_expiry).toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                })}
                                            </span>
                                            <span className="expiredTag">Expired</span>
                                        </>
                                    ) : (
                                        <span className="driverInfoText">
                                            Insurance Expiry:{" "}
                                            {new Date(driver.insurance_expiry).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                            })}
                                        </span>
                                    )
                                ) : (
                                    <span className="driverInfoText">Insurance Expiry: NA</span>
                                )}
                            </div>

                            {/* Aadhar */}
                            <div className="driverInfoItem">
                                <InsertDriveFile className="driverInfoIcon" />
                                <span className="driverInfoText">Aadhar: {driver.aadhar || "N/A"}</span>
                            </div>


                            <h3 className="driverInfoTitle">Statistics</h3>
                            <div className="driverInfoItem"
                                onClick={() => setShowWalletHistoryModal(true)}
                                style={{ cursor: 'pointer' }}
                            >
                                <CurrencyRupee className="driverInfoIcon" />
                                <span className="driverInfoText">Wallet Balance: ₹{wallet?.balance}</span>
                            </div>
                            <div className="driverInfoItem">
                                <Star className="driverInfoIcon" />
                                <span className="driverInfoText">Ratings: {driver.ratings}</span>
                            </div>
                            <div className="driverInfoItem">
                                <TrendingUp className="driverInfoIcon" />
                                <span className="driverInfoText">Total Rides: {driver.totalRides}</span>
                            </div>
                            <div className="driverInfoItem">
                                <HourglassEmpty className="driverInfoIcon" />
                                <span className="driverInfoText">Pending Rides: {driver.pendingRides}</span>
                            </div>
                            <div className="driverInfoItem">
                                <CancelPresentation className="driverInfoIcon" />
                                <span className="driverInfoText">Cancelled Rides: {driver.cancelRides}</span>
                            </div>
                            <div className="driverInfoItem">
                                <CurrencyRupee className="driverInfoIcon" />
                                <span className="driverInfoText">Total Earning: ₹{driver.totalEarning.toFixed(2)}</span>
                            </div>
                            <div className="driverInfoItem">
                                <CurrencyRupee className="driverInfoIcon" />
                                <span className="driverInfoText">Total Share: ₹{driver.totalShare.toFixed(2)}</span>
                            </div>

                            {/* <h3 className="driverInfoTitle">Fare Details</h3>
                            <div className="driverInfoItem">
                                <CurrencyRupee className="driverInfoIcon" />
                                <span className="driverInfoText">Base Fare: ₹{driver.baseFare?.toFixed(2) || "N/A"}</span>
                            </div>
                            <div className="driverInfoItem">
                                <CurrencyRupee className="driverInfoIcon" />
                                <span className="driverInfoText">Per KM Fare: ₹{driver.perKmRate?.toFixed(2) || "N/A"}</span>
                            </div>
                            <div className="driverInfoItem">
                                <CurrencyRupee className="driverInfoIcon" />
                                <span className="driverInfoText">Per Minute Fare: ₹{driver.perMinRate?.toFixed(2) || "N/A"}</span>
                            </div>
                            <div className="driverInfoItem">
                                <CurrencyRupee className="driverInfoIcon" />
                                <span className="driverInfoText">Minimum Fare: ₹{driver.minFare?.toFixed(2) || "N/A"}</span>
                            </div> */}

                            {showWalletHistoryModal && (
                                <div className="modalOverlay">
                                    <div className="modalContent">
                                        <h3>Full Wallet History</h3>
                                        <button
                                            className="closeModalButton"
                                            onClick={() => setShowWalletHistoryModal(false)}
                                        >
                                            ✖ Close
                                        </button>
                                        <ul className="historyList">
                                            {wallet?.history.slice().reverse().map((h) => (
                                                <li key={h._id} className="historyItem">
                                                    <p>
                                                        <strong>Action: </strong> {h.action.toUpperCase()}
                                                    </p>
                                                    <p>
                                                        <strong>Amount: </strong> ₹ {h.amount}

                                                    </p>
                                                    <p>
                                                        <strong>On: </strong>{" "}
                                                        {new Date(h.actionOn).toLocaleString('en-GB')}
                                                    </p>
                                                    <p>
                                                        <strong>Balance after: </strong> ₹ {h.balanceAfter}
                                                    </p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}


                            {/* ✅ Approval Tracking Section */}

                            <div className="driverApprovalHistory">
                                <h3 className="driverInfoTitle">Audit & Logs</h3>
                                <div className="driverInfoItem">
                                    <span className="driverInfoLabel">Created On:</span>
                                    <span className="driverInfoText">
                                        {new Date(driver.createdAt).toLocaleString("en-GB", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            second: "2-digit",
                                        })}
                                    </span>
                                </div>
                                <div className="driverInfoItem">
                                    <span className="driverInfoLabel">Updated On:</span>
                                    <span className="driverInfoText">
                                        {new Date(driver.updatedAt).toLocaleString("en-GB", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            second: "2-digit",
                                        })}
                                    </span>
                                </div>
                                {approvalHistory.length > 0 && (
                                    <div>

                                        {/* ✅ Latest Action */}
                                        <div className="driverInfoItem">
                                            <span className="driverInfoLabel">Last Action By:</span>
                                            <span className="driverInfoText">
                                                <Link
                                                    to={`/admin/${approvalHistory[0].actionBy._id}`}
                                                    state={{ adminId: approvalHistory[0].actionBy._id }}
                                                    className="link"
                                                >
                                                    {approvalHistory[0].actionBy?.name} ({approvalHistory[0].actionBy?.role})
                                                    {/* 👇 Styled button-like link */}
                                                    {/* 👤 View Admin */}
                                                </Link>
                                            </span>
                                        </div>

                                        <div className="driverInfoItem">
                                            <span className="driverInfoLabel">Last Action On:</span>
                                            <span className="driverInfoText">
                                                {new Date(approvalHistory[0].actionOn).toLocaleString("en-GB", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    second: "2-digit",
                                                })}
                                            </span>
                                        </div>

                                        <div className="driverInfoItem">
                                            <span className="driverInfoLabel">Last Action: </span>
                                            <span className="driverInfoText">{approvalHistory[0].action}</span>
                                        </div>

                                        <div className="driverInfoItem">
                                            <span className="driverInfoLabel">Remarks: </span>
                                            <span className="driverInfoText">{approvalHistory[0].remark}</span>
                                        </div>

                                        {/* ✅ Full History Button */}
                                        <button
                                            className="viewFullHistoryButton"
                                            onClick={() => setShowHistoryModal(true)}
                                        >
                                            📜 View Full History
                                        </button>
                                    </div>
                                )}

                            </div>
                        </div>

                    </div>
                    {/* ✅ Full History Modal */}
                    {showHistoryModal && (
                        <div className="modalOverlay">
                            <div className="modalContent">
                                <h3>Full Audit & Logs</h3>
                                <button
                                    className="closeModalButton"
                                    onClick={() => setShowHistoryModal(false)}
                                >
                                    ✖ Close
                                </button>
                                <ul className="historyList">
                                    {approvalHistory.map((h) => (
                                        <li key={h._id} className="historyItem">
                                            <p>
                                                <strong>Action: </strong> {h.action}
                                            </p>
                                            <p>
                                                <strong>By: </strong> {h.actionBy?.name} ({h.actionBy?.role})
                                                <Link
                                                    to={`/admin/${h.actionBy?._id}`}
                                                    state={{ adminId: h.actionBy?._id }}
                                                    className="viewAdminButton"
                                                >
                                                    👤 View Admin
                                                </Link>
                                            </p>
                                            <p>
                                                <strong>On: </strong>{" "}
                                                {new Date(h.actionOn).toLocaleString("en-GB")}
                                            </p>
                                            <p>
                                                <strong>Remarks: </strong> {h.remark ? h.remark : "—"}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                    <div className="driverActionsCard">
                        <h3 className="driverActionsTitle">Approval & Deletion</h3>
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
                        <h3 className="driverActionsTitle">Update & Control</h3>
                        <form onSubmit={handleUpdateSubmit} className="driverUpdateForm">
                            {/* --- Basic Info --- */}
                            <h3 className="driverActionsTitle">Basic Information</h3>
                            <div className="driverUpdateFormGroup">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={updatedDriverData.name}
                                    onChange={handleUpdateChange}
                                    className="driverUpdateInput"
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="driverUpdateFormGroup">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={updatedDriverData.email}
                                    onChange={handleUpdateChange}
                                    className="driverUpdateInput"
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="driverUpdateFormGroup">
                                <label htmlFor="phone_number">Phone Number</label>
                                <input
                                    type="text"
                                    id="phone_number"
                                    name="phone_number"
                                    value={updatedDriverData.phone_number}
                                    onChange={handleUpdateChange}
                                    className="driverUpdateInput"
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="driverUpdateFormGroup">
                                <label htmlFor="dob">Date of Birth</label>
                                <input
                                    type="date"
                                    id="dob"
                                    name="dob"
                                    value={updatedDriverData.dob ? updatedDriverData.dob.split("T")[0] : ""}

                                    onChange={handleUpdateChange}
                                    className="driverUpdateInput"
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="driverUpdateFormGroup">
                                <label htmlFor="gender">Gender</label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={updatedDriverData.gender}
                                    onChange={handleUpdateChange}
                                    className="driverUpdateInput"
                                    disabled={!isEditing}
                                >
                                    <option value="">Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="driverUpdateFormGroup">
                                <label htmlFor="country">Country</label>
                                <input
                                    type="text"
                                    id="country"
                                    name="country"
                                    value={updatedDriverData.country}
                                    onChange={handleUpdateChange}
                                    className="driverUpdateInput"
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="driverUpdateFormGroup">
                                <label htmlFor="city">City</label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={updatedDriverData.city}
                                    onChange={handleUpdateChange}
                                    className="driverUpdateInput"
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="driverUpdateFormGroup">
                                <label htmlFor="address">Address</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={updatedDriverData.address}
                                    onChange={handleUpdateChange}
                                    className="driverUpdateInput"
                                    disabled={!isEditing}
                                />
                            </div>

                            {/* --- Vehicle Info --- */}
                            <h3 className="driverActionsTitle">Vehicle Information</h3>
                            <div className="driverUpdateFormGroup">
                                <label htmlFor="vehicle_type">Vehicle Type</label>
                                <select
                                    id="vehicle_type"
                                    name="vehicle_type"
                                    value={updatedDriverData.vehicle_type}
                                    onChange={handleUpdateChange}
                                    className="driverUpdateInput"
                                    disabled={!isEditing}
                                >
                                    <option value="Hatchback">Hatchback</option>
                                    <option value="Sedan">Sedan</option>
                                    <option value="Suv">SUV</option>
                                </select>
                            </div>
                            <div className="driverUpdateFormGroup">
                                <label htmlFor="registration_number">Registration Number</label>
                                <input
                                    type="text"
                                    id="registration_number"
                                    name="registration_number"
                                    value={updatedDriverData.registration_number}
                                    onChange={handleUpdateChange}
                                    className="driverUpdateInput"
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="driverUpdateFormGroup">
                                <label htmlFor="registration_date">Registration Date</label>
                                <input
                                    type="date"
                                    id="registration_date"
                                    name="registration_date"
                                    value={updatedDriverData.registration_date ? updatedDriverData.registration_date.split("T")[0] : ""}
                                    onChange={handleUpdateChange}
                                    className="driverUpdateInput"
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="driverUpdateFormGroup">
                                <label htmlFor="vehicle_color">Vehicle Color</label>
                                <input
                                    type="text"
                                    id="vehicle_color"
                                    name="vehicle_color"
                                    value={updatedDriverData.vehicle_color}
                                    onChange={handleUpdateChange}
                                    className="driverUpdateInput"
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="driverUpdateFormGroup">
                                <label htmlFor="capacity">Capacity</label>
                                <input
                                    type="text"
                                    id="capacity"
                                    name="capacity"
                                    value={updatedDriverData.capacity}
                                    onChange={handleUpdateChange}
                                    className="driverUpdateInput"
                                    disabled={!isEditing}
                                />
                            </div>

                            {/* --- Documents --- */}
                            <h3 className="driverActionsTitle">Documents</h3>
                            <div className="driverUpdateFormGroup">
                                <label htmlFor="aadhar">Aadhar</label>
                                <input
                                    type="text"
                                    id="aadhar"
                                    name="aadhar"
                                    value={updatedDriverData.aadhar}
                                    onChange={handleUpdateChange}
                                    className="driverUpdateInput"
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="driverUpdateFormGroup">
                                <label htmlFor="driving_license">Driving License</label>
                                <input
                                    type="text"
                                    id="driving_license"
                                    name="driving_license"
                                    value={updatedDriverData.driving_license}
                                    onChange={handleUpdateChange}
                                    className="driverUpdateInput"
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="driverUpdateFormGroup">
                                <label htmlFor="license_expiry">License Expiry</label>
                                <input
                                    type="date"
                                    id="license_expiry"
                                    name="license_expiry"
                                    value={updatedDriverData.license_expiry ? updatedDriverData.license_expiry.split("T")[0] : ""}
                                    onChange={handleUpdateChange}
                                    className="driverUpdateInput"
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="driverUpdateFormGroup">
                                <label htmlFor="insurance_number">Insurance Number</label>
                                <input
                                    type="text"
                                    id="insurance_number"
                                    name="insurance_number"
                                    value={updatedDriverData.insurance_number}
                                    onChange={handleUpdateChange}
                                    className="driverUpdateInput"
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="driverUpdateFormGroup">
                                <label htmlFor="insurance_expiry">Insurance Expiry</label>
                                <input
                                    type="date"
                                    id="insurance_expiry"
                                    name="insurance_expiry"
                                    value={updatedDriverData.insurance_expiry ? updatedDriverData.insurance_expiry.split("T")[0] : ""}
                                    onChange={handleUpdateChange}
                                    className="driverUpdateInput"
                                    disabled={!isEditing}
                                />
                            </div>

                            {/* --- Status & Approval --- */}
                            {/* <h3 className="driverActionsTitle">Status & Approval</h3>
                            <div className="driverUpdateFormGroup">
                                <label htmlFor="status">Status</label>
                                <select
                                    id="status"
                                    name="status"
                                    value={updatedDriverData.status}
                                    onChange={handleUpdateChange}
                                    className="driverUpdateInput"
                                    disabled={!isEditing}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div> */}
                            {/* <div className="driverUpdateFormGroup">
                                <label htmlFor="is_approved">Approved</label>
                                <input
                                    type="checkbox"
                                    id="is_approved"
                                    name="is_approved"
                                    checked={updatedDriverData.is_approved}
                                    onChange={(e) =>
                                        setUpdatedDriverData({
                                            ...updatedDriverData,
                                            is_approved: e.target.checked,
                                        })
                                    }
                                    disabled={!isEditing}
                                />
                            </div> */}

                            {/* --- Fares --- */}
                            {/* <h3 className="driverActionsTitle">Fare Rates</h3>
                            <div className="driverUpdateFormGroup">
                                <label>Base Fare</label>
                                <input type="number" name="baseFare" className="driverUpdateInput" value={updatedDriverData.baseFare} onChange={handleUpdateChange} disabled={!isEditing} />
                            </div>
                            <div className="driverUpdateFormGroup">
                                <label>Per Km Rate</label>
                                <input type="number" name="perKmRate" className="driverUpdateInput" value={updatedDriverData.perKmRate} onChange={handleUpdateChange} disabled={!isEditing} />
                            </div>
                            <div className="driverUpdateFormGroup">
                                <label>Per Min Rate</label>
                                <input type="number" name="perMinRate" className="driverUpdateInput" value={updatedDriverData.perMinRate} onChange={handleUpdateChange} disabled={!isEditing} />
                            </div>
                            <div className="driverUpdateFormGroup">
                                <label>Min Fare</label>
                                <input type="number" name="minFare" className="driverUpdateInput" value={updatedDriverData.minFare} onChange={handleUpdateChange} disabled={!isEditing} />
                            </div> */}

                            {/* --- Financials --- */}
                            {/* <h3 className="driverActionsTitle">Financials</h3>
                            <div className="driverUpdateFormGroup"><label>Total Earnings</label>
                                <input type="number" name="totalEarning" className="driverUpdateInput" value={updatedDriverData.totalEarning} onChange={handleUpdateChange} disabled />
                            </div>
                            <div className="driverUpdateFormGroup"><label>Earnings</label>
                                <input type="number" name="earnings" className="driverUpdateInput" value={updatedDriverData.earnings} onChange={handleUpdateChange} disabled />
                            </div>
                            <div className="driverUpdateFormGroup"><label>Total Shares</label>
                                <input type="number" name="totalShare" className="driverUpdateInput" value={updatedDriverData.totalShare} onChange={handleUpdateChange} disabled />
                            </div>
                            <div className="driverUpdateFormGroup"><label>Shares</label>
                                <input type="number" name="shares" className="driverUpdateInput" value={updatedDriverData.shares} onChange={handleUpdateChange} disabled />
                            </div>
                            <div className="driverUpdateFormGroup"><label>Total Rides</label>
                                <input type="number" name="totalRides" className="driverUpdateInput" value={updatedDriverData.totalRides} onChange={handleUpdateChange} disabled />
                            </div>
                            <div className="driverUpdateFormGroup"><label>Pending Rides</label>
                                <input type="number" name="pendingRides" className="driverUpdateInput" value={updatedDriverData.pendingRides} onChange={handleUpdateChange} disabled />
                            </div>
                            <div className="driverUpdateFormGroup"><label>Cancelled Rides</label>
                                <input type="number" name="cancelRides" className="driverUpdateInput" value={updatedDriverData.cancelRides} onChange={handleUpdateChange} disabled />
                            </div> */}

                            {isEditing && (
                                <button type="submit" className="driverUpdateBtn">Update</button>
                            )}
                        </form>

                        <hr className="horizontal-line" />

                    </div>
                </div >
            ) : (
                <div className="noDrivers">
                    <span>🚫</span>
                    No driver found.
                </div>
            )
            }
        </div >
    );
}

