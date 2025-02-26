import { Router } from "express";
import { check } from "express-validator";
import { login, register } from "../Auth/auth.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";

const router = Router();

router.post(
    "/login",
    [
        check('email', 'El correo no es válido').optional().isEmail(),
        check('username', 'El nombre de usuario es obligatorio').optional().not().isEmpty(),
        check('password', 'La contraseña es obligatoria').not().isEmpty(),
        validarCampos
    ],
    login
);

router.post(
    "/register",
    [
        check('username', 'El nombre de usuario es obligatorio').not().isEmpty(),
        check('email', 'El correo es obligatorio').isEmail(),
        check('password', 'La contraseña es obligatoria').not().isEmpty(),
        validarCampos
    ],
    register
);

export default router;