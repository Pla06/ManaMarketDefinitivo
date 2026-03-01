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
// Rutas originales en español
app.use('/api/v1/cartas', require('./routes/cartas.route'));
// Nuevas rutas en inglés para compatibilidad con los frontends Angular y React
app.use('/api/v1/cards', require('./routes/cartas.route'));
app.use('/', (req, res) => res.send('API is in /api/v1/cartas/ or /api/v1/cards/'));

//Settings
app.set('port', process.env.PORT || 3000);

// Conexión a la base de datos (side effect al hacer require)
const db = require('./database');

// Exportar la app para que Vercel la use como serverless function
module.exports = app;

// En entorno local (no Vercel) levantamos el servidor escuchando en un puerto
if (!process.env.VERCEL) {
    // iniciar el server solo cuando la base de datos esté lista
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
}