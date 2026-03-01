// console.log("Hola desde el backend");
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const app = express();
const { json } = require('express');

// Conexión a la base de datos
let db;

// Consideramos entorno serverless (Vercel) cuando existe la variable VERCEL
const isServerless = !!process.env.VERCEL;

if (isServerless) {
    // En Vercel usamos la URI de entorno; si no está, usamos la que tienes en database.js
    const uri = process.env.MONGODB_URI || 'mongodb+srv://hecmardom_db_user:MarioYHector@manamarket.3lsst8d.mongodb.net/ManaMarket?appName=ManaMarket';

    if (mongoose.connection.readyState === 0) {
        mongoose
            .connect(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            .then(() => console.log('DB is connected (Vercel runtime)'))
            .catch(err => console.error('DB connection error (Vercel runtime):', err));
    }

    db = mongoose;
} else {
    // En local seguimos usando tu archivo database.js sin modificarlo
    db = require('./database');
}

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

// Exportar la app para que Vercel la use como serverless function
module.exports = app;

// En entorno local levantamos el servidor escuchando en un puerto
if (!isServerless) {
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