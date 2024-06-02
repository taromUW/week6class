const { Router } = require("express");
const bcrypt = require('bcrypt');
const router = Router();
const tokenDAO = require('../daos/token');
const userDAO = require('../daos/user');
const isLoggedIn = require('./isLoggedIn')

router.post("/signup", async (req, res, next) => {
  if (!req.body.email || JSON.stringify(req.body.email) === '{}' ) {
    res.status(400).send('email is required');
  } else {
    const existingUser = await userDAO.getUser(req.body.email);
    if (!existingUser) {
      next();
    } else {
      res.status(409).send('user/email exists');
    }
  }
})

router.post("/signup",  async (req, res, next) => {
    req.password = req.body.password;
    if (!req.password || JSON.stringify(req.password) === '{}' ) {
        res.status(400).send('password is required');
    } else {
        next();
    }
});

router.post("/signup", async (req, res, next) => {
    try {
        const hashedPassword = await bcrypt.hash(req.password, 10);
        const createdUser = await userDAO.createUser({ email:req.body.email, password:hashedPassword, role: req.body.role });
        res.sendStatus(200);
        res.json(createdUser);
    } catch(e) {
        if (e instanceof userDAO.BadDataError) {
            res.status(409).send(e.message);
        }
    }
});

router.post("/login", async (req, res, next) => {
    const { password } = req.body;
        if (!password) {
        return res.sendStatus(400);
    } else {
        req.email = req.body.email;
        req.existingUser = await userDAO.getUser(req.email);
        if (!req.existingUser) {
            res.status(401).send('user not existed');
        } else {
            next();
        }
    }
});

router.post("/login", async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        next();
    } else {
        const token = authHeader.substring(7);
        const userIDFromToken = await tokenDAO.getUserIdFromToken(token);
        if (!userIDFromToken) {
            next();
      } else {
        if (user._id === userIDFromToken) {
            next();
        } else {
          res.status(401).send('not matched');
        }
      }
    }
});

router.post("/login", async (req, res, next) => {  
    try {
        const comparisonResult = await bcrypt.compare(req.body.password, req.existingUser.password)
        if (!comparisonResult) {
            res.status(401).send('comparison failed');
        } else {
            const token = await tokenDAO.makeTokenForUserId(req.existingUser._id);
            res.status(200);
            res.json({"token": token.token});
        } 
    } catch (e) {
        throw(e);
    }
});

router.post("/logout", isLoggedIn, async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.substring(7);
            await tokenDAO.removeToken(token);
            res.status(200).send(`Logged Out`);  
        } else {
            res.status(401);
        }
    } catch (e) {
        res.status(401);
    }
});

router.put("/password", isLoggedIn, async (req, res, next) => {
    try {
        const { password } = req.body;
        if (!password) {
            return res.sendStatus(400);
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            await userDAO.updateUserPassword(req.userId, hashedPassword);
            res.status(200).send('password updated successfully');
        }
    } catch (e) {
        res.status(500);
    }
});

module.exports = router;