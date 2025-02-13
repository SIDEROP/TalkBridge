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
    const value = e.target.value;
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus forward when digit entered
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }

      // Submit automatically when all digits entered
      if (value && index === 5) {
        const otpString = newOtp.join("");
        if (otpString.length === 6) {
          verifyOtpAndLogin(newOtp);
        }
      }
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      document.getElementById(`otp-${index - 1}`).focus();
    }
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
        setAlertMessage("Invalid OTP. Please try again.");
        setShowAlert(true);
      }
    } catch (error) {
      console.error("An error occurred during OTP verification:", error);
      setAlertMessage("Something went wrong. Please try again later.");
      setShowAlert(true);
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
              {otpGeneration?.loading ? "Loading..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form>
            <div className="otp-box">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  maxLength="1"
                  autoFocus={index === 0}
                />
              ))}
            </div>
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
              {auth?.loading ? "Loading..." : "Submit Username"}
            </button>
          </form>
        )}
      </div>

      {showAlert && <AlertBox message={alertMessage} closeAlert={closeAlert} />}
    </div>
  );
};

export default Login;
