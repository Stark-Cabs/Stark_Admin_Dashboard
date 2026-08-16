import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff, PersonAddAlt1Rounded } from "@mui/icons-material";
import { toast } from "react-toastify";
import { createAdmin } from "../../context/adminContext/apiCalls";
import { AdminContext } from "../../context/adminContext/AdminContext";
import "./newAdmin.css";

export default function NewAdmin() {
  const navigate = useNavigate();
  const { dispatch } = useContext(AdminContext);

  const [showPassword, setShowPassword] = useState(false);
  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Admin",
    status: "active",
    phone: "",
    profileImage: "",
    identityType: "Aadhar",
    identityNumber: "",
    identityDocument: "",
    address: "",
    gender: "Male",
    dob: "",
    city: "",
    branch: "",
    state: "",
    country: "India",
    isVerified: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminData({ ...adminData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createAdmin(adminData, dispatch, navigate, toast);
  };

  return (
    <div className="newAdmin">
      <div className="formContainer">
        <div className="formHeader">
          <div className="formHeaderIcon">
            <PersonAddAlt1Rounded />
          </div>
          <div>
            <h1 className="title">Add New Admin</h1>
            <p className="subtitle">Create a new admin or moderator account.</p>
          </div>
        </div>

        <form className="adminForm" onSubmit={handleSubmit}>

          <h3 className="sectionTitle">Basic Info</h3>
          <div className="formGrid">
            <div className="formItem">
              <label>Full Name</label>
              <input type="text" name="name" value={adminData.name} onChange={handleChange} required />
            </div>

            <div className="formItem">
              <label>Email</label>
              <input type="email" name="email" value={adminData.email} onChange={handleChange} required />
            </div>

            <div className="formItem">
              <label>Password</label>
              <div className="passwordWrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={adminData.password}
                  onChange={handleChange}
                  required
                />
                <span className="togglePassword" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </span>
              </div>
            </div>

            <div className="formItem">
              <label>Phone</label>
              <input type="text" name="phone" value={adminData.phone} onChange={handleChange} />
            </div>

            <div className="formItem">
              <label>Role</label>
              <select name="role" className="selectInput" value={adminData.role} onChange={handleChange}>
                <option value="SuperAdmin">SuperAdmin</option>
                <option value="Admin">Admin</option>
                <option value="Moderator">Moderator</option>
              </select>
            </div>

            <div className="formItem">
              <label>Status</label>
              <select name="status" className="selectInput" value={adminData.status} onChange={handleChange}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="deleted">Deleted</option>
              </select>
            </div>

            <div className="formItem formItem--full">
              <label>Profile Image URL</label>
              <input type="text" name="profileImage" value={adminData.profileImage} onChange={handleChange} />
            </div>
          </div>

          <h3 className="sectionTitle">Identity Verification</h3>
          <div className="formGrid">
            <div className="formItem">
              <label>Gender</label>
              <select name="gender" className="selectInput" value={adminData.gender} onChange={handleChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div className="formItem">
              <label>Identity Type</label>
              <select name="identityType" className="selectInput" value={adminData.identityType} onChange={handleChange}>
                <option value="Aadhar">Aadhar</option>
                <option value="PAN">PAN</option>
                <option value="Passport">Passport</option>
                <option value="Driving License">Driving License</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="formItem">
              <label>Identity Number</label>
              <input type="text" name="identityNumber" value={adminData.identityNumber} onChange={handleChange} />
            </div>

            <div className="formItem">
              <label>Is Verified</label>
              <select
                name="isVerified"
                className="selectInput"
                value={String(adminData.isVerified)}
                onChange={(e) =>
                  setAdminData({ ...adminData, isVerified: e.target.value === "true" })
                }
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            <div className="formItem">
              <label>Date of Birth</label>
              <input type="date" name="dob" value={adminData.dob} onChange={handleChange} />
            </div>

            <div className="formItem">
              <label>Identity Document URL</label>
              <input type="text" name="identityDocument" value={adminData.identityDocument} onChange={handleChange} />
            </div>

            <div className="formItem formItem--full">
              <label>Address</label>
              <input type="text" name="address" value={adminData.address} onChange={handleChange} />
            </div>
          </div>

          <h3 className="sectionTitle">Branch Details</h3>
          <div className="formGrid">
            <div className="formItem">
              <label>City</label>
              <input type="text" name="city" value={adminData.city} onChange={handleChange} />
            </div>

            <div className="formItem">
              <label>Branch</label>
              <input type="text" name="branch" value={adminData.branch} onChange={handleChange} />
            </div>

            <div className="formItem">
              <label>State</label>
              <input type="text" name="state" value={adminData.state} onChange={handleChange} />
            </div>

            <div className="formItem">
              <label>Country</label>
              <input type="text" name="country" value={adminData.country} onChange={handleChange} />
            </div>
          </div>

          <div className="formActions">
            <button type="button" className="cancelButton" onClick={() => navigate("/admins")}>
              Cancel
            </button>
            <button type="submit" className="submitButton">
              Create Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}