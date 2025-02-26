import { Router } from "express";
import { check } from "express-validator";
import { getCategories, createCategory, updateCategory, deleteCategory } from "./category.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-roles.js";

const router = Router();

router.get("/", getCategories);

router.post(
    "/",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        check("name", "El nombre de la categoría es obligatorio").not().isEmpty(),
        check("description", "La descripción de la categoría es obligatoria").not().isEmpty(),
        validarCampos
    ],
    createCategory
);

router.put(
    "/:id",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        check("id", "No es un ID válido").isMongoId(),
        check("name", "El nombre de la categoría es obligatorio").not().isEmpty(),
        check("description", "La descripción de la categoría es obligatoria").not().isEmpty(),
        validarCampos
    ],
    updateCategory
);

router.delete(
    "/:id",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        check("id", "No es un ID válido").isMongoId(),
        validarCampos
    ],
    deleteCategory
);

export default router;