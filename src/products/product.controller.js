import { response, request } from "express";
import Product from './product.model.js';
import Category from '../category/category.model.js';

export const getProduct = async (req = request, res = response) => {
    const { limite, desde } = req.query;
    const query = { state: true };

    const [total, product] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .skip(Number(desde))
            .limit(Number(limite)),
    ]);

    const productsWithCategoryName = await Promise.all(product.map(async (product) => {
        const category = await Category.findById(product.category);
        const categoryName = category ? category.name : null;

        return {
            ...product.toJSON(),
            category: categoryName
        };
    }));

    res.status(200).json({
        total,
        product: productsWithCategoryName,
    });
}

export const getProductOutOfStock = async (req = request, res = response) => {
    const { limite, desde } = req.query;
    const query = { quantityInStock: 0, state: true };

    const [total, product] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .skip(Number(desde))
            .limit(Number(limite)),
    ]);
    const productsWithCategoryName = await Promise.all(product.map(async (product) => {
        const category = await Category.findById(product.category);
        const categoryName = category ? category.name : null;

        return {
            ...product.toJSON(),
            category: categoryName
        };
    }));

    res.status(200).json({
        total,
        product: productsWithCategoryName,
    });
}

export const getMostSelledProducts = async (req = request, res = response) => {
    const { limite, desde } = req.query;
    const query = { sales: { $gt: 0 }, state: true };
    const sortOptions = { sales: -1 };

    const [total, product] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .sort(sortOptions)
            .skip(Number(desde))
            .limit(Number(limite)),
    ]);
    const productsWithCategoryName = await Promise.all(product.map(async (product) => {
        const category = await Category.findById(product.category);
        const categoryName = category ? category.name : null;

        return {
            ...product.toJSON(),
            category: categoryName
        };
    }));

    res.status(200).json({
        total,
        product: productsWithCategoryName,
    });
}

export const getProductByName = async (req, res) => {
    const { name } = req.query;
    const query = { state: true, name: { $regex: new RegExp(name, 'i') } };

    try {
        const [total, product] = await Promise.all([
            Product.countDocuments(query),
            Product.find(query)
        ]);
        const productsWithCategoryName = await Promise.all(product.map(async (product) => {
            const category = await Category.findById(product.category);
            const categoryName = category ? category.name : null;

            return {
                ...product.toJSON(),
                category: categoryName
            };
        }));

        res.status(200).json({
            total,
            product: productsWithCategoryName,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener productos por nombre' });
    }
};

export const getListProductsByCategory = async (req, res) => {
    const { categoryId, limite, desde } = req.query;

    try {
        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ message: 'La categoría no existe' });
        }

        const query = { category: categoryId, state: true };

        const [total, product] = await Promise.all([
            Product.countDocuments(query),
            Product.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        const productsWithCategoryName = await Promise.all(product.map(async (product) => {
            return {
                ...product.toJSON(),
                category: category.name
            };
        }));

        res.status(200).json({
            total,
            product: productsWithCategoryName,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los productos por categoría' });
    }
};




export const createProduct = async (req, res) => {
    const { category, name, price, quantityInStock } = req.body;
    const product = new Product({ category, name, price, quantityInStock });

    await product.save();
    res.status(200).json({
        product,
    });
}


export const getProductById = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        const category = await Category.findById(product.category);
        const categoryName = category ? category.name : null;

        const productWithCategoryName = {
            ...product.toJSON(),
            category: categoryName
        };

        res.status(200).json({ product: productWithCategoryName });

    } catch (e) {
        console.error(e);
        res.status(500).json({
            msg: 'Error al buscar el producto'
        });
    }
}

export const updateProduct = async (req, res = response) => {
    const { id } = req.params;
    const { _id, sales, ...rest } = req.body;

    await Product.findByIdAndUpdate(id, rest);

    const product = await Product.findOne({ _id: id });

    res.status(200).json({
        msg: 'Usuario Actualizado',
        product,
    });
}

export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.status(200).json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el producto' });
    }
};