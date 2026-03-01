const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const cartasSchema = new Schema({
        // Campos en inglés utilizados por los frontends
        name: { type: String },
        collection: { type: String },
        rarity: { type: String },
        type: { type: String },
        price: { type: Number },
        stock: { type: Number },
        language: { type: String },
        condition: { type: String },
        imageUrl: { type: String },

        // Campos legacy en español (compatibilidad hacia atrás)
        nombre: {type: String},
        year: {type: Number},
        expansion: {type: String},
        precio: {type: Number},
        rareza: {type: String},
        texto: {type: String},
        imagen: {type: String}
    },

    {
        versionKey: false,
        timestamps: true,
        // Permitimos campos adicionales por si hay documentos antiguos con otras propiedades
        strict: false,
    }
    );

// Usar la colección existente 'cartas' en la base de datos
module.exports = mongoose.model('Cartas', cartasSchema, 'cartas');