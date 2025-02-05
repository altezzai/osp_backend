const express = require("express");
const router = express.Router();
const journalController = require("../controllers/journalController");

router.post("/", journalController.create);
router.get("/", journalController.getAll);
router.get("/:id", journalController.getOne);
router.put("/:id", journalController.update);
router.patch("/:id/trash", journalController.moveToTrash);
router.delete("/:id", journalController.delete);

module.exports = router;
