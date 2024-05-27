const { Router } = require("express");
const router = Router();


router.use("/notes", require('./notes'));
router.use("/category", require('./category'));
router.use("/auth", require('./auth'));

router.use((err, _req, res, _next) => {
  if (err.message.includes("Failed to cast the ObjetId")) {
      res.status(400).send('bad id');
  }
});

router.get("/", (req, res, next) => {
  res.send()
});

module.exports = router;