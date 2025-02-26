import { Router } from "express";
import { check } from "express-validator";
import { editarPerfil, getUsers } from "../Users/user.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.get("/", getUsers);

router.put(
    "/update",
    [
        validarJWT,
        check('username', 'El nombre de usuario es obligatorio si deseas cambiarlo').optional().not().isEmpty(),
        check('password', 'La contraseña actual es obligatoria si deseas cambiarla').optional().not().isEmpty(),
        check('newPassword', 'La nueva contraseña debe tener al menos 8 caracteres').optional().isLength({ min: 6 }),
        validarCampos
    ],
    editarPerfil
);


export default router;
