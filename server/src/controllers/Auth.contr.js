import speakeasy from "speakeasy";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendOtp } from "../services/otpService.js";

// Generate OTP
export const generateOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const otp = speakeasy.totp({
    secret: process.env.OTP_SECRET,
    encoding: "base32",
    step: 60,
  });

  if (!otp) {
    throw new ApiError(401, "not genret OTP");
  }

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    const newUser = new User({ email, lastOtp: otp });
    await newUser.save({ validateBeforeSave: false });
  }
  existingUser.lastOtp = otp;
  await existingUser.save({ validateBeforeSave: false });

  await sendOtp(email, otp);
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { email },
        "OTP generated and sent successfully. Please verify your OTP."
      )
    );
});

// Verify OTP
export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if ([email, otp].some((data) => !data)) {
    return res
      .status(400)
      .json(new ApiError(400, "Email and otp are required"));
  }

  const user = await User.findOne({ email });

  if (otp !== user.lastOtp) {
    throw new ApiError(401, "otp not mached");
  }

  let token;

  if (user && user?.name) {
    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
  }
  const isOtpValid = speakeasy.totp.verify({
    secret: process.env.OTP_SECRET,
    encoding: "base32",
    token: otp,
    step: 60,
    window: 1,
  });

  if (!isOtpValid) {
    throw new ApiError(401, "Invalid OTP");
  }

  if (user && user?.name) {
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });
  }
  res.status(200).json(
    new ApiResponse(
      200,
      {
        message: "You can proceed with the next steps.",
        user: user.name ? true : false,
        token,
      },
      "OTP verified successfully."
    )
  );
});

export const register = asyncHandler(async (req, res) => {
  const { email, name } = req.body;

  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new ApiError(400, "plz account crete");
  }
  existingUser.name = name;

  await existingUser.save({ validateBeforeSave: false });

  const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    sameSite: "strict",
  });

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { email: existingUser.email, auth_token: token },
        "User registered successfully. Please verify OTP."
      )
    );
});

// Login User
export const login = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res
    .status(200)
    .json(new ApiResponse(200, { email: user.email }, "Login successful."));
});

// Resend OTP
export const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  let token;

  if (user && user?.name) {
    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
  }

  const otp = speakeasy.totp({
    secret: process.env.OTP_SECRET,
    encoding: "base32",
    step: 60,
  });

  user.lastOtp = otp;

  await sendOtp(email, otp);

  await user.save();

  if (user && user?.name) {
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { email: user.email },
        "OTP resent successfully. Please verify your OTP."
      )
    );
});

export const relogin = asyncHandler(async (req, res) => {
  const token =
    req.headers.authorization?.split(" ")[1] || req.cookies.auth_token;

  if (!token) {
    throw new ApiError(401, "No token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    res.status(200).json(
      new ApiResponse(
        200,
        {
          authenticated: true,
          name: user.name,
          email: user.email,
          _id: user._id,
        },
        "Re-login successful."
      )
    );
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      throw new ApiError(401, "Malformed token");
    } else if (err.name === "TokenExpiredError") {
      throw new ApiError(401, "Token expired");
    } else {
      throw err;
    }
  }
});

// Logout User
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("auth_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json(new ApiResponse(200, null, "Logout successful."));
});
