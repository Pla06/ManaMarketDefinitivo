/**
 * Rutas para carritos de compra.
 * Exponen operaciones básicas usando cart.controller.
 */
const express = require('express');
const cartCtrl = require('../controllers/cart.controller');
const router = express.Router();

router.get('/', cartCtrl.getCarts);
router.get('/:id', cartCtrl.getCart);
router.post('/', cartCtrl.addCart);
router.put('/:id', cartCtrl.updateCart);
router.delete('/:id', cartCtrl.deleteCart);

module.exports = router;
