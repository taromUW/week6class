const mongoose = require('mongoose');
const models = [require('./models/note'), require('./models/user'), require('./models/category')];

module.exports = {};

module.exports.connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URL, {});
  await Promise.all(models.map(m => m.syncIndexes()));
}

module.exports.stopDB = async () => {
  await mongoose.disconnect();
}

module.exports.clearDB = async () => {
  await Promise.all(models.map(model => model.deleteMany()))
}
