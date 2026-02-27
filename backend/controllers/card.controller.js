/**
 * Controlador de cartas.
 * Contiene funciones CRUD para el modelo Card y otras utilidades como
 * obtener colecciones únicas. Cada función recibe req/res de Express.
 */
const Card = require('../models/card.model');
const cardCtrl = {};

//Funciones CRUD

// Obtener todas las cartas (con paginacion opcional)
cardCtrl.getCards = async (req, res) => {
    const page = Number.parseInt(req.query.page, 10);
    const limit = Number.parseInt(req.query.limit, 10);
    const usePagination = Number.isInteger(page) && Number.isInteger(limit) && page > 0 && limit > 0;

    if (!usePagination) {
        await Card.find()
            .then((data) => res.status(200).json({ status: data }))
            .catch((err) => res.status(400).json({ status: err }));
        return;
    }

    const skip = (page - 1) * limit;
    await Promise.all([
        Card.countDocuments(),
        Card.find().skip(skip).limit(limit)
    ])
        .then(([total, data]) =>
            res.status(200).json({
                status: data,
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            })
        )
        .catch((err) => res.status(400).json({ status: err }));
};

// Obtener una carta por ID
cardCtrl.getCard = async (req, res) => {
    await Card.findById(req.params.id)
        .then((data) => {
            if (data != null) res.status(200).json({ status: data });
            else res.status(404).json({ status: 'Card not found' });
        })
        .catch((err) => res.status(400).json({ status: err }));
};

// Agregar una carta nueva
cardCtrl.addCard = async (req, res) => {
    try {
        console.log('POST /cards - Body:', req.body);
        const card = new Card(req.body);
        const savedCard = await card.save();
        console.log('Card saved successfully:', savedCard._id);
        res.status(201).json({ status: 'Card Successfully Inserted', data: savedCard });
    } catch (err) {
        console.error('Error adding card:', err.message);
        res.status(400).json({ status: 'Error adding card', error: err.message });
    }
};

// Actualizar una carta
cardCtrl.updateCard = async (req, res) => {
    try {
        console.log(`PUT /cards/${req.params.id} - Body:`, req.body);
        const updatedCard = await Card.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!updatedCard) {
            console.log('Card not found:', req.params.id);
            return res.status(404).json({ status: 'Card not found' });
        }
        console.log('Card updated successfully:', updatedCard._id);
        res.status(200).json({ status: 'Card Successfully Updated', data: updatedCard });
    } catch (err) {
        console.error('Error updating card:', err.message);
        res.status(400).json({ status: 'Error updating card', error: err.message });
    }
};

// Eliminar una carta
cardCtrl.deleteCard = async (req, res) => {
    try {
        console.log(`DELETE /cards/${req.params.id}`);
        const deletedCard = await Card.findByIdAndDelete(req.params.id);
        if (!deletedCard) {
            console.log('Card not found:', req.params.id);
            return res.status(404).json({ status: 'Card not found' });
        }
        console.log('Card deleted successfully:', deletedCard._id);
        res.status(200).json({ status: 'Card Successfully Deleted', data: deletedCard });
    } catch (err) {
        console.error('Error deleting card:', err.message);
        res.status(400).json({ status: 'Error deleting card', error: err.message });
    }
};

// Saca la Lista de colecciones
cardCtrl.getCollections = async (req, res) => {
    await Card.find().distinct('collection')
        .then((data) => {
            res.status(200).json({ status: data });
        })
        .catch((err) => res.status(400).json({ status: err }));
};

module.exports = cardCtrl;