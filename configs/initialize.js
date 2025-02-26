import User from '../src/Users/user.model.js';
import bcryptjs from 'bcryptjs';

export const initializeAdmin = async () => {
    try {
        const adminExists = await User.findOne({ role: 'ADMIN_ROLE' });

        if (!adminExists) {
            const admin = new User({
                username: 'admin',
                email: 'ecano@gmail.com',
                password: bcryptjs.hashSync('l@_contra', 10), 
                role: 'ADMIN_ROLE',
            });

            await admin.save();
            console.log('Administrador creado automáticamente:', admin);
        } else {
            console.log('Ya existe un administrador en la base de datos.');
        }
    } catch (error) {
        console.error('Error al crear el administrador:', error);
    }
};