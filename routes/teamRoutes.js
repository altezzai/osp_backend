const express = require("express");
const router = express.Router();
const teamController = require("../controllers/teamController");

// CRUD routes
router.post("/", teamController.create);
router.get("/", teamController.getAll);
router.get("/admin", teamController.getAllAdmin);
router.get("/:id", teamController.getOne);
router.get("/category/:category", teamController.getByCategory);
router.put("/:id", teamController.update);
router.patch("/:id/status", teamController.toggleStatus);
router.patch("/:id/trash", teamController.moveToTrash);
router.delete("/:id", teamController.delete);

module.exports = router;
