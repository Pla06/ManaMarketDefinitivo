/**
 * Esquema de MongoDB para colección de cartas (cards).
 * Define campos como nombre, colección, precio, idioma, etc.
 */
const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const cardSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        collection: { type: String, required: true, trim: true },
        rarity: { type: String, required: true, trim: true },
        type: { type: String, required: true, trim: true },
        price: { type: Number, required: true, min: 0 },
        stock: { type: Number, required: true, min: 0 },
        language: { type: String, required: true, trim: true },
        condition: { type: String, required: true, trim: true },
        imageUrl: { type: String, required: true, trim: true }
    },
    { versionKey: false, timestamps: true }
);

module.exports = mongoose.model('Card', cardSchema, 'cards2026');