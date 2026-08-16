import React, { useState, useEffect } from "react";
import "./fareForm.css";
import { districts } from "../../../utils/districts";
import Select from "react-select";
import { CloseRounded } from "@mui/icons-material";

const selectStyles = {
    control: (base, state) => ({
        ...base,
        marginTop: 6,
        minHeight: 42,
        borderRadius: 10,
        borderColor: state.isFocused ? "#2F5CFF" : "#E4E7EC",
        boxShadow: state.isFocused ? "0 0 0 3px #E8ECFF" : "none",
        "&:hover": { borderColor: state.isFocused ? "#2F5CFF" : "#E4E7EC" },
        fontSize: 13.5,
    }),
    placeholder: (base) => ({ ...base, color: "#8A93A6" }),
    singleValue: (base) => ({ ...base, color: "#101828" }),
    menu: (base) => ({
        ...base,
        borderRadius: 10,
        overflow: "hidden",
        border: "1px solid #E4E7EC",
        boxShadow: "0 8px 24px rgba(16,24,40,0.12)",
        zIndex: 20,
    }),
    option: (base, state) => ({
        ...base,
        fontSize: 13.5,
        backgroundColor: state.isSelected
            ? "#2F5CFF"
            : state.isFocused
            ? "#E8ECFF"
            : "#fff",
        color: state.isSelected ? "#fff" : "#101828",
        cursor: "pointer",
    }),
};

export default function FareFormModal({ show, onClose, onSubmit, initialData }) {
    const [formData, setFormData] = useState({
        vehicle_type: "",
        baseFare: "",
        baseFareUptoKm: "",
        perKmRate: "",
        perMinRate: "",
        surgeMultiplier: 1,
        district: "",
    });

    const districtOptions = districts.map((d) => ({
        value: d,
        label: d,
    }));

    useEffect(() => {
        if (initialData) {
            setFormData({
                vehicle_type: initialData.vehicle_type,
                baseFare: initialData.baseFare,
                baseFareUptoKm: initialData.baseFareUptoKm,
                perKmRate: initialData.perKmRate,
                perMinRate: initialData.perMinRate,
                surgeMultiplier: initialData.surgeMultiplier,
                district: initialData.district,
            });
        } else {
            setFormData({
                vehicle_type: "",
                baseFare: "",
                baseFareUptoKm: "",
                perKmRate: "",
                perMinRate: "",
                surgeMultiplier: 1,
                district: "",
            });
        }
    }, [initialData, show]);

    if (!show) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{initialData ? "Edit Fare Details" : "Create Fare"}</h2>
                    <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
                        <CloseRounded fontSize="small" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="formField">
                        <label>Vehicle Type</label>
                        <select
                            name="vehicle_type"
                            value={formData.vehicle_type}
                            onChange={handleChange}
                            disabled={!!initialData}
                            required
                        >
                            <option value="">Select</option>
                            <option value="Auto">Auto</option>
                            <option value="Hatchback">Hatchback</option>
                            <option value="Sedan">Sedan</option>
                            <option value="Suv">Suv</option>
                        </select>
                    </div>

                    <div className="formField">
                        <label>District</label>
                        <Select
                            options={districtOptions}
                            value={districtOptions.find(
                                (opt) => opt.value === formData.district
                            )}
                            onChange={(selected) =>
                                setFormData({ ...formData, district: selected.value })
                            }
                            isSearchable
                            isDisabled={!!initialData}
                            placeholder="Select district"
                            styles={selectStyles}
                        />
                    </div>

                    <div className="formGrid">
                        <div className="formField">
                            <label>Base Fare (Minimum)</label>
                            <input
                                type="number"
                                name="baseFare"
                                value={formData.baseFare}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="formField">
                            <label>Base Fare Upto (Km)</label>
                            <input
                                type="number"
                                name="baseFareUptoKm"
                                value={formData.baseFareUptoKm}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="formField">
                            <label>Per Km Rate</label>
                            <input
                                type="number"
                                name="perKmRate"
                                value={formData.perKmRate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="formField">
                            <label>Per Minute Rate</label>
                            <input
                                type="number"
                                name="perMinRate"
                                value={formData.perMinRate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="formField formField--full">
                            <label>Surge Multiplier</label>
                            <input
                                type="number"
                                step="0.1"
                                name="surgeMultiplier"
                                value={formData.surgeMultiplier}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-save">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}