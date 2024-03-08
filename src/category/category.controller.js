import { response, request } from "express";
import Category from './category.model.js'
import Product from '../products/product.model.js'

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
    const category = new Category({ name })
    await category.save();

    res.status(200).json({
        category,
    });
}


export const updateCategory = async (req, res = response) => {
    const { id } = req.params;
    const { _id, ...rest } = req.body;

    await Category.findByIdAndUpdate(id, rest);

    const category = await Category.findOne({ _id: id });

    res.status(200).json({
        msg: 'Usuario Actualizado',
        category,
    });
}

export const deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const categoryToDelete = await Category.findById(id);

        if (!categoryToDelete) {
            return res.status(404).json({
                msg: 'La categoría no existe'
            });
        }
        const defaultCategory  = await Category.findOne({ name: 'Default' });

        if (!defaultCategory) {
            return res.status(404).json({ msg: 'La categoría "Default" no existe' });
        }

        await Product.updateMany({ category: id }, { category: defaultCategory._id });

        await Category.findByIdAndDelete(id);

        res.status(200).json({ msg: 'Categoría eliminada' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Ocurrió un error al eliminar la categoría' });
    }
}