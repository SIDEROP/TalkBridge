import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  generateOtp,
  verifyOtp,
  loginUser,
  register,
  reloginUser,
} from "../Store/app/slicess/authSlice"; // Import the async thunks
import "./css/Login.css";
import AlertBox from "../Components/AlertBox";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { otpGeneration, otpVerification, auth } = useSelector(
    (state) => state.auth
  );

  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(reloginUser())
        .unwrap()
        .then(() => {
          navigate("/");
        })
        .catch((error) => {
          navigate("/login");
        });
    }
  }, [dispatch, isAuthenticated]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState(""); // State for email
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [username, setUsername] = useState(""); // State for username
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [otpExpiration, setOtpExpiration] = useState(null);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (otpVerification?.alredy) {
      navigate("/");
    }
  }, [otpVerification]);

  const handleOtpChange = (e, index) => {
    const newOtp = [...otp];
    newOtp[index] = e.target.value;

    if (e.target.value.length === 1 && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`).focus();
    }

    setOtp(newOtp);
  };
  const verifyOtpAndLogin = async (otp) => {
    try {
      const otpString = otp.join("");

      const result = await dispatch(verifyOtp({ email, otp: otpString }));

      if (result.meta.requestStatus === "fulfilled") {
        setStep(3);
      } else {
        console.error(
          "OTP verification failed:",
          result.payload?.message || "Unknown error"
        );
        alert("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("An error occurred during OTP verification:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (email.includes("@") && email.includes(".")) {
      try {
        let result = await dispatch(generateOtp(email));
        if (result.type === "auth/generateOtp/fulfilled") {
          setStep(2);
          setAlertMessage("OTP sent to your email.");
          setShowAlert(true);
        }
        setOtpExpiration(Date.now() + 60000); // Set expiration to 1 minute
        setCountdown(60); // Start countdown
      } catch (error) {
        setAlertMessage("Failed to send OTP. Please try again.");
        setShowAlert(true);
      }
    } else {
      setAlertMessage("Please enter a valid email address.");
      setShowAlert(true);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const currentTime = Date.now();
    if (otpExpiration && currentTime > otpExpiration) {
      setAlertMessage("OTP has expired. Please request a new one.");
      setShowAlert(true);
      return;
    }

    if (otp.join("").length === 6) {
      try {
        await verifyOtpAndLogin(otp);
      } catch (error) {
        setAlertMessage("Invalid OTP. Please try again.");
        setShowAlert(true);
      }
    } else {
      setAlertMessage("Please enter a valid 6-digit OTP.");
      setShowAlert(true);
    }
  };

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    if (username) {
      let result = await dispatch(register({ email, name: username }))

      if (result.meta.requestStatus === "fulfilled") {
        dispatch(reloginUser())
        setAlertMessage(`Welcome, ${username}!`);
        setShowAlert(true);
        navigate("/");
      }
    } else {
      setAlertMessage("Please enter a valid username.");
      setShowAlert(true);
    }
  };

  const closeAlert = () => setShowAlert(false);

  useEffect(() => {
    let timer;
    if (countdown > 0 && step === 2) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setAlertMessage("OTP has expired. Please request a new one.");
      setShowAlert(true);
    }

    return () => clearInterval(timer);
  }, [countdown, step]);

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        {step === 1 && (
          <form onSubmit={handleEmailSubmit}>
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <button type="submit">
              {otpGeneration?.loading ? "Loding..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleOtpSubmit}>
            <div className="otp-box">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                  maxLength="1"
                  pattern="[0-9]*"
                  required
                  autoFocus={index === 0}
                />
              ))}
            </div>
            <button
              type="submit"
              disabled={countdown === 0 || otpVerification.loading}
            >
              {
                otpVerification?.loading?"Loding":"Verify OTP"
              }
            </button>
            <div className="timer">
              <p>Time left: {countdown}s</p>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleUsernameSubmit}>
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>
            <button type="submit">
              {
                false?"Loding":"Submit Username"
              }
            </button>
          </form>
        )}
      </div>

      {showAlert && <AlertBox message={alertMessage} closeAlert={closeAlert} />}
    </div>
  );
};

export default Login;
