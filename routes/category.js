const { Router } = require("express");
const router = Router();
const categoryDAO = require('../daos/category');
const isLoggedIn = require('./isLoggedIn');

router.post("/",  async (req, res, next) => {
    req.text = req.body.text;
    if (!req.text || JSON.stringify(req.text) === '{}' ) {
        res.sendStatus(400);
    } else {
        next();
    }
});  

router.post("/", isLoggedIn, async (req, res, next) => {
    try {
        const noteCreated = await categoryDAO.createCategory(req.userId, req.text);
        res.json(noteCreated);
        res.status(200);
    } catch(e) {
        res.status(500).send(e.message);
    }
});

router.get("/:id", isLoggedIn, async (req, res, next) => {
    try {
        req.category = await categoryDAO.getByCategoryId(req.userId, req.params.id);
    if (!req.category) {
            res.sendStatus(404);
        } else {
            res.status(200);
            res.json(req.category);
        }
    } catch (e) {
        res.sendStatus(400);
    }
});

router.get("/", isLoggedIn, async (req, res, next) => {
    try {
        const category = await categoryDAO.getAllCategory(req.userId);
        res.status(200);
        res.json(category);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

module.exports = router;