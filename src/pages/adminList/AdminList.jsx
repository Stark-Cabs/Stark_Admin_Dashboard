import React, { useContext, useEffect, useMemo } from "react";
import DataTable from "../../components/dataTable/DataTable";
import { AdminContext } from "../../context/adminContext/AdminContext";
import { getAdmins } from "../../context/adminContext/apiCalls";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext/AuthContext";
import "./adminList.css";

export default function AdminList() {
  const { admins, dispatch } = useContext(AdminContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    getAdmins(dispatch, toast);
  }, [dispatch]);

  const columns = useMemo(
    () => [
      {
        Header: "Profile",
        accessor: "profileImage",
        Cell: ({ value }) => (
          <img
            src={
              value && value.trim() !== ""
                ? value
                : "/assets/images/logo/IconOnly.png"
            }
            alt="profile"
            className="tableImg"
          />
        ),
      },
      { Header: "Name", accessor: "name" },
      { Header: "Email", accessor: "email" },
      {
        Header: "Role",
        accessor: "role",
        Cell: ({ value }) => (
          <span className={`roleTag role-${value?.toLowerCase()}`}>{value}</span>
        ),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <span className={`statusTag status-${value?.toLowerCase()}`}>{value}</span>
        ),
      },
      { Header: "Phone", accessor: "phone" },
    ],
    []
  );

  const handleEditClick = (admin) => {
    navigate(`/admin/${admin._id}`, { state: { adminId: admin._id } });
  };

  return (
    <div className="adminList">
      <DataTable
        title="Admins"
        data={admins || []}
        columns={columns}
        showCreate={user?.role === "SuperAdmin"}
        onCreateClick={() => navigate("/newAdmin")}
        buttonName={'View'}
        onButtonClick={handleEditClick}
        searchPlaceholder="Search by name, email, or phone..."
        showFilter={true}
        filterOptions={["SuperAdmin", "Admin", "Moderator", "Active", "Inactive", "Deleted"]}
        filterKey="role"
      />
    </div>
  );
}