const { TrendingStory } = require("../models");
const multer = require("multer");
const path = require("path");

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/stories/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  //   fileFilter: (req, file, cb) => {
  //     const allowedTypes = /jpeg|jpg|png/;
  //     const extname = allowedTypes.test(
  //       path.extname(file.originalname).toLowerCase()
  //     );
  //     const mimetype = allowedTypes.test(file.mimetype);
  //     if (extname && mimetype) {
  //       return cb(null, true);
  //     }
  //     cb(new Error("Only jpeg, jpg, and png files are allowed!"));
  //   },
}).single("image");

const trendingStoryController = {
  // Create new story
  create: async (req, res) => {
    try {
      upload(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }

        const { title, date } = req.body;

        const storyData = {
          ...req.body,
          date: date.trim() ? new Date(date.trim()) : new Date(),
          title,
          image: req.file ? req.file.filename : null,
        };

        const story = await TrendingStory.create(storyData);
        res.status(201).json(story);
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get all active stories
  getAll: async (req, res) => {
    try {
      const stories = await TrendingStory.findAll({
        where: {
          trash: false,
          status: "active",
        },
        order: [["date", "DESC"]],
      });
      res.json(stories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get all stories (including inactive)
  getAllAdmin: async (req, res) => {
    try {
      const stories = await TrendingStory.findAll({
        where: { trash: false },
        order: [["date", "DESC"]],
      });
      res.json(stories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get single story
  getOne: async (req, res) => {
    try {
      const story = await TrendingStory.findByPk(req.params.id);
      if (!story) {
        return res.status(404).json({ error: "Story not found" });
      }
      res.json(story);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get stories by type
  getByType: async (req, res) => {
    try {
      const stories = await TrendingStory.findAll({
        where: {
          type: req.params.type,
          status: "active",
          trash: false,
        },
        order: [["date", "DESC"]],
      });
      res.json(stories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update story
  update: async (req, res) => {
    try {
      upload(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }

        const story = await TrendingStory.findByPk(req.params.id);
        if (!story) {
          return res.status(404).json({ error: "Story not found" });
        }

        const updateData = {
          ...req.body,
          image: req.file ? req.file.filename : story.image,
        };

        await story.update(updateData);
        res.json(story);
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Toggle status
  toggleStatus: async (req, res) => {
    try {
      const story = await TrendingStory.findByPk(req.params.id);
      if (!story) {
        return res.status(404).json({ error: "Story not found" });
      }

      const newStatus = story.status === "active" ? "inactive" : "active";
      await story.update({ status: newStatus });
      res.json(story);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Move to trash
  moveToTrash: async (req, res) => {
    try {
      const story = await TrendingStory.findByPk(req.params.id);
      if (!story) {
        return res.status(404).json({ error: "Story not found" });
      }

      await story.update({ trash: true });
      res.json({ message: "Story moved to trash" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Delete permanently
  delete: async (req, res) => {
    try {
      const story = await TrendingStory.findByPk(req.params.id);
      if (!story) {
        return res.status(404).json({ error: "Story not found" });
      }

      await story.destroy();
      res.json({ message: "Story deleted permanently" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = trendingStoryController;
