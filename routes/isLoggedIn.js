const { Router } = require("express");
const router = Router();
const tokenDAO = require('../daos/token');

router.use("/", async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).send('auth failed');
    } else {
        const token = authHeader.substring(7);
        const userIDFromToken = await tokenDAO.getUserIdFromToken(token);
        if (!userIDFromToken) {
            res.status(401).send('auth failed');
        } else {
            req.userId = userIDFromToken;
            next();
        }
    }
});

module.exports = router;