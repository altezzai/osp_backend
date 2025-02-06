const express = require("express");
const router = express.Router();
const contactUsController = require("../controllers/contactUsController");

router.post("/", contactUsController.create);
router.get("/", contactUsController.getAll);
router.get("/:id", contactUsController.getOne);
router.put("/:id", contactUsController.update);
router.patch("/:id/trash", contactUsController.moveToTrash);
router.delete("/:id", contactUsController.delete);

module.exports = router;
