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

  const approvedDrivers = useMemo(() => {
    return drivers
      .filter((d) => d.is_approved)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [drivers]);

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
                : "/assets/images/logo/IconOnly.png"
            }
            alt="driver"
            className="tableImg"
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
          `${row.original.vehicle_type} (${row.original.vehicle_color || "N/A"})`,
      },
      { Header: "Reg No", accessor: "registration_number" },
      { Header: "Capacity", accessor: "capacity" },
      {
        Header: "Ratings",
        accessor: "ratings",
        Cell: ({ value }) => (value ? `⭐ ${value.toFixed(1)}` : "N/A"),
      },
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
    <div className="driverLists">

      {/* <h2 className="pageTitle">Approved Drivers</h2> */}

      <Chart data={driverStats} title="Driver Analytics" grid dataKey="New Drivers" accent="violet" />

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
          filterOptions={["All", "License Expired", "Insurance Expired", "Both Expired"]}
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