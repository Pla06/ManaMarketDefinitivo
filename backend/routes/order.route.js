/**
 * Rutas para pedidos (orders).
 * CRUD estándar con order.controller.
 */
const express = require('express');
const orderCtrl = require('../controllers/order.controller');
const router = express.Router();

router.get('/', orderCtrl.getOrders);
router.get('/:id', orderCtrl.getOrder);
router.post('/', orderCtrl.addOrder);
router.put('/:id', orderCtrl.updateOrder);
router.delete('/:id', orderCtrl.deleteOrder);

module.exports = router;
