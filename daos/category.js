const Category = require('../models/category');

module.exports = {};

module.exports.createCategory = (userId, noteObj) => {
  return Category.create({userId:userId, text:noteObj});
}

module.exports.getByCategoryId = (userId, categoryId) => {
  return Category.findOne({ userId: userId, _id:categoryId })
}

module.exports.getAllCategory = (userId) => {
  return Category.find({ userId: userId });
}