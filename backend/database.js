const mongoose = require('mongoose');
const URI = 'mongodb+srv://MarioXD:MarioYHector@cluster0.uqj3rpc.mongodb.net/MagicMarket?appName=Cluster0';
mongoose.connect(URI)
    .then(db => console.log('DB is connected'))
    .catch(err => console.error(err));

module.exports = mongoose;