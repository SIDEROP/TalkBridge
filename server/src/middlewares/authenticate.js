import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";

const authenticate = (req, res, next) => {
  const tokenFromHeader =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  const tokenFromCookie = req.cookies.auth_token;

  const token = tokenFromHeader || tokenFromCookie;

  if (!token) {
    return next(new ApiError(401, "No token, authorization denied"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return next(new ApiError(401, "Invalid token"));
  }
};

export default authenticate;
