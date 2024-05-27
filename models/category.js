const mongoose = require('mongoose');
const User = require('./user');

const categorySchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: User, index: true },   //removed for now required: true,
    text: { type: String, required: true }
});

module.exports = mongoose.model('Category', categorySchema);