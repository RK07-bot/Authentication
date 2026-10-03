import express from "express"
import validate from "../middlewares/validate.middleware.js";
import { loginSchema, registerSchema, verifyOtpSchema } from "../validators/auth.validator.js";
import { changePassword, forgotPassword, getMyProfile, loginUser, logoutUser, refreshAccessToken, registerUser, resendOtp, verifyOtp, verifyUser } from "../controllers/auth.controller.js";
import { isAuthenticated} from "../middlewares/auth.middleware.js"

const authRouter=express.Router();

authRouter.post("/register",validate(registerSchema),registerUser);
authRouter.post("/verify/:token",verifyUser);
authRouter.post("/login",validate(loginSchema),loginUser);
authRouter.post("/forgot-password",forgotPassword);
authRouter.post("/verify",validate(verifyOtpSchema),verifyOtp);
authRouter.post("/change-password",changePassword);
authRouter.post("/resend-otp",resendOtp);
authRouter.get("/me", isAuthenticated,getMyProfile);
authRouter.post("/refresh",refreshAccessToken);
authRouter.post("/logout",isAuthenticated,logoutUser);

export default authRouter;