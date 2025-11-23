import express from "express";
import { loginUser, registerUser, getCurrentUser, updateProfile, updatePassword } from "../controllers/authControllers.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/me").get(isAuthenticated, getCurrentUser);

router.route("/me/update").put(isAuthenticated, updateProfile);

router.route("/password/update").put(isAuthenticated, updatePassword);

export default router;
