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
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();


router.get("/",
    getCategory);

router.post("/",
    [
        validarJWT
    ],
    createCategory);

router.put("/:id",
    [
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeCategoryById),
        validarCampos,
        validarJWT
    ],
    updateCategory);

router.delete(
    "/:id",
    [
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeCategoryById),
        validarCampos,
        validarJWT
    ],
    deleteCategory);

export default router;