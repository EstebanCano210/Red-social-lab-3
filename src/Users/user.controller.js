import bcryptjs from "bcryptjs";
import User from "../Users/user.model.js";
import { response, request } from "express";

export const getUsers = async (req = request, res = response) => {
    try {
        const usuarios = await User.find();

        if (usuarios.length === 0) {
            return res.status(404).json({
                success: false,
                msg: "No se encontraron usuarios"
            });
        }

        res.status(200).json({
            success: true,
            usuarios
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            msg: "Error al obtener los usuarios"
        });
    }
};

export const editarPerfil = async (req = request, res = response) => {
    try {
        const { username, password, newPassword } = req.body;
        const userId = req.user.uid;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: 'Usuario no encontrado'
            });
        }

        if (newPassword) {
            if (!password) {
                return res.status(400).json({
                    success: false,
                    msg: 'La contraseña actual es obligatoria para cambiarla'
                });
            }
            const validPassword = bcryptjs.compareSync(password, user.password);
            if (!validPassword) {
                return res.status(400).json({
                    success: false,
                    msg: 'La contraseña actual es incorrecta'
                });
            }

            const salt = bcryptjs.genSaltSync();
            user.password = bcryptjs.hashSync(newPassword, salt);
        }

        if (username && username !== user.username) {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    msg: 'El nombre de usuario ya está en uso'
                });
            }
            user.username = username;
        }

        await user.save();

        res.status(200).json({
            success: true,
            msg: 'Perfil actualizado correctamente',
            user
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar perfil'
        });
    }
};
