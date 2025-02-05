const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");

router.post("/", bookController.create);
router.get("/", bookController.getAll);
router.get("/:id", bookController.getOne);
router.put("/:id", bookController.update);
router.delete("/:id", bookController.delete);
// Additional routes
router.get("/category/:category", bookController.getByCategory);
router.get("/type/:type", bookController.getByType);
router.patch("/:id/trash", bookController.moveToTrash);
router.patch("/:id/restore", bookController.restore);

module.exports = router;
