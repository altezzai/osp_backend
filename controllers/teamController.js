const { Team } = require("../models");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { Op } = require("sequelize");

const { deletefilewithfoldername } = require("../utils/utils");

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/team/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({
  storage: storage,
}).single("image");

const teamController = {
  // Create new team member
  create: async (req, res) => {
    try {
      const { name, position, category } = req.body;
      if (!name || !position || !category) {
        return res.status(400).json({
          error: "All fields are required: name, position, and category.",
        });
      }
      upload(req, res, async (err) => {
        if (err) {
          await deletefilewithfoldername(req.file, "team");
          return res.status(400).json({ error: err.message });
        }

        const teamData = {
          ...req.body,
          image: req.file ? req.file.filename : null,
          status: "active",
        };

        const team = await Team.create(teamData);
        res.status(201).json(team);
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get all active team members
  getAll: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const categories = req.query.categories || "";
      const searchQuery = req.query.q || "";
      whereQuery = { trash: false };

      if (categories) {
        whereQuery.category = categories;
      }
      if (searchQuery) {
        whereQuery[Op.or] = [
          { name: { [Op.like]: `%${searchQuery}%` } },
          { position: { [Op.like]: `%${searchQuery}%` } },
          { category: { [Op.like]: `%${searchQuery}%` } },
          { email: { [Op.like]: `%${searchQuery}%` } },
        ];
      }
      const { count, rows: teams } = await Team.findAndCountAll({
        offset,
        distinct: true,
        limit,
        where: whereQuery,
        order: [["createdAt", "DESC"]],
      });
      const totalPages = Math.ceil(count / limit);

      res.status(200).json({
        totalContent: count,
        totalPages,
        currentPage: page,
        data: teams,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get all team members (including inactive)
  getAllAdmin: async (req, res) => {
    try {
      const teams = await Team.findAll({
        where: { trash: false },
        order: [["name", "ASC"]],
      });
      res.json(teams);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get single team member
  getOne: async (req, res) => {
    try {
      const team = await Team.findByPk(req.params.id);
      if (!team) {
        return res.status(404).json({ error: "Team member not found" });
      }
      res.json(team);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get team members by category
  getByCategory: async (req, res) => {
    try {
      const teams = await Team.findAll({
        where: {
          category: req.params.category,
          status: "active",
          trash: false,
        },
        order: [["name", "ASC"]],
      });
      res.json(teams);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update team member
  update: async (req, res) => {
    try {
      upload(req, res, async (err) => {
        if (err) {
          await deletefilewithfoldername(req.file, "team");
          return res.status(400).json({ error: err.message });
        }

        const team = await Team.findByPk(req.params.id);
        if (!team) {
          await deletefilewithfoldername(req.file, "team");
          return res.status(404).json({ error: "Team member not found" });
        }

        const updateData = {
          ...req.body,
          image: req.file ? req.file.filename : team.image,
        };
        const oldFilePath = team.image;

        await team.update(updateData);

        if (req.file && oldFilePath) {
          try {
            const coverPath = path.join("uploads/team/", oldFilePath);
            if (fs.existsSync(coverPath)) {
              fs.unlinkSync(coverPath);
            }
          } catch (error) {
            console.error("Error deleting old college logo:", error);
          }
        }
        res.json(team);
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Toggle status
  toggleStatus: async (req, res) => {
    try {
      const team = await Team.findByPk(req.params.id);
      if (!team) {
        return res.status(404).json({ error: "Team member not found" });
      }

      const newStatus = team.status === "active" ? "inactive" : "active";
      await team.update({ status: newStatus });
      res.json(team);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Move to trash
  moveToTrash: async (req, res) => {
    try {
      const team = await Team.findByPk(req.params.id);
      if (!team) {
        return res.status(404).json({ error: "Team member not found" });
      }

      await team.update({ trash: true });
      res.json({ message: "Team member moved to trash" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Delete permanently
  delete: async (req, res) => {
    try {
      const team = await Team.findByPk(req.params.id);
      if (!team) {
        return res.status(404).json({ error: "Team member not found" });
      }

      await team.destroy();
      res.json({ message: "Team member deleted permanently" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = teamController;
