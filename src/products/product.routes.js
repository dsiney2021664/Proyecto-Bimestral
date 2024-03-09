import { Router } from "express";
import { check } from "express-validator";
import {
    getProduct,
    getProductOutOfStock,
    getMostSelledProducts,
    getProductByName,
    getListProductsByCategory,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct,
} from "./product.controller.js";
import {
    existeCategoryById,
} from "../helpers/db-validators.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import {tieneRole} from "../middlewares/validar-roles.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.get("/", [
    validarCampos
], getProduct);

router.get("/outOfStock", [
    validarCampos
], getProductOutOfStock);

router.get("/mostSelledProducts", [
    validarCampos
], getMostSelledProducts);

router.get("/productByName", [
    validarCampos
], getProductByName);

router.get("/listProductsByCategory", [
    validarCampos
], getListProductsByCategory);

router.post("/", [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check("category", "El ID de categoría es obligatorio").isMongoId(),
    check("category").custom(existeCategoryById),
    check("name", "El nombre del producto es obligatorio").notEmpty(),
    check("price", "El precio del producto es obligatorio").notEmpty().isNumeric(),
    check("quantityInStock", "La cantidad en stock es obligatoria").notEmpty().isInt(),
    validarCampos
], createProduct);

router.get("/:id", [
    validarCampos
], getProductById);

router.put("/:id", [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check("category", "El ID de categoría es obligatorio").isMongoId(),
    check("category").custom(existeCategoryById),
    validarCampos
], updateProduct);

router.delete("/:id", [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check("id", "No es un ID de producto válido").isMongoId(),
    validarCampos
], deleteProduct);

export default router;