import React, { useContext, useEffect, useMemo, useState } from "react";
import DataTable from "../../components/dataTable/DataTable";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/authContext/AuthContext";
import { FaresContext } from "../../context/fareContext/FareContext";
import { createFare, getFares, updateFare } from "../../context/fareContext/apiCalls";
import "./fareList.css";
import FareFormModal from "../../components/form/fareForm/FareForm";

export default function FareList() {
    const { fares, dispatch } = useContext(FaresContext);
    const { user } = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);
    const [selectedFare, setSelectedFare] = useState(null);

    useEffect(() => {
        getFares(dispatch, toast);
    }, [dispatch]);

    const columns = useMemo(
        () => [
            {
                Header: "Vehicle Type",
                accessor: "vehicle_type",
                Cell: ({ value }) => <span className="vehicleTag">{value}</span>,
            },
            { Header: "District", accessor: "district" },
            {
                Header: "Base Fare",
                accessor: "baseFare",
                Cell: ({ value }) => <span className="fareAmount">₹{value}</span>,
            },
            { Header: "Upto Km", accessor: "baseFareUptoKm" },
            {
                Header: "Per Km Amount",
                accessor: "perKmRate",
                Cell: ({ value }) => <span className="fareAmount">₹{value}</span>,
            },
            {
                Header: "Per Minute",
                accessor: "perMinRate",
                Cell: ({ value }) => <span className="fareAmount">₹{value}</span>,
            },
            {
                Header: "Surge Multiplier",
                accessor: "surgeMultiplier",
                Cell: ({ value }) => <span className="surgeTag">{value}×</span>,
            },
            {
                Header: "Last Updated",
                accessor: "updatedAt",
                Cell: ({ value }) => {
                    if (!value) return "N/A";
                    const date = new Date(value);
                    return date.toLocaleString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    });
                },
            },
        ],
        []
    );

    const handleEditClick = (row) => {
        setSelectedFare(row);
        setShowModal(true);
    };

    const handleCreateClick = () => {
        setSelectedFare(null);
        setShowModal(true);
    };

    const handleSubmit = (formData) => {
        console.log(formData)
        if (selectedFare) {
            updateFare(dispatch, toast, formData, setShowModal)
        } else {
            createFare(dispatch, toast, formData, setShowModal)
        }
    };

    return (
        <div className="fareList">
            <DataTable
                title="Fare Details"
                data={fares || []}
                columns={columns}
                showCreate={true}
                onCreateClick={handleCreateClick}
                buttonName="Edit"
                onButtonClick={handleEditClick}
                searchPlaceholder="Search by district or vehicle type..."
                showFilter={true}
            />

            <FareFormModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleSubmit}
                initialData={selectedFare}
            />
        </div>
    );
}