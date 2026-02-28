const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const cartasSchema = new Schema({
        nombre: {type: String, required: true},
        año: {type: Number, required: true},
        expansion: {type: String, required: true},
        precio: {type: Number, required: true},
        rareza: [{type: String, required: true}],
        texto: {type: String, required: true},
        imagen: {type: String, required: true}
    },

    {versionKey: false,
         timestamps: true
    }
    );

module.exports = mongoose.model('Cartas', cartasSchema, 'cartas2026');