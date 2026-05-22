import "./driverList.css";
import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { DriverContext } from "../../context/driverContext/DriverContext";
import { getDrivers } from "../../context/driverContext/apiCalls";

import Spinner from "../../components/spinner/Spinner";
import Chart from "../../components/chart/Chart";
import DataTable from "../../components/dataTable/DataTable";

import useDriverStats from "../../hooks/stats/driver/getDriverStats";

export default function ApprovedDriverList() {
  const { drivers, dispatch } = useContext(DriverContext);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const { driverStats, loading } = useDriverStats();

  const navigate = useNavigate();

  useEffect(() => {
    getDrivers(dispatch, toast);
  }, [dispatch]);

  // ✅ Approved + latest first
  const approvedDrivers = useMemo(() => {
    return drivers
      .filter((d) => d.is_approved)
      .sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
  }, [drivers]);

  // ✅ Columns
  const columns = useMemo(
    () => [
      {
        Header: "Profile",
        accessor: "profilePic",
        Cell: ({ value }) => (
          <img
            src={
              value && value.trim() !== ""
                ? value
                : "https://th.bing.com/th?id=OIP.EwG6x9w6RngqsKrPJYxULAHaHa"
            }
            alt="driver"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ),
      },

      { Header: "Name", accessor: "name" },

      { Header: "Email", accessor: "email" },

      { Header: "Phone", accessor: "phone_number" },

      { Header: "Country", accessor: "country" },

      {
        Header: "Vehicle",
        accessor: "vehicle_type",
        Cell: ({ row }) =>
          `${row.original.vehicle_type} (${
            row.original.vehicle_color || "N/A"
          })`,
      },

      {
        Header: "Reg No",
        accessor: "registration_number",
      },

      {
        Header: "Capacity",
        accessor: "capacity",
      },

      {
        Header: "Ratings",
        accessor: "ratings",
        Cell: ({ value }) =>
          value ? `⭐ ${value.toFixed(1)}` : "N/A",
      },

      // ✅ Created On
      {
        Header: "Created On",
        accessor: "createdAt",
        Cell: ({ value }) =>
          value
            ? new Date(value).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "N/A",
      },

      // ✅ Updated On
      {
        Header: "Updated On",
        accessor: "updatedAt",
        Cell: ({ value }) =>
          value
            ? new Date(value).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "N/A",
      },
    ],
    []
  );

  return (
    <div className="driverList">
      <Chart
        data={driverStats}
        title="Driver Analytics"
        grid
        dataKey="New Driver"
      />

      {loading ? (
        <Spinner />
      ) : (
        <DataTable
          title="Approved Drivers"
          data={approvedDrivers}
          columns={columns}
          showCreate={false}
          searchPlaceholder="Search drivers..."
          showFilter={true}
          filterOptions={[
            "All",
            "License Expired",
            "Insurance Expired",
            "Both Expired",
          ]}
          filterKey={["status"]}
          buttonName={"Edit"}
          onButtonClick={(driver) =>
            navigate(`/driver/${driver._id}`, {
              state: { driverId: driver._id },
            })
          }
        />
      )}
    </div>
  );
}