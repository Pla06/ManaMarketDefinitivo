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
    // Ahora el endpoint espera los campos en inglés en el body
    // name, year, expansion, price, rarity, text, imageUrl
    // Usamos un objeto vacío por defecto para evitar errores si req.body es undefined
    const { name, year, expansion, price, rarity, text, imageUrl } = req.body || {};

    // validar campos obligatorios
    if (!name || !year || !expansion || !price || !rarity || !text || !imageUrl) {
        return res.status(400).json({ status: 'Faltan campos' });
    }

    try {
        // verificar duplicado por nombre
        const existente = await Carta.findOne({ nombre: name });
        if (existente) {
            return res.status(400).json({ status: 'Carta ya existe' });
        }

        // mapear campos en inglés al esquema del modelo
        const carta = new Carta({
            nombre: name,
            year: year,
            expansion: expansion,
            precio: price,
            rareza: rarity,
            texto: text,
            imagen: imageUrl
        });

        const data = await carta.save();
        return res.status(200).json({ status: 'Se ha añadido la carta correctamente', data });
    } catch (err) {
        // devolver mensaje legible y usar código 500 para problemas del servidor/BD
        const message = err && err.message ? err.message : JSON.stringify(err);
        return res.status(500).json({ status: message || 'Error desconocido' });
    }
};

// Actualizar una carta
cartaCtrl.updateCarta = async (req, res) => {
    // El frontend envía los campos en inglés, igual que en addCarta
    // Usamos un objeto vacío por defecto para evitar errores si req.body es undefined
    const { name, year, expansion, price, rarity, text, imageUrl } = req.body || {};

    // Construir el objeto de actualización mapeando a los nombres del esquema
    const update = {};
    if (name !== undefined) update.nombre = name;
    if (year !== undefined) update.year = year;
    if (expansion !== undefined) update.expansion = expansion;
    if (price !== undefined) update.precio = price;
    if (rarity !== undefined) update.rareza = rarity;
    if (text !== undefined) update.texto = text;
    if (imageUrl !== undefined) update.imagen = imageUrl;

    try {
        const data = await Carta.findByIdAndUpdate(
            req.params.id,
            { $set: update },
            { new: true, runValidators: true }
        );

        if (data) {
            return res.status(200).json({ status: 'Carta Successfully Updated', data });
        } else {
            return res.status(404).json({ status: 'Carta not found' });
        }
    } catch (err) {
        const message = err && err.message ? err.message : JSON.stringify(err);
        return res.status(400).json({ status: message || 'Error desconocido' });
    }
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