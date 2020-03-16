const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const loveSchema = new Schema({
    "love": String, 
    "day": String
});

const db = mongoose.model('loves', loveSchema);
module.exports = db;