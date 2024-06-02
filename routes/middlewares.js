const userDAO = require('../daos/user');

const authNote = (permissions) => {
    return async (req, res, next) => {        
        const existingUser = await userDAO.getUserById(req.userId);
        const userRole = existingUser.role;

        if (permissions.includes(userRole)) {
            next();
        } else {
            return res.status(401).json("You don't have permission");
        }
    }
}

module.exports = { authNote };