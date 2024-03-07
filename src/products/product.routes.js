import { Router } from "express";
import { check } from "express-validator";
import {
    getProduct,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct,
} from "./product.controller.js";
import {
    existeCategoryById,
} from "../helpers/db-validators.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.get("/", [
    validarCampos
], getProduct);

router.post("/", [
    validarJWT,
    check("category", "El ID de categoría es obligatorio").isMongoId(),
    check("category").custom(existeCategoryById),
    check("name", "El nombre del producto es obligatorio").notEmpty(),
    check("price", "El precio del producto es obligatorio").notEmpty().isNumeric(),
    check("quantityInStock", "La cantidad en stock es obligatoria").notEmpty().isInt(),
    validarCampos
], createProduct);

router.get("/:id", [
    validarJWT,
    check("id", "No es un ID de producto válido").isMongoId(),
    validarCampos
], getProductById);

router.put("/:id", [
    validarJWT,
    check("id", "No es un ID de producto válido").isMongoId(),
    check("category", "No se puede modificar la categoría").not().exists(),
    check("name", "No se puede modificar el nombre").not().exists(),
    validarCampos
], updateProduct);

router.delete("/:id", [
    validarJWT,
    check("id", "No es un ID de producto válido").isMongoId(),
    validarCampos
], deleteProduct);

export default router;