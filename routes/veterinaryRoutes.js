import { Router } from "express";
import { veterinaryControllers } from "../controllers/veterinaryControllers.js";
import { isAuthenticated } from "../middleware/auth.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = Router();

router.post("/", isAuthenticated, isAdmin, veterinaryControllers.create);
router.get("/", veterinaryControllers.list);
router.get("/:id", veterinaryControllers.getById); 
router.put("/:id", isAuthenticated, isAdmin, veterinaryControllers.update);
router.delete("/:id", isAuthenticated, isAdmin, veterinaryControllers.delete);

export default router;
