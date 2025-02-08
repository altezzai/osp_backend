const express = require("express");
const router = express.Router();
const publicController = require("../controllers/publicController");

router.get("/books", publicController.getBooks);
router.get("/journals", publicController.getJournals);
router.get("/teams", publicController.getTeams);
router.get("/stories", publicController.getStories);
router.get("/categories", publicController.getSchoolOf);
router.get("/sub_categories", publicController.getDepartmentBySchoolof);
router.get("/colleges", publicController.getcolleges);

module.exports = router;
