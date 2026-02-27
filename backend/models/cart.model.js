/**
 * Esquema de carritos de compra.
 * Cada carrito tiene referencia a un usuario, lista de items y estado.
 */
const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const cartItemSchema = new Schema(
    {
        cardId: { type: Schema.Types.ObjectId, ref: 'Card', required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 }
    },
    { _id: false }
);

const cartSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        items: { type: [cartItemSchema], default: [] },
        status: { type: String, default: 'open', trim: true }
    },
    { versionKey: false, timestamps: true }
);

module.exports = mongoose.model('Cart', cartSchema, 'carts2026');
