// src/components/AlertBox.js
import React from "react";
import "./css/AlertBox.css"; // Create this CSS file for styling

const AlertBox = ({ message, closeAlert }) => {
  return (
    <div className={`alert-box show`}>
      <div className="alert-content">
        <p>{message}</p>
        <button onClick={closeAlert} className="close-btn">
          Close
        </button>
      </div>
    </div>
  );
};

export default AlertBox;
