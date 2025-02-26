import { response, request } from "express";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../Users/user.model.js';

export const login = async (req = request, res = response) => {
    const { email, username, password } = req.body;

    try {
        let user;
        if (email) {
            user = await User.findOne({ email });
        } else if (username) {
            user = await User.findOne({ username });
        } else {
            return res.status(400).json({
                msg: 'Debe proporcionar un correo electrónico o un nombre de usuario'
            });
        }

        if (!user) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos'
            });
        }

        const validPassword = bcryptjs.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }

        const token = jwt.sign({ uid: user._id }, process.env.SECRETORPRIVATEKEY, { expiresIn: '1h' });

        res.json({
            user,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
};




export const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        if (role === 'ADMIN_ROLE') {
            const adminExists = await User.findOne({ role: 'ADMIN_ROLE' });
            if (adminExists) {
                return res.status(400).json({
                    success: false,
                    msg: 'Ya existe un usuario con el rol de ADMIN_ROLE',
                });
            }
        }

        const user = new User({ username, email, password, role });

        const salt = bcryptjs.genSaltSync(10);
        user.password = bcryptjs.hashSync(password, salt);

        await user.save();

        res.status(201).json({
            success: true,
            msg: 'Usuario registrado correctamente',
            user
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            msg: 'Error al registrar usuario',
        });
    }
};