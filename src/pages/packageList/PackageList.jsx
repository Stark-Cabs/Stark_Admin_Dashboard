import React, { useContext, useEffect, useMemo, useState } from "react";
import DataTable from "../../components/dataTable/DataTable";
import { toast } from "react-toastify";
import "./packageList.css";
import { PackagesContext } from "../../context/packagesContext/PackagesContext";
import { createPackage, deletePackage, getPackages, updatePackage } from "../../context/packagesContext/apiCalls";
import PackageFormModal from "../../components/form/packageForm/PackageForm";

export default function PackageList() {
    const { packages, dispatch } = useContext(PackagesContext);
    const [showModal, setShowModal] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState(null);

    useEffect(() => {
        getPackages(dispatch, toast);
    }, [dispatch]);

    const columns = useMemo(
        () => [
            { Header: "Pickup", accessor: "pickupLocation" },
            { Header: "Drop", accessor: "dropLocation" },
            {
                Header: "Start Date",
                accessor: "startDate",
                Cell: ({ value }) => (value ? new Date(value).toLocaleString("en-IN", {
                    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                }) : "N/A"),
            },
            {
                Header: "End Date",
                accessor: "endDate",
                Cell: ({ value }) => (value ? new Date(value).toLocaleString("en-IN", {
                    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                }) : "N/A"),
            },
            {
                Header: "Cab Type",
                accessor: "cabType",
                Cell: ({ value }) => <span className="cabTag">{value}</span>,
            },
            {
                Header: "Priority",
                accessor: "priority",
                Cell: ({ value }) => (
                    <span className={`priorityTag priorityTag--${value?.toLowerCase()}`}>
                        {value}
                    </span>
                ),
            },
            { Header: "Contact", accessor: "contactNumber" },
            {
                Header: "Last Updated",
                accessor: "updatedAt",
                Cell: ({ value }) => {
                    if (!value) return "N/A";
                    return new Date(value).toLocaleString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                    });
                },
            },
        ],
        []
    );

    const handleEditClick = (row) => {
        setSelectedTrip(row);
        setShowModal(true);
    };

    const handleCreateClick = () => {
        setSelectedTrip(null);
        setShowModal(true);
    };

    const handleDelete = () => {
        if (!selectedTrip?._id) return;

        deletePackage(dispatch, toast, null, setShowModal, selectedTrip._id);
    };

    const handleSubmit = (formData) => {
        if (selectedTrip) {
            updatePackage(dispatch, toast, formData, setShowModal, selectedTrip._id);
        } else {
            createPackage(dispatch, toast, formData, setShowModal);
        }
    };

    return (
        <div className="packageList">
            <DataTable
                title="Packages"
                data={packages || []}
                columns={columns}
                showCreate={true}
                onCreateClick={handleCreateClick}
                buttonName="Edit"
                onButtonClick={handleEditClick}
                searchPlaceholder="Search by date or vehicle type..."
                showFilter={true}
            />

            <PackageFormModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleSubmit}
                onDelete={handleDelete}
                initialData={selectedTrip}
            />
        </div>
    );
}