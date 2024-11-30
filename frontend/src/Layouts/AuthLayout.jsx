import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { reloginUser } from "../Store/app/slicess/authSlice";
import rtcConnection from "../RtcConnections/RtcConnection.jsx";

const AuthLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  rtcConnection();
  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(reloginUser())
        .unwrap()
        .then(() => {
          console.log("Re-login successful");
        })
        .catch((error) => {
          console.error("Re-login failed:", error);
          navigate("/login");
        });
    }
  }, [dispatch, isAuthenticated, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <Outlet />;
};

export default AuthLayout;
