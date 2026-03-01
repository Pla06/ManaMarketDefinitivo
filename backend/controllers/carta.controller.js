const Carta = require('../models/carta.model');
const mongoose = require('mongoose');
const cartaCtrl = {};

//Funciones CRUD

// Obtener todas las cartas
cartaCtrl.getCartas = async (req, res) => {
    const cartas = await Carta.find()
        .then((data)=>res.status(200).json({status:data}))
        .catch((err)=>res.status(400).json({status:err}));
};

// Obtener una carta por ID
cartaCtrl.getCarta = async (req, res) => {
    const carta = await Carta.findById(req.params.id)
        .then(data=>
        {
            if(data!=null) res.status(200).json({status:data});
            else res.status(404).json({status:'Carta not found'})
        })
        .catch((err)=>res.status(400).json({status:err}));
};

// Agregar una carta nueva
cartaCtrl.addCarta = async (req, res) => {
    // validar campos obligatorios
    let { nombre, year, expansion, precio, rareza, texto, imagen } = req.body;
    if (!nombre || !year || !expansion || !precio || !rareza || !texto || !imagen) {
        return res.status(400).json({status: 'Faltan campos'});
    }

    try {
        // verificar duplicado por nombre
        const existente = await Carta.findOne({ nombre: nombre });
        if (existente) {
            return res.status(400).json({status: 'Carta ya existe'});
        }

        const carta = new Carta(req.body);
        const data = await carta.save();
        return res.status(200).json({status: 'Se ha añadido la carta correctamente', data});
    } catch (err) {
        // devolver mensaje legible y usar código 500 para problemas del servidor/BD
        const message = err && err.message ? err.message : JSON.stringify(err);
        return res.status(500).json({status: message || 'Error desconocido'});
    }
};

// Actualizar una carta
cartaCtrl.updateCarta = async (req, res) => {
    const carta = req.body;
    await Carta.findByIdAndUpdate(
        req.params.id,
        {$set: carta},
        {new: true})
        .then((data)=> {
            if(data)res.status(200).json({status:'Carta Successully Updated'});
            else res.status(404).json({status:'Carta not found'})
        })
        .catch((err)=>res.status(400).json({status:err}));
};

// Eliminar una carta
cartaCtrl.deleteCarta = async (req, res) => {
    await Carta.findByIdAndDelete(req.params.id)
        .then((data)=> {
            if(data)res.status(200).json({status:'Carta Successully Deleted'});
            else res.status(404).json({status:'Carta not found'})
        })
        .catch((err)=>res.status(400).json({status:err}));
};

// Saca la Lista de Generos
cartaCtrl.getGenres = async (req, res) => {
    await Carta.find().distinct('genres')
        .then((data)=> {
            res.status(200).json({status:data})
        })
        .catch((err)=>res.status(400).json({status:err}));
};

module.exports = cartaCtrl;