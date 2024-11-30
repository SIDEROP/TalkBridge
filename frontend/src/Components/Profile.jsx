import React from "react";
import "./css/Profile.css"; // Import the CSS for styling
import { useSelector } from "react-redux";

const Profile = () => {
  const { userData } = useSelector((state) => state.auth?.auth);

  return (
    <div className="side-menu">
      <div className="profile-card">
        <div className="profile-avatar">U</div>
        <h2 className="profile-name">John Doe</h2>
        <p className="profile-status online">Online</p>
        <div className="profile-details" style={{height:"fit-content"}}>
          <p>
            <strong>Email:</strong> john.doe@example.com
          </p>
          <p>
            <strong>Status:</strong> Active
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
