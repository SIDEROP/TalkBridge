import { Router } from "express";
import { generateOtp,verifyOtp,register,logout,login,relogin } from "../controllers/Auth.contr.js";

const router = Router();

router
.post("/generateOtp", generateOtp)
.post("/register", register)
.post("/verifyOtp", verifyOtp)
.post("/login", login)
.get("/relogin", relogin)
.get("/logout", logout)

export default router;