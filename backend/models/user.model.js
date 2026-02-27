/**
 * Esquema de usuarios.
 * Contiene nombre y email únicos.
 */
const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const userSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, unique: true }
    },
    { versionKey: false, timestamps: true }
);

module.exports = mongoose.model('User', userSchema, 'users2026');
