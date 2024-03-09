import { Router } from "express";
import { createBuy } from "./buy.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarCampos } from "../middlewares/validar-campos.js";

const router = Router();

// Ruta para crear una compra
router.post("/", [
    validarJWT, // Validar token JWT
    validarCampos // Validar campos de la solicitud
], createBuy);

export default router;
