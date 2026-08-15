import React, { useState, useEffect } from "react";
import "./packageForm.css";

export default function PackageFormModal({ show, onClose, onSubmit, onDelete, initialData }) {
    const [formData, setFormData] = useState({
        pickupLocation: "",
        dropLocation: "",
        startDate: "",
        endDate: "",
        cabType: "",
        priority: "low",
        description: "",
        contactNumber: "",
    });

    const formatDateForInput = (date) => {
        if (!date) return "";

        const d = new Date(date);

        const parts = new Intl.DateTimeFormat("en-CA", {
            timeZone: "Asia/Kolkata",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h23",
        }).formatToParts(d);

        const get = (type) =>
            parts.find((part) => part.type === type)?.value;

        return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
    };

    const convertISTToUTC = (dateTime) => {
        if (!dateTime) return "";

        const [date, time] = dateTime.split("T");
        const [year, month, day] = date.split("-").map(Number);
        const [hours, minutes] = time.split(":").map(Number);

        // Treat the selected date/time as IST (+05:30)
        const utcDate = new Date(
            Date.UTC(year, month - 1, day, hours, minutes)
        );

        utcDate.setMinutes(utcDate.getMinutes() - 330);

        return utcDate.toISOString();
    };
    
    useEffect(() => {
        if (initialData) {
            setFormData({
                pickupLocation: initialData.pickupLocation || "",
                dropLocation: initialData.dropLocation || "",
                startDate: formatDateForInput(initialData.startDate),
                endDate: formatDateForInput(initialData.endDate),
                cabType: initialData.cabType || "",
                priority: initialData.priority || "low",
                description: initialData.description || "",
                contactNumber: initialData.contactNumber || "",
            });
        }
    }, [initialData]);

    if (!show) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            ...formData,
            startDate: convertISTToUTC(formData.startDate),
            endDate: convertISTToUTC(formData.endDate),
        };

        console.log("Selected IST:", formData.startDate);
        console.log("UTC being sent:", payload.startDate);

        onSubmit(payload);
    };


    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>{initialData ? "Edit Package Details" : "Create Package"}</h2>

                <form onSubmit={handleSubmit}>
                    <label>Pickup Location</label>
                    <input
                        type="text"
                        name="pickupLocation"
                        value={formData.pickupLocation}
                        onChange={handleChange}
                        required
                    />

                    <label>Drop Location</label>
                    <input
                        type="text"
                        name="dropLocation"
                        value={formData.dropLocation}
                        onChange={handleChange}
                        required
                    />

                    <label>Start Date</label>
                    <input
                        type="datetime-local"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                    />

                    <label>End Date</label>
                    <input
                        type="datetime-local"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                    />

                    <label>Cab Type</label>
                    <select
                        name="cabType"
                        value={formData.cabType}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select</option>
                        <option value="Auto">Auto</option>
                        <option value="Hatchback">Hatchback</option>
                        <option value="Sedan">Sedan</option>
                        <option value="Suv">Suv</option>
                        <option value="Traveller">Traveller</option>
                    </select>

                    <label>Priority</label>
                    <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>

                    <label>Contact Number</label>
                    <input
                        type="text"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                    />

                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />

                    <div className="modal-actions">
                        <button type="submit">Save</button>

                        {initialData && (
                            <button
                                type="button"
                                className="delete-btn"
                                onClick={() => {
                                    if (window.confirm("Are you sure you want to delete this package?")) {
                                        onDelete();
                                    }
                                }}
                            >
                                Delete
                            </button>
                        )}

                        <button type="button" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
