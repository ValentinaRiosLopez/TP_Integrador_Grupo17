import { Router } from "express";
import ControladorModo from "../controllers/controladorModo.js"
import controladorModo from "../controllers/controladorModo.js";

const router = Router();

router.post("/api/modo", controladorModo.setModo);

router.get("/api/modo", controladorModo.getModo);

export default router;