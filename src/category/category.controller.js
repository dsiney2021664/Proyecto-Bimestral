import { response, request } from "express";
import Category from './category.model.js'

export const getCategory = async (req = request, res = response) => {
    const { limite, desde } = req.query;
    const query = { state: true };

    const [total, category] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)
            .skip(Number(desde))
            .limit(Number(limite)),
    ]);

    res.status(200).json({
        total,
        category,
    });
}

export const createCategory = async (req, res) => {
    const { name } = req.body;
    const authenticatedUser = req.user;

    try {
        if (authenticatedUser.role !== 'ADMIN_ROLE') {
            return res.status(403).json({
                msg: "Solo el ADMIN puede agregar una nueva categoria"
            });
        }

        const category = new Category({ name })
        await category.save();

        res.status(200).json({
            category,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Ocurrió un error al crear la categoría' });
    }
}


export const updateCategory = async (req, res = response) => {
    const { id } = req.params;
    const authenticatedUser = req.user;

    try {
        if (authenticatedUser.role !== 'ADMIN_ROLE') {
            return res.status(403).json({
                msg: "Solo el ADMIN puede editar una categoria"
            });
        }

        const { _id, ...rest } = req.body;
        await Category.findByIdAndUpdate(id, rest);
       
        const category = await Category.findOne({ _id: id });

        res.status(200).json({
            msg: 'Usuario Actualizado',
            category,
        });
    }catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Ocurrió un error al crear la categoría' });
    }

}

export const deleteCategory = async (req, res) => {
    const { id } = req.params;
    const authenticatedUser = req.user;

    try {
        if (authenticatedUser.role !== 'ADMIN_ROLE') {
            return res.status(403).json({
                msg: "Solo el ADMIN puede eliminar categorías"
            });
        }
        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            return res.status(404).json({ msg: "La categoría no existe" });
        }

        res.status(200).json({ msg: 'Categoría eliminada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Ocurrió un error al eliminar la categoría' });
    }
}