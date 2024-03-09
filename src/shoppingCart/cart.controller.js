import ShoppingCart from './cart.model.js';
import Product from '../products/product.model.js';
import User from '../user/user.model.js';

export const createShoppingCart = async (req, res) => {
    const { userId, items } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'El usuario no existe' });
        }

        let shoppingCart = await ShoppingCart.findOne({ user: userId });

        if (!shoppingCart) {
            let totalPrice = 0;

            const cartItems = await Promise.all(items.map(async (item) => {
                const product = await Product.findById(item.product);
                if (!product) {
                    return res.status(400).json({
                        msg: `El producto con ID ${item.product} no existe`
                    });
                }

                if (product.quantityInStock < item.quantity) {
                    return res.status(400).json({
                        msg: `No hay suficientes unidades de ${product.name} en el stock`
                    });
                }

                const itemTotalPrice = product.price * item.quantity;
                totalPrice += itemTotalPrice;

                product.quantityInStock -= item.quantity;

                if (product.quantityInStock === -1) {
                    return res.status(400).json({
                        msg: `Ya no hay más unidades de ${product.name} en el stock`
                    });
                }

                await product.save();

                // Solo guardar la identificación del producto en el carrito
                return {
                    product: product._id, // Almacenar solo la identificación del producto
                    quantity: item.quantity,
                    price: product.price
                };
            }));

            shoppingCart = new ShoppingCart({
                user: userId,
                items: cartItems,
                totalPrice: totalPrice
            });
        } else {
            for (const item of items) {
                const product = await Product.findById(item.product);
                if (!product) {
                    return res.status(404).json({ message: `El producto con ID ${item.product} no existe` });
                }

                if (product.quantityInStock < item.quantity) {
                    return res.status(400).json({
                        msg: `No hay suficientes unidades de ${product.name} en el stock`
                    });
                }

                const existingItemIndex = shoppingCart.items.findIndex(cartItem => cartItem.product.id === item.product);
                if (existingItemIndex !== -1) {
                    shoppingCart.items[existingItemIndex].quantity += item.quantity;
                } else {
                    shoppingCart.items.push({
                        product: product._id,
                        quantity: item.quantity,
                        price: product.price
                    });
                }
                shoppingCart.totalPrice += product.price * item.quantity;

                product.quantityInStock -= item.quantity;

                if (product.quantityInStock === -1) {
                    return res.status(400).json({
                        msg: `Ya no hay más unidades de ${product.name} en el stock`
                    });
                }

                await product.save();
            }
        }

        await shoppingCart.save();

        res.status(201).json({ message: 'Carrito de compras creado o actualizado exitosamente', shoppingCart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear o actualizar el carrito de compras' });
    }
};

export const deleteShoppingCart = async (req, res) => {
    const { cartId } = req.params;

    try {
        const shoppingCart = await ShoppingCart.findById(cartId);
        if (!shoppingCart) {
            return res.status(404).json({ message: 'El carrito de compras no existe' });
        }

        await ShoppingCart.findByIdAndDelete(cartId);

        res.status(200).json({ message: 'Carrito de compras eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar el carrito de compras:', error);
        res.status(500).json({ message: 'Error al eliminar el carrito de compras' });
    }
};