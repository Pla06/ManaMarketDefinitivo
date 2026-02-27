/**
 * Rutas para el recurso «cards».
 * Se utiliza un controlador con métodos CRUD y algunas compatibilidades
 * con nombres antiguos.
 */
const express = require('express');
const cardCtrl = require('../controllers/card.controller');
const router = express.Router();

router.get('/', cardCtrl.getCards); // supports pagination via ?page=&limit=
router.get('/collections', cardCtrl.getCollections);
router.get('/card/:id', cardCtrl.getCard); // Backward compatibility
router.get('/movie/:id', cardCtrl.getCard); // Backward compatibility
router.get('/:id', cardCtrl.getCard);
router.post('/', cardCtrl.addCard);
router.put('/:id', cardCtrl.updateCard);
router.delete('/:id', cardCtrl.deleteCard);

module.exports = router;