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


export const updateAdmin = async (req, res = response) => {
    const { id } = req.params;
    const { _id, role, name, lastName, email, ...rest } = req.body;

    const userId = req.user.id;

    const currentUser = await User.findById(userId);
    if (currentUser.role !== "ADMIN_ROLE") {
        return res.status(400).json({
            msg: "Solo el admin puede actualizar el role"
        })
    }

    if (!["ADMIN_ROLE", "CLIENT_ROLE"].includes(role)) {
        return res.status(400).json({
            msg: "Los unicos roles validos son ADMIN_ROLE o CLIENT_ROLE"
        })
    }

    const updatedFields = { role, name, lastName, email, ...rest };
    await User.findByIdAndUpdate(id, { $set: updatedFields });
    await User.findByIdAndUpdate(id, { role });
    const user = await User.findOne({ _id: id });

    res.status(200).json({
        msg: 'Usuario Actualizado',
        user,
    });
}

export const updateClient = async (req, res = response) => {
    const { id } = req.params;
    const { _id, name, lastName, email, password, ...rest } = req.body;

    if (req.user.id !== id) {
        return res.status(401).json({
            msg: "No tienes permiso para actualizar este usuario"
        });
    }

    const updatedFields = {};
    if (name)
        updatedFields.name = name;
    if (lastName)
        updatedFields.lastName = lastName;
    if (email)
        updatedFields.email = email;
    if (password) {
        const salt = bcryptjs.genSaltSync();
        updatedFields.password = bcryptjs.hashSync(password, salt);
    }

    await User.findByIdAndUpdate(id, updatedFields);

    const user = await User.findById(id);

    res.status(200).json({
        msg: 'Perfil de usuario actualizado',
        user,
    });
}

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { state: false });
    const authenticatedUser = req.user;
    res.status(200).json({ msg: 'Usuario desactivado', user, authenticatedUser });
}