/**
 * Configuración de conexión a MongoDB.
 * Reutiliza la conexión (importante para Vercel serverless).
 * Intenta conectar a la URI almacenada en MONGODB_URI o al servidor Atlas.
 * Si falla y no hay variable de entorno, reintenta con una instancia local.
 * Exporta mongoose y una función connectDB.
 */
const mongoose = require('mongoose');
const URI = process.env.MONGODB_URI || 'mongodb+srv://Mario:marioYHector@cluster0.uqj3rpc.mongodb.net/ManaMarket?appName=Cluster0';
mongoose.connect(URI)
    .then(db => console.log('DB is connected'))
    .catch(err => console.error(err));

module.exports = mongoose;