const express = require('express');
const  movieCtrl = require('../controllers/carta.controller');
const router = express.Router();

router.get('/', movieCtrl.getMovies);
router.get('/carta/:id', movieCtrl.getMovie);
router.post('/publicar', movieCtrl.addMovie);
router.put('/editar/:id', movieCtrl.updateMovie);
router.delete('/eliminar/:id', movieCtrl.deleteMovie);

module.exports = router;