const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CNN, {});
        console.log('Base de datos conectada exitosamente');
    } catch (e) {
        throw new Error('Error al hacer la conexion de la base de datos', e)
    }
}

module.exports = { dbConnection }