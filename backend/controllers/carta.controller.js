const Carta = require('../models/carta.model');
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
    const carta = new Carta(req.body);
    await carta.save()
        .then((data)=> res.status(201).json({status:'Carta Successully Inserted'}))
        .catch((err)=>res.status(400).json({status:err}));
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