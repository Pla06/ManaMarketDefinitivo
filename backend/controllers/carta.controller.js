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
    // El frontend trabaja con campos en inglés (name, collection, rarity, ...)
    // Usamos un objeto vacío por defecto para evitar errores si req.body es undefined
    const {
        name,
        collection,
        rarity,
        type,
        price,
        stock,
        language,
        condition,
        imageUrl,
        // campos legacy opcionales
        year,
        expansion,
        text,
    } = req.body || {};

    // validar campos obligatorios principales
    if (!name || !collection || !rarity || !price || !imageUrl) {
        return res.status(400).json({ status: 'Faltan campos obligatorios' });
    }

    try {
        // verificar duplicado por nombre (inglés)
        const existente = await Carta.findOne({ name });
        if (existente) {
            return res.status(400).json({ status: 'Carta ya existe' });
        }

        // mapear campos al esquema, guardando tanto en inglés como en español (compatibilidad)
        const carta = new Carta({
            // campos en inglés usados por los frontends
            name,
            collection,
            rarity,
            type,
            price,
            stock,
            language,
            condition,
            imageUrl,
            // campos legacy en español
            nombre: name,
            expansion: expansion || collection,
            rareza: rarity,
            precio: price,
            texto: text,
            imagen: imageUrl,
            year,
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
    // El frontend envía los campos en inglés
    // Usamos un objeto vacío por defecto para evitar errores si req.body es undefined
    const {
        name,
        collection,
        rarity,
        type,
        price,
        stock,
        language,
        condition,
        imageUrl,
        // campos legacy opcionales
        year,
        expansion,
        text,
    } = req.body || {};

    // Construir el objeto de actualización mapeando a los nombres del esquema
    const update = {};

    // Inglés + español en paralelo para mantener compatibilidad
    if (name !== undefined) {
        update.name = name;
        update.nombre = name;
    }
    if (collection !== undefined) {
        update.collection = collection;
        update.expansion = collection;
    }
    if (rarity !== undefined) {
        update.rarity = rarity;
        update.rareza = rarity;
    }
    if (type !== undefined) {
        update.type = type;
    }
    if (price !== undefined) {
        update.price = price;
        update.precio = price;
    }
    if (stock !== undefined) {
        update.stock = stock;
    }
    if (language !== undefined) {
        update.language = language;
    }
    if (condition !== undefined) {
        update.condition = condition;
    }
    if (imageUrl !== undefined) {
        update.imageUrl = imageUrl;
        update.imagen = imageUrl;
    }
    if (year !== undefined) {
        update.year = year;
    }
    if (expansion !== undefined) {
        update.expansion = expansion;
    }
    if (text !== undefined) {
        update.texto = text;
    }

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