import { useEffect, useState } from "react";
import "./widgetLg.css";
import axiosInstance from "../../api/axiosInstance";

export default function WidgetLg() {
  const StatusPill = ({ type }) => (
    <span className={"widgetLgStatusPill " + type}>{type}</span>
  );

  const [newDrivers, setNewDrivers] = useState([]);

  useEffect(() => {
    const getNewDrivers = async () => {
      try {
        const res = await axiosInstance.get(`/admin/drivers?new=true`);
        setNewDrivers(res.data.drivers);
      } catch (error) {
        console.log(error);
      }
    };
    getNewDrivers();
  }, []);

  return (
    <div className="widgetLg">
      <h3 className="widgetLgTitle">New Drivers Status</h3>
      <div className="widgetLgTableWrap">
        <table className="widgetLgTable">
          <thead>
            <tr>
              <th className="widgetLgTh">Driver</th>
              <th className="widgetLgTh">Email</th>
              <th className="widgetLgTh">Phone</th>
              <th className="widgetLgTh">Vehicle</th>
              <th className="widgetLgTh">Status</th>
            </tr>
          </thead>
          <tbody>
            {newDrivers.map((driver) => (
              <tr className="widgetLgTr" key={driver._id}>
                <td className="widgetLgUser">
                  <img
                    src={
                      driver.profilePic ||
                      "https://images.pexels.com/photos/4172933/pexels-photo-4172933.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                    }
                    alt={driver.name}
                    className="widgetLgImg"
                  />
                  <span className="widgetLgName">{driver.name}</span>
                </td>
                <td className="widgetLgCell">{driver.email}</td>
                <td className="widgetLgCell">{driver.phone_number}</td>
                <td className="widgetLgCell">{driver.vehicle_type}</td>
                <td>
                  <StatusPill type={driver.is_approved ? "Approved" : "Pending"} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {newDrivers.length === 0 && <p className="widgetLgEmpty">No new drivers yet.</p>}
      </div>
    </div>
  );
}