import {
  CalendarToday,
  MailOutline,
  Phone,
  BadgeOutlined,
  StarBorderRounded,
  DirectionsCarFilledOutlined,
} from '@mui/icons-material';
import { useLocation, useNavigate } from "react-router-dom";
import "./user.css";
import { useContext, useEffect, useState } from 'react';
import { getUsers, updateUser } from '../../context/userContext/apiCalls';
import { UserContext } from '../../context/userContext/UserContext';
import { RidesContext } from '../../context/rideContext/RideContext';
import { getRides } from '../../context/rideContext/apiCalls';
import { formatDateTime } from '../../utils/formatDate';
import DataTable from '../../components/dataTable/DataTable';
import RideViewModal from '../../components/rideModal/RideViewModal';
import { toast } from 'react-toastify';

export default function User() {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state.userId;

  const { users, dispatch } = useContext(UserContext);
  const { rides, dispatch: rideDispatch } = useContext(RidesContext);
  const user = users?.find((u) => u._id === userId);

  const [userData, setUserData] = useState(user);
  const [selectedRide, setSelectedRide] = useState(null);

  useEffect(() => {
    getUsers(dispatch);
  }, [dispatch]);

  useEffect(() => {
    getRides(rideDispatch, toast);
  }, [rideDispatch]);

  // Keep the edit form in sync once the user record actually resolves
  // (fixes fields staying blank on first load / direct navigation)
  useEffect(() => {
    if (user) setUserData(user);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // updateUser(userData, dispatch, navigate)
  };

  const userRides = (rides || [])
    .filter((r) => r.userId?._id === userId || r.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const rideColumns = [
    { Header: "Pickup", accessor: "currentLocationName" },
    { Header: "Drop", accessor: "destinationLocationName" },
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
      Header: "Fare",
      accessor: "totalFare",
      Cell: ({ value }) => <span className="fareCell">₹{value}</span>,
    },
    {
      Header: "Date",
      accessor: "createdAt",
      Cell: ({ value }) => formatDateTime(value),
    },
  ];

  if (!user) {
    return (
      <div className="user">
        <div className="userTitleContainer">
          <h1 className="userTitle">User Not Found</h1>
        </div>
        <div className="notFoundCard">
          <p>The user you are looking for does not exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const infoSections = [
    {
      label: "Account",
      fields: [
        { icon: <BadgeOutlined />, label: "Created On", value: new Date(user?.createdAt).toLocaleDateString(), accent: "blue" },
        { icon: <CalendarToday />, label: "Updated On", value: new Date(user?.updatedAt).toLocaleDateString(), accent: "blue" },
      ],
    },
    {
      label: "Contact",
      fields: [
        { icon: <MailOutline />, label: "Email", value: user?.email || "N/A", accent: "violet" },
        { icon: <Phone />, label: "Phone", value: user?.phone_number || "N/A", accent: "violet" },
      ],
    },
    {
      label: "Activity",
      fields: [
        { icon: <DirectionsCarFilledOutlined />, label: "Completed Rides", value: user?.totalRides ?? "0", accent: "green" },
        { icon: <DirectionsCarFilledOutlined />, label: "Pending Rides", value: user?.pendingRides ?? "0", accent: "amber" },
        { icon: <DirectionsCarFilledOutlined />, label: "Cancelled Rides", value: user?.cancelRides ?? "0", accent: "violet" },
        { icon: <StarBorderRounded />, label: "Rating", value: user?.ratings ? `⭐ ${user.ratings.toFixed(1)}` : "N/A", accent: "amber" },
      ],
    },
  ];

  return (
    <div className="user">
      <div className="userTitleContainer">
        <h1 className="userTitle">User Details</h1>
      </div>

      <div className="userContainer">
        <div className="userShow">
          <div className="userShowTop">
            <img
              src={user.profilePic || "/assets/images/logo/FullLogo.png"}
              alt=""
              className="userShowImg"
            />
            <div className="userShowTopTitle">
              <span className="userShowUsername">{user?.name}</span>
              <span className="userShowUserTitle">User</span>
            </div>
          </div>

          {infoSections.map((section) => (
            <div className="userInfoSection" key={section.label}>
              <span className="userShowTitle">{section.label}</span>
              <div className="userInfoGrid">
                {section.fields.map((f) => (
                  <div className="userShowInfo" key={f.label}>
                    <span className={`userShowIconChip userShowIconChip--${f.accent}`}>{f.icon}</span>
                    <div className="userShowInfoText">
                      <span className="userShowInfoLabel">{f.label}</span>
                      <span className="userShowInfoValue">{f.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="userUpdate">
          <span className="userUpdateTitle">Edit</span>
          <form className="userUpdateForm" onSubmit={handleSubmit}>
            <div className="userUpdateItem">
              <label>Name</label>
              <input
                type="text"
                name='name'
                placeholder={user?.name}
                value={userData?.name || ''}
                className="userUpdateInput"
                onChange={handleChange}
              />
            </div>
            <div className="userUpdateItem">
              <label>Email</label>
              <input
                type="text"
                name='email'
                placeholder={user?.email}
                className="userUpdateInput"
                value={userData?.email || ''}
                onChange={handleChange}
              />
            </div>
            <div className="userUpdateItem">
              <label>Phone Number</label>
              <input
                type="text"
                name='phone_number'
                placeholder={user?.phone_number}
                className="userUpdateInput"
                value={userData?.phone_number || ''}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="userUpdateButton">Update</button>
          </form>
        </div>
      </div>

      <div className="recentRidesSection">
        <DataTable
          title="Recent Rides"
          data={userRides}
          columns={rideColumns}
          showCreate={false}
          buttonName="View"
          onButtonClick={(ride) => setSelectedRide(ride)}
          searchPlaceholder="Search rides by location..."
          showFilter={true}
          filterOptions={["Booked", "Processing", "Arrived", "Ongoing", "Reached", "Completed", "Cancelled"]}
          filterKey="status"
        />
      </div>

      {selectedRide && (
        <RideViewModal
          ride={selectedRide}
          onClose={() => setSelectedRide(null)}
        />
      )}
    </div>
  );
}