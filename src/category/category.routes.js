import { Router } from "express";
import { check } from "express-validator";
import {
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
} from "./category.controller.js";
import {
    existeCategoryById,
} from "../helpers/db-validators.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { tieneRole } from "../middlewares/validar-roles.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();


router.get("/",
    getCategory);

router.post("/",
    [
        validarJWT,
        tieneRole('ADMIN_ROLE'),
    ],
    createCategory);

router.put("/:id",
    [
        validarJWT,
        tieneRole('ADMIN_ROLE'),
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeCategoryById),
        validarCampos,
        
    ],
    updateCategory);

router.delete(
    "/:id",
    [
        validarJWT,
        tieneRole('ADMIN_ROLE'),
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeCategoryById),
        validarCampos,
        
    ],
    deleteCategory);

export default router;