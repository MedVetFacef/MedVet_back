import express from "express";
import {
  getVets,
  newVet,
  getVetbyID,
  updateVetbyID,
  deleteVetbyID,
} from "../controllers/vetControllers.js";
import { isAuthenticated } from "../middleware/auth.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

router.route("/vets").get(getVets);

// Criar consulta - apenas admin pode criar
router.route("/admin/vets").post(isAuthenticated, isAdmin, newVet);

router.route("/vets/:id").get(getVetbyID);

// Atualizar e deletar - apenas admin
router.route("/vets/:id").put(isAuthenticated, isAdmin, updateVetbyID);

router.route("/vets/:id").delete(isAuthenticated, isAdmin, deleteVetbyID);

export default router;
