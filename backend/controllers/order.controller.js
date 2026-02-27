/**
 * Controlador de pedidos.
 * CRUD básico para el modelo Order, usado por las rutas `/orders`.
 */
const Order = require('../models/order.model');
const orderCtrl = {};

// Obtener todos los pedidos
orderCtrl.getOrders = async (req, res) => {
    await Order.find()
        .then((data) => res.status(200).json({ status: data }))
        .catch((err) => res.status(400).json({ status: err }));
};

// Obtener un pedido por ID
orderCtrl.getOrder = async (req, res) => {
    await Order.findById(req.params.id)
        .then((data) => {
            if (data != null) res.status(200).json({ status: data });
            else res.status(404).json({ status: 'Order not found' });
        })
        .catch((err) => res.status(400).json({ status: err }));
};

// Agregar un pedido nuevo
orderCtrl.addOrder = async (req, res) => {
    const order = new Order(req.body);
    await order.save()
        .then(() => res.status(201).json({ status: 'Order Successfully Inserted' }))
        .catch((err) => res.status(400).json({ status: err }));
};

// Actualizar un pedido
orderCtrl.updateOrder = async (req, res) => {
    const order = req.body;
    await Order.findByIdAndUpdate(
        req.params.id,
        { $set: order },
        { new: true }
    )
        .then((data) => {
            if (data) res.status(200).json({ status: 'Order Successfully Updated' });
            else res.status(404).json({ status: 'Order not found' });
        })
        .catch((err) => res.status(400).json({ status: err }));
};

// Eliminar un pedido
orderCtrl.deleteOrder = async (req, res) => {
    await Order.findByIdAndDelete(req.params.id)
        .then((data) => {
            if (data) res.status(200).json({ status: 'Order Successfully Deleted' });
            else res.status(404).json({ status: 'Order not found' });
        })
        .catch((err) => res.status(400).json({ status: err }));
};

module.exports = orderCtrl;
