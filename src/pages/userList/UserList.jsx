import "./userList.css";
import { useContext, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { UserContext } from "../../context/userContext/UserContext";
import { getUsers } from "../../context/userContext/apiCalls";

import Spinner from "../../components/spinner/Spinner";
import Chart from "../../components/chart/Chart";
import DataTable from "../../components/dataTable/DataTable";

import useUserStats from "../../hooks/stats/user/getUserStats";

export default function UserList() {
  const { users, dispatch } = useContext(UserContext);
  const { userStats, loading } = useUserStats();

  const navigate = useNavigate();

  useEffect(() => {
    getUsers(dispatch);
  }, [dispatch]);

  const sortedUsers = useMemo(() => {
    return [...users].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [users]);

  const columns = useMemo(
    () => [
      {
        Header: "Profile",
        accessor: "profilePic",
        Cell: ({ row }) => (
          <img
            src={
              row.original.profilePic ||
              "/assets/images/logo/IconOnly.png"
            }
            alt={row.original.name || "User"}
            className="tableImg"
          />
        ),
      },
      { Header: "Name", accessor: "name" },
      { Header: "Email", accessor: "email" },
      { Header: "Phone", accessor: "phone_number" },
      { Header: "Total Rides", accessor: "totalRides" },
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
    <div className="userList">
      {/* <h2 className="pageTitle">Users</h2> */}

      <Chart data={userStats} title="User Analytics" grid dataKey="New Users" accent="blue" />

      {loading ? (
        <Spinner />
      ) : (
        <DataTable
          title="Users"
          data={sortedUsers}
          columns={columns}
          showCreate={false}
          searchPlaceholder="Search users by name, email, or phone..."
          buttonName="View"
          filterOptions={[]}
          onButtonClick={(user) =>
            navigate(`/user/${user._id}`, {
              state: { userId: user._id },
            })
          }
        />
      )}
    </div>
  );
}