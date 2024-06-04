const mongoose = require('mongoose');
const User = require('./user');
const Category = require('./category');

const noteSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: User, index: true }, //required: true, 
  text: { type: String, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' } // Reference to the Category model
});

noteSchema.index({ userId: 1});
noteSchema.index({ text: "text"});

module.exports = mongoose.model("notes", noteSchema);