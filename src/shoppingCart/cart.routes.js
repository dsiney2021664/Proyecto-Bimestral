import { Router } from "express";
import { check } from "express-validator";
import {
    createShoppingCart,
    getShoppingCartById,
} from "./cart.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.post("/", [
    validarJWT,
    validarCampos
], createShoppingCart);

router.get("/:id", [
    validarJWT,
    validarCampos
], getShoppingCartById);

export default router;
