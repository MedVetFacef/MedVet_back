import express from "express";
import { clinicControllers } from "../controllers/clinicControllers.js";
import { isAuthenticated } from "../middleware/auth.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

// GET /clinics - listar todas as clínicas (público, sem autenticação)
router.get("/", clinicControllers.list);

// POST /clinics - criar clínica (apenas admin autenticado)
router.post("/", isAuthenticated, isAdmin, clinicControllers.create);

// GET /clinics/:id - buscar clínica por ID (público, sem autenticação)
router.get("/:id", clinicControllers.getById);

// PUT /clinics/:id - atualizar clínica (apenas admin autenticado)
router.put("/:id", isAuthenticated, isAdmin, clinicControllers.update);

// DELETE /clinics/:id - deletar clínica (apenas admin autenticado)
router.delete("/:id", isAuthenticated, isAdmin, clinicControllers.delete);

export default router;
