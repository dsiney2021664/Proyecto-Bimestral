import { Router } from "express";
import { getAllBills } from "./bill.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";

const router = Router();

router.get("/", [
    validarCampos,
], getAllBills);


export default router;
