import React, { useContext, useEffect, useMemo, useState } from "react";
import DataTable from "../../components/dataTable/DataTable";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext/AuthContext";
import './rideList.css'
import { RidesContext } from "../../context/rideContext/RideContext";
import { getRides } from "../../context/rideContext/apiCalls";
import { formatDateTime } from "../../utils/formatDate";
import RideViewModal from "../../components/rideModal/RideViewModal";
import useRideStats from "../../hooks/stats/ride/getRideStats";
import Chart from "../../components/chart/Chart";

export default function RideList() {
    const { rides, dispatch } = useContext(RidesContext);
    const [selectedRide, setSelectedRide] = useState(null);

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const { rideStats } = useRideStats();


    useEffect(() => {
        getRides(dispatch, toast);
    }, [dispatch]);

    const columns = useMemo(
        () => [
            { Header: "Pickup Location", accessor: "currentLocationName" },
            { Header: "Drop Location", accessor: "destinationLocationName" },
            {
                Header: "Distance",
                accessor: "distance",
                Cell: ({ value }) => `${value} km`,
            },
            {
                Header: "Vehicle",
                accessor: "driverId",
                Cell: ({ value }) => {
                    if (!value) return "N/A";
                    const { vehicle_type, registration_number } = value;
                    return `${vehicle_type || "Unknown"} • ${registration_number || "N/A"}`;
                },
            },
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
                Header: "Last Updated",
                accessor: "updatedAt",
                Cell: ({ value }) => formatDateTime(value),
            },
            {
                Header: "Total Fare",
                accessor: "totalFare",
                Cell: ({ value }) => <span className="fareCell">₹{value}</span>,
            },
            {
                Header: "Driver Share",
                accessor: "driverEarnings",
                Cell: ({ value }) => <span className="fareCell">₹{value}</span>,
            },
            {
                Header: "Platform Share",
                accessor: "platformShare",
                Cell: ({ value }) => <span className="fareCell">₹{value}</span>,
            },
            { Header: "Driver Name", accessor: "driverId.name" },
            { Header: "Customer Name", accessor: "userId.name" },
        ],
        []
    );

    return (
        <div className="rideList">

            <Chart data={rideStats} title="Rides Analytics" grid dataKey="New Rides" accent="amber" />

            <DataTable
                title="Rides"
                data={rides || []}
                columns={columns}
                showCreate={false}
                buttonName={'View'}
                onButtonClick={(ride) => {
                    setSelectedRide(ride)
                }}
                searchPlaceholder="Search by name, email, or phone..."
                showFilter={true}
                filterOptions={["Booked", "Processing", "Arrived", "Ongoing", "Reached", "Completed", "Cancelled"]}
                filterKey="status"
            />

            {selectedRide && (
                <RideViewModal
                    ride={selectedRide}
                    onClose={() => setSelectedRide(null)}
                />
            )}
        </div>
    );
}