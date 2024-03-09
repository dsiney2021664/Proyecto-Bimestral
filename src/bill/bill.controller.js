import Bill from './bill.model.js';

// Controlador para obtener todas las facturas
export const getAllBills = async (req, res) => {
    try {
        // Buscar todas las facturas en la base de datos
        const bills = await Bill.find().populate('user').populate('products');

        res.status(200).json({ message: 'Facturas obtenidas exitosamente', bills });
    } catch (error) {
        console.error('Error al obtener las facturas:', error);
        res.status(500).json({ message: 'Error al obtener las facturas', error: error.message });
    }
};
