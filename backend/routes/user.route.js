/**
 * Rutas de usuarios.
 * Gestionan recursos de usuario a través de user.controller.
 */
const express = require('express');
const userCtrl = require('../controllers/user.controller');
const router = express.Router();

router.get('/', userCtrl.getUsers);
router.get('/:id', userCtrl.getUser);
router.post('/', userCtrl.addUser);
router.put('/:id', userCtrl.updateUser);
router.delete('/:id', userCtrl.deleteUser);

module.exports = router;
