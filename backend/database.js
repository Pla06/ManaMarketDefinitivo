/**
 * Configuración de conexión a MongoDB.
 * Reutiliza la conexión (importante para Vercel serverless).
 * Intenta conectar a la URI almacenada en MONGODB_URI o al servidor Atlas.
 * Si falla y no hay variable de entorno, reintenta con una instancia local.
 * Exporta mongoose y una función connectDB.
 */
const mongoose = require('mongoose');
require('dotenv').config();

const LOCAL_URI = 'mongodb+srv://Mario:MarioYHéctor@cluster0.bbf5bdv.mongodb.net/ManaMarket?appName=Cluster0';
const URI = process.env.MONGODB_URI || LOCAL_URI;

let mongooseConnection = null;

async function connectDB() {
    if (mongooseConnection) {
        return mongooseConnection;
    }

    try {
        mongooseConnection = await mongoose.connect(URI);
        console.log(`DB is connected (${URI.includes('127.0.0.1') ? 'local' : 'atlas'})`);
        return mongooseConnection;
    } catch (err) {
        if (!process.env.MONGODB_URI) {
            console.error('Atlas connection failed:', err.message);
            console.log('Trying local MongoDB at mongodb://127.0.0.1:27017/ManaMarket ...');
            try {
                mongooseConnection = await mongoose.connect(LOCAL_URI);
                console.log('DB is connected (local fallback)');
                return mongooseConnection;
            } catch (localErr) {
                console.error('Local MongoDB connection failed:', localErr.message);
                throw localErr;
            }
        }

        console.error('Database connection error:', err.message);
        throw err;
    }
}

module.exports = { mongoose, connectDB };