const express = require('express');
const cartaCtrl = require('../controllers/carta.controller');
const router = express.Router();

router.get('/', cartaCtrl.getCartas);
router.get('/carta/:id', cartaCtrl.getCarta);
router.post('/publicar', cartaCtrl.addCarta);
router.put('/editar/:id', cartaCtrl.updateCarta);
router.delete('/eliminar/:id', cartaCtrl.deleteCarta);

module.exports = router;