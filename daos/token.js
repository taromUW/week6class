const Token = require('../models/token');
const uuid = require('uuid');
module.exports = {};

module.exports.makeTokenForUserId = async (userId) => {
    const uniqueId = uuid.v4();
    const newToken = await Token.create({ token: uniqueId, userId: userId });
    return newToken;
}

module.exports.getUserIdFromToken = async (tokenString) => {
    const token = await Token.findOne({token : tokenString});
    if (token) {
        return token.userId;
    } else {
        return null;
    }
}

module.exports.removeToken = async (tokenString) => {
    const result = await Token.deleteOne({token: tokenString});
    return result;
}