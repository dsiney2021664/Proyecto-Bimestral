import { Router } from "express";
import { check } from "express-validator";
import {
    createShoppingCart,
    deleteShoppingCart,
} from "./cart.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import {tieneRole} from "../middlewares/validar-roles.js"

const router = Router();

router.post("/", [
    validarJWT,
    tieneRole('CLIENT_ROLE'),
    validarCampos
], createShoppingCart);


router.delete("/:cartId", [
    validarJWT,
    tieneRole('CLIENT_ROLE')
], deleteShoppingCart);

export default router;
