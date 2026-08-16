import "./widgetSm.css";
import { Visibility } from '@mui/icons-material';
import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function WidgetSm() {
  const [newUsers, setNewUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getNewUsers = async () => {
      try {
        const res = await axiosInstance.get(`/admin/users?new=true`);
        setNewUsers(res.data.users);
      } catch (error) {
        console.log(error);
      }
    };
    getNewUsers();
  }, []);

  return (
    <div className="widgetSm">
      <span className="widgetSmTitle">New Join Members</span>
      <ul className="widgetSmList">
        {newUsers.map((user) => (
          <li className="widgetSmListItem" key={user._id}>
            <img
              src={user.profilePic || '/assets/images/logo/IconOnly.png'}
              alt=""
              className="widgetSmImg"
            />
            <div className="widgetSmUser">
              <span className="widgetSmUsername">{user.name}</span>
              <span className="widgetSmUserTitle">{user.email}</span>
            </div>
            <button className="widgetSmButton" onClick={() => {
              navigate(`/user/${user._id}`, {
                state: { userId: user._id },
              })
            }}>
              <Visibility className="widgetSmIcon" />
              View
            </button>
          </li>
        ))}
        {newUsers.length === 0 && <p className="widgetSmEmpty">No new members yet.</p>}
      </ul>
    </div>
  );
}