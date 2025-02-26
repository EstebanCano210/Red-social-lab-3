import { Router } from "express";
import { check } from "express-validator";
import { getPublications, createPublication, updatePublication, deletePublication } from "./publication.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.get("/", getPublications);

router.post(
    "/",
    [
        validarJWT,
        check("title", "El título es obligatorio").not().isEmpty(),
        check("category", "La categoría es obligatoria").isMongoId(),
        check("content", "El contenido es obligatorio").not().isEmpty(),
        validarCampos // Validar los campos
    ],
    createPublication
);

router.put(
    "/:id",
    [
        validarJWT,
        check("id", "No es un ID válido").isMongoId(),
        validarCampos
    ],
    updatePublication
);

router.delete(
    "/:id",
    [
        validarJWT, 
        check("id", "No es un ID válido").isMongoId(),
        validarCampos
    ],
    deletePublication
);

export default router;