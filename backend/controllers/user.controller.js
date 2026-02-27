/**
 * Controlador de usuarios.
 * Métodos para obtener, crear, actualizar y borrar usuarios.
 */
const User = require('../models/user.model');
const userCtrl = {};

// Obtener todos los usuarios
userCtrl.getUsers = async (req, res) => {
    await User.find()
        .then((data) => res.status(200).json({ status: data }))
        .catch((err) => res.status(400).json({ status: err }));
};

// Obtener un usuario por ID
userCtrl.getUser = async (req, res) => {
    await User.findById(req.params.id)
        .then((data) => {
            if (data != null) res.status(200).json({ status: data });
            else res.status(404).json({ status: 'User not found' });
        })
        .catch((err) => res.status(400).json({ status: err }));
};

// Agregar un usuario nuevo
userCtrl.addUser = async (req, res) => {
    const user = new User(req.body);
    await user.save()
        .then(() => res.status(201).json({ status: 'User Successfully Inserted' }))
        .catch((err) => res.status(400).json({ status: err }));
};

// Actualizar un usuario
userCtrl.updateUser = async (req, res) => {
    const user = req.body;
    await User.findByIdAndUpdate(
        req.params.id,
        { $set: user },
        { new: true }
    )
        .then((data) => {
            if (data) res.status(200).json({ status: 'User Successfully Updated' });
            else res.status(404).json({ status: 'User not found' });
        })
        .catch((err) => res.status(400).json({ status: err }));
};

// Eliminar un usuario
userCtrl.deleteUser = async (req, res) => {
    await User.findByIdAndDelete(req.params.id)
        .then((data) => {
            if (data) res.status(200).json({ status: 'User Successfully Deleted' });
            else res.status(404).json({ status: 'User not found' });
        })
        .catch((err) => res.status(400).json({ status: err }));
};

module.exports = userCtrl;
