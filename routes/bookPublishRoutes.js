const express = require("express");
const router = express.Router();
const bookPublishController = require("../controllers/bookPublishController");

router.post("/", bookPublishController.create);
router.get("/", bookPublishController.getAll);
router.get("/:id", bookPublishController.getOne);
router.put("/:id", bookPublishController.update);
router.patch("/:id/trash", bookPublishController.moveToTrash);
router.delete("/:id", bookPublishController.delete);

module.exports = router;
