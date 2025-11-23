import express from "express";
import { sendMessage, checkQuota } from "../controllers/chatbotController.js";

const router = express.Router();

router.post("/", sendMessage);
router.get("/quota", checkQuota);

export default router;
