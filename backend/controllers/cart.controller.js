/**
 * Controlador de carritos de compra.
 * Funciones CRUD para interactuar con el modelo Cart.
 */
const Cart = require('../models/cart.model');
const cartCtrl = {};

// Obtener todos los carritos
cartCtrl.getCarts = async (req, res) => {
    await Cart.find()
        .then((data) => res.status(200).json({ status: data }))
        .catch((err) => res.status(400).json({ status: err }));
};

// Obtener un carrito por ID
cartCtrl.getCart = async (req, res) => {
    await Cart.findById(req.params.id)
        .then((data) => {
            if (data != null) res.status(200).json({ status: data });
            else res.status(404).json({ status: 'Cart not found' });
        })
        .catch((err) => res.status(400).json({ status: err }));
};

// Agregar un carrito nuevo
cartCtrl.addCart = async (req, res) => {
    const cart = new Cart(req.body);
    await cart.save()
        .then(() => res.status(201).json({ status: 'Cart Successfully Inserted' }))
        .catch((err) => res.status(400).json({ status: err }));
};

// Actualizar un carrito
cartCtrl.updateCart = async (req, res) => {
    const cart = req.body;
    await Cart.findByIdAndUpdate(
        req.params.id,
        { $set: cart },
        { new: true }
    )
        .then((data) => {
            if (data) res.status(200).json({ status: 'Cart Successfully Updated' });
            else res.status(404).json({ status: 'Cart not found' });
        })
        .catch((err) => res.status(400).json({ status: err }));
};

// Eliminar un carrito
cartCtrl.deleteCart = async (req, res) => {
    await Cart.findByIdAndDelete(req.params.id)
        .then((data) => {
            if (data) res.status(200).json({ status: 'Cart Successfully Deleted' });
            else res.status(404).json({ status: 'Cart not found' });
        })
        .catch((err) => res.status(400).json({ status: err }));
};

module.exports = cartCtrl;
