import React from "react";
import "./css/Profile.css"; // Import the CSS for styling
import { useSelector } from "react-redux";

const Profile = () => {
  const { userData } = useSelector((state) => state.auth?.auth);
  return (
    <div id="mainProfile">
      <div className="side-menu">
        <div className="profile-card">
          <div className="profile-avatar">{userData?.name[0]}</div>
          <h2 className="profile-name">{userData?.name}</h2>
          <p className="profile-status online" style={{paddingBottom:"5px"}}>{userData?.status || "online"}</p >
          <p>
            <strong>Email:</strong> {userData?.email}
          </p>
          <hr />
        </div>
      </div>
      <div className="profile-details" style={{ height: "fit-content" }}>
        <p className="p">
          <h3>LogOut</h3>
        </p>
      </div>
    </div>
  );
};

export default Profile;
