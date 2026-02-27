/**
 * Esquema de pedidos (orders).
 * Similar al carrito pero incluye total y estado de pago/envío.
 */
const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const orderItemSchema = new Schema(
    {
        cardId: { type: Schema.Types.ObjectId, ref: 'Card', required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 }
    },
    { _id: false }
);

const orderSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        items: { type: [orderItemSchema], default: [] },
        total: { type: Number, required: true, min: 0 },
        status: { type: String, default: 'pending', trim: true }
    },
    { versionKey: false, timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema, 'orders2026');
