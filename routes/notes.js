const { Router } = require("express");
const router = Router();
const noteDAO = require('../daos/note');
const isLoggedIn = require('./isLoggedIn');
const {authNote} = require('./middlewares');

router.get("/stats", isLoggedIn, authNote(["admin"]), async (req, res, next) => {
    const stats = await noteDAO.getStats();
    res.json(stats);
  });

// Search
router.get("/search", isLoggedIn, authNote(["admin"]), async (req, res, next) => {
    let { query } = req.query;
    if (query) {
      const notes = await noteDAO.search(query);
      res.json(notes);
    }
  });

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
        const note = req.body;
        const noteCreated = await noteDAO.createNote(note);

        res.json(noteCreated);
        res.status(200);
    } catch(e) {
        res.status(500).send(e.message);
    }
});

router.get("/:id", isLoggedIn, async (req, res, next) => {
    try {
        req.note = await noteDAO.getNoteById(req.params.id);
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

router.put("/:id", isLoggedIn, async (req, res, next) => {
    try {
        const event = await noteDAO.getNoteById(req.params.id);      
        if (event===null) {
            res.sendStatus(404);
        } else {       
            const savedNote = await noteDAO.updateById(req.params.id, req.body);
            res.json(savedNote);
        }
    } catch(e) {
        res.status(500).send(e.message);
    }
});
  
router.delete("/:id", isLoggedIn, authNote(["admin"]), async (req, res, next) => {
try {
    const events = await noteDAO.removeById(req.params.id);
    res.sendStatus(200);
} catch(e) {
    next(e);
}
});

module.exports = router;