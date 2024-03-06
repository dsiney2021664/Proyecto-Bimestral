import { Router } from "express";
import { check } from "express-validator";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "./user.controller.js";
import {
  existenteEmail,
  esRoleValido,
  existeUsuarioById,
} from "../helpers/db-validators.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.get("/", getUsers);

router.post(
  "/",
  [
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("password", "El password debe ser mayor a 6 caracteres").isLength({
      min: 6,
    }),
    check("email", "Este no es un correo válido").isEmail(),
    check("email").custom(existenteEmail),
    check("role").custom(esRoleValido),
    validarCampos,
  ],
  createUser
);

router.put(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeUsuarioById),
    validarCampos,
    validarJWT
  ],
  updateUser
);

router.delete(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeUsuarioById),
    validarCampos,
    validarJWT
  ],
  deleteUser
);


export default router;
