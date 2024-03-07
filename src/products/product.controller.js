import { response, request } from "express";
import Product from './product.model.js';

export const getProduct = async (req = request, res = response) => {
    const { limite, desde } = req.query;
    const query = { state: true };

    const [total, product] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .skip(Number(desde))
            .limit(Number(limite)),
    ]);

    res.status(200).json({
        total,
        product,
    });
}

export const createProduct = async (req, res) => {
    const { category, name, price, quantityInStock } = req.body;
    const authenticatedUser = req.user;

    try {
        if(authenticatedUser.role !== "ADMIN_ROLE") {
            return res.status(403).json({
                msg: 'Solo el ADMIN puede agregar un nuevo producto'
            });
        }

        const product = new Product({ category, name, price, quantityInStock });
        await product.save();
        res.status(200).json({
            product,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Ocurrió un error al crear la categoría' });
    }
}


export const getProductById = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findOne({ _id: id });

    res.status(200).json({
        product,
    });
}

export const updateProduct = async (req, res = response) => {
    const { id } = req.params;
    const { _id, quantityInStock, sales, ...rest } = req.body;

    await Product.findByIdAndUpdate(id, rest);

    const product = await Product.findOne({ _id: id });

    res.status(200).json({
        msg: 'Usuario Actualizado',
        product,
    });
}

export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(id, { state: false });

    const authenticatedUser = req.product;

    res.status(200).json({ msg: 'Usuario desactivado', product, authenticatedUser });
}
