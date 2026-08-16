import { Link } from "react-router-dom";
import "./driverinfo.css";
import {
  DirectionsCarFilledRounded,
  AssignmentOutlined,
  PhoneRounded,
  EmailRounded,
  RoomRounded,
} from "@mui/icons-material";

const getAvatar = (gender) => {
  if (gender?.toLowerCase() === "male") {
    return "https://i.pravatar.cc/150?img=12";
  } else if (gender?.toLowerCase() === "female") {
    return "https://i.pravatar.cc/150?img=47";
  } else {
    return "https://i.pravatar.cc/150";
  }
};

export default function DriverInfoWindow({ driver, position }) {
  if (!driver) return null;

  const avatar = driver?.profilePic || getAvatar(driver?.gender);

  return (
    <div
      className="driver-info-window"
      style={{ top: position.y, left: position.x }}
    >
      <img src={avatar} alt={driver.name} className="info-window-avatar" />

      <div className="info-window-details">
        <p className="info-window-name">{driver.name}</p>

        <p className="info-window-vehicle">
          <DirectionsCarFilledRounded className="info-window-icon" />
          {driver.vehicle_type} ({driver.vehicle_color})
        </p>
        <p className="info-window-reg">
          <AssignmentOutlined className="info-window-icon" />
          {driver.registration_number}
        </p>
        <p className="info-window-phone">
          <PhoneRounded className="info-window-icon" />
          {driver.phone_number}
        </p>
        <p className="info-window-email">
          <EmailRounded className="info-window-icon" />
          {driver.email}
        </p>
        <p className="info-window-coords">
          <RoomRounded className="info-window-icon" />
          {driver.latitude?.toFixed(4)}, {driver.longitude?.toFixed(4)}
        </p>

        {/* Link to details page */}
        {/* <Link to={`/driver/${driver.id}`} className="info-window-link">View profile →</Link> */}
      </div>
    </div>
  );
}