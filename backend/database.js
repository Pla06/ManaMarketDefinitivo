const mongoose = require('mongoose');

// optional: disable buffering so queries fail fast if not connected
mongoose.set('bufferCommands', false);

const MONGODB_URI = 'mongodb+srv://hecmardom_db_user:MarioYHector@manamarket.3lsst8d.mongodb.net/ManaMarket?appName=ManaMarket';
// mongodb+srv://MarioXD:MarioYHector@cluster0.uqj3rpc.mongodb.net/MagicMarket?appName=Cluster0

// Add recommended options for modern drivers
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // other options if needed
})
    .then(() => console.log('DB is connected'))
    .catch(err => console.error('DB connection error:', err));

mongoose.connection.on('connected', () => console.log('Mongoose connected to DB'));
mongoose.connection.on('error', err => console.error('Mongoose connection error:', err));

module.exports = mongoose;