// console.log("Hola desde el backend");
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const {mongoose} = require('./database');
const {json} = require('express');

//Middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

//Routes
app.use('/api/v1/cartas', require('./routes/cartas.route'));
app.use('/', (req, res) => res.send('API is in /api/v1/cartas/'));

//Settings
app.set('port', process.env.PORT || 3000);

// iniciar el server solo cuando la base de datos esté lista
const db = require('./database');

// si ya está conectado, iniciar inmediatamente
if (db.connection.readyState === 1) {
    app.listen(app.get('port'), () => {
        console.log('Server on port', app.get('port'));
    });
} else {
    db.connection.once('open', () => {
        console.log('Database connection opened, starting server');
        app.listen(app.get('port'), () => {
            console.log('Server on port', app.get('port'));
        });
    });
    db.connection.on('error', err => {
        console.error('Database error before starting server:', err);
    });
}