const { Router } = require("express");
const router = Router();
const noteDAO = require('../daos/note');
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
        //Taro
        const note = req.body;
        const noteCreated = await noteDAO.createNote(note);

        //const noteCreated = await noteDAO.createNote(req.userId, req.text);
        res.json(noteCreated);
        res.status(200);
    } catch(e) {
        res.status(500).send(e.message);
    }
});

router.get("/:id", isLoggedIn, async (req, res, next) => {
    try {
        req.note = await noteDAO.getNote(req.userId, req.params.id);
        if (!req.note) {
            res.sendStatus(404);
        } else {
            res.status(200);
            res.json(req.note);
        }
    } catch (e) {
        res.sendStatus(400);
    }
});

router.get("/", isLoggedIn, async (req, res, next) => {
    try {
        const note = await noteDAO.getUserNotes(req.userId);
        res.status(200);
        res.json(note);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

module.exports = router;