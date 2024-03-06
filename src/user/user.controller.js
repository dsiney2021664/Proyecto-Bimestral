import { response, request } from "express";
import bcryptjs from 'bcryptjs';
import User from './user.model.js';

export const getUsers = async (req = request, res = response) => {
    const { limite, desde } = req.query;
    const query = { state: true };

    const [total, user] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip(Number(desde))
            .limit(Number(limite)),
    ]);

    res.status(200).json({
        total,
        user,
    });
}

export const createUser = async (req, res) => {
    const { name, lastName, email, password, state } = req.body;
    const role = req.body.role || "CLIENT_ROLE";
    const user = new User({ name, lastName, email, password, role, state });

    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    await user.save();

    res.status(200).json({
        user,
    });
}


export const updateUser = async (req, res = response) => {
    const { id } = req.params;
    const { role, name, lastName, password, ...rest } = req.body;
    const authenticatedUser = req.user;

    try {
        if (role) {
            if (authenticatedUser.role !== 'ADMIN_ROLE') {
                return res.status(403).json({
                    msg: "Solo el admin puede cambiar el rol de un usuario"
                });
            }

            if (!["ADMIN_ROLE", "CLIENT_ROLE"].includes(role)) {
                return res.status(400).json({
                    msg: "Los únicos roles válidos son ADMIN_ROLE o CLIENT_ROLE"
                });
            }

            const updatedFields = { role, ...rest };
            await User.findByIdAndUpdate(id, { $set: updatedFields });
            const user = await User.findOne({ _id: id });

            return res.status(200).json({
                msg: 'Usuario Actualizado',
                user,
            });
        }

        if (authenticatedUser.role === 'CLIENT_ROLE' && id === authenticatedUser.id) {
            const updatedFields = {};
            if (name)
                updatedFields.name = name;
            if (lastName)
                updatedFields.lastName = lastName;
            if (password) {
                const salt = bcryptjs.genSaltSync();
                updatedFields.password = bcryptjs.hashSync(password, salt);
            }

            await User.findByIdAndUpdate(id, updatedFields);
            const user = await User.findById(id);

            return res.status(200).json({
                msg: 'Perfil de usuario actualizado',
                user,
            });
        }
     
        if (authenticatedUser.role === 'ADMIN_ROLE') {
            const updatedFields = { name, lastName, ...rest };
            if (password) {
                const salt = bcryptjs.genSaltSync();
                updatedFields.password = bcryptjs.hashSync(password, salt);
            }

            await User.findByIdAndUpdate(id, { $set: updatedFields });
            const user = await User.findOne({ _id: id });

            return res.status(200).json({
                msg: 'Usuario Actualizado',
                user,
            });
        }

        return res.status(403).json({
            msg: 'Solo el ADMIN puede actualizar estos datos'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Ocurrió un error al actualizar el usuario' });
    }
};


export const deleteUser = async (req, res = response) => {
    const { id } = req.params;
    const authenticatedUser = req.user;

    try {
        if (authenticatedUser.role === 'CLIENT_ROLE' && id === authenticatedUser.id) {
            const deletedUser = await User.findByIdAndDelete(id);
            if (!deletedUser) {
                return res.status(404).json({
                    msg: 'Usuario no encontrado'
                });
            }
            return res.status(200).json({
                msg: 'Perfil de usuario eliminado',
                deletedUser,
            });
        }

        if (authenticatedUser.role === 'ADMIN_ROLE') {
            const deletedUser = await User.findByIdAndDelete(id);
            if (!deletedUser) {
                return res.status(404).json({
                    msg: 'Usuario no encontrado'
                });
            }
            return res.status(200).json({
                msg: 'Usuario eliminado',
                deletedUser,
            });
        }

        return res.status(403).json({
            msg: 'Solo el ADMIN puede eliminar otros usuarios'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Ocurrió un error al eliminar el usuario' });
    }
};