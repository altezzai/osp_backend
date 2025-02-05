const express = require("express");
const router = express.Router();
const trendingStoryController = require("../controllers/trendingStoryController");

// CRUD routes
router.post("/", trendingStoryController.create);
router.get("/", trendingStoryController.getAll);
router.get("/admin", trendingStoryController.getAllAdmin);
router.get("/:id", trendingStoryController.getOne);
router.get("/type/:type", trendingStoryController.getByType);
router.put("/:id", trendingStoryController.update);
router.patch("/:id/status", trendingStoryController.toggleStatus);
router.patch("/:id/trash", trendingStoryController.moveToTrash);
router.delete("/:id", trendingStoryController.delete);

module.exports = router;
