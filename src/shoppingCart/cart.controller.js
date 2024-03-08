import ShoppingCart from './cart.model.js';
import Product from '../products/product.model.js';
import User from '../user/user.model.js';

export const createShoppingCart = async (req, res) => {
    const { userId, items } = req.body;

    try {
        // Verificar si el usuario existe
        const userExists = await User.findById(userId);

        if (!userExists) {
            return res.status(404).json({ message: 'El usuario no existe' });
        }

        // Verificar si los productos existen y calcular el precio total
        let totalPrice = 0;
        const cartItems = await Promise.all(items.map(async (item) => {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `El producto con ID ${item.product} no existe` });
            }
            const itemTotalPrice = product.price * item.quantity;
            totalPrice += itemTotalPrice;
            return {
                product: item.product,
                quantity: item.quantity,
                price: product.price
            };
        }));

        // Crear el carrito de compras
        const shoppingCart = new ShoppingCart({
            user: userId,
            items: cartItems,
            totalPrice: totalPrice
        });

        // Guardar el carrito en la base de datos
        await shoppingCart.save();

        res.status(201).json({ message: 'Carrito de compras creado exitosamente', shoppingCart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el carrito de compras' });
    }
};

export const getShoppingCartById = async (req, res) => {
    const { id } = req.params;

    try {
        const shoppingCart = await ShoppingCart.findById(id).populate('items.product');
        if (!shoppingCart) {
            return res.status(404).json({ message: 'Carrito de compras no encontrado' });
        }
        res.status(200).json({ shoppingCart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el carrito de compras' });
    }
};