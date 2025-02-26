import { response, request } from "express";

export const tieneRole = (...roles) => {
    return (req = request, res = response, next) => {
        if (!req.user) {
            return res.status(500).json({
                success: false,
                msg: "Se quiere verificar el rol sin validar el token primero",
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                msg: `Acceso denegado. Se requiere uno de estos roles: ${roles.join(", ")}`,
            });
        }

        next();
    };
};
