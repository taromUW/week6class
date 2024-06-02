/* 
- createUser(userObj) - should store a user record
- getUser(email) - should get a user record using their email
- updateUserPassword(userId, password) - should update the user"s password field
 */
const User = require('../models/user');
module.exports = {};

module.exports.createUser = async (userObj) => {
    const newUser = await User.create(userObj);
    return newUser;
}

module.exports.getUser = async (email) => {
    const user = await User.findOne({ email: email });
    return user;
}

module.exports.getUserById = async (userId) => {
  const user = await User.findOne({ _id: userId });
  return user;
}


module.exports.updateUserPassword = async (userId, password) => {
  const updatedPassword = await User.findByIdAndUpdate(userId, {password: password});
  return updatedPassword;
}

class BadDataError extends Error {};
module.exports.BadDataError = BadDataError;