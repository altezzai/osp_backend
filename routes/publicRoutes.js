const express = require("express");
const router = express.Router();
const publicController = require("../controllers/publicController");

router.get("/books", publicController.getBooks);
router.get("/journals", publicController.getJournals);
router.get("/teams", publicController.getTeams);
router.get("/stories", publicController.getStories);

module.exports = router;
