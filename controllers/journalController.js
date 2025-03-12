const db = require("../models");
const Journal = db.Journal;
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { deletefilewithfoldername } = require("../utils/utils");

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/journal/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
}).single("image");

// CRUD Controllers
const journalController = {
  create: async (req, res) => {
    try {
      upload(req, res, async (err) => {
        if (err) {
          await deletefilewithfoldername(req.file, "journal");
          return res.status(400).json({ error: err.message });
        }

        const journalData = {
          ...req.body,
          image: req.file ? req.file.filename : null,
        };

        const journal = await Journal.create(journalData);
        res.status(201).json(journal);
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const categories = req.query.categories || "";
      const sub_categories = req.query.sub_categories || "";
      const searchQuery = req.query.q || "";
      const types = req.query.type
        ? req.query.type.split(",")
        : ["ruby", "diamond"];
      whereQuery = { trash: false };

      if (categories) {
        whereQuery.category = categories;
      }
      if (sub_categories) {
        whereQuery.sub_category = sub_categories;
      }
      if (types) {
        whereQuery.type = types;
      }
      if (searchQuery) {
        whereQuery[Op.or] = [
          { title: { [Op.like]: `%${searchQuery}%` } },
          { description: { [Op.like]: `%${searchQuery}%` } },
          { category: { [Op.like]: `%${searchQuery}%` } },
          { sub_category: { [Op.like]: `%${searchQuery}%` } },
        ];
      }
      const { count, rows: journals } = await Journal.findAndCountAll({
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
        data: journals,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getOne: async (req, res) => {
    try {
      const journal = await Journal.findByPk(req.params.id);
      if (!journal) {
        return res.status(404).json({ error: "Journal not found" });
      }
      res.json(journal);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      upload(req, res, async (err) => {
        if (err) {
          await deletefilewithfoldername(req.file, "journal");
          return res.status(400).json({ error: err.message });
        }

        const journal = await Journal.findByPk(req.params.id);
        if (!journal) {
          await deletefilewithfoldername(req.file, "journal");
          return res.status(404).json({ error: "Journal not found" });
        }

        const updateData = {
          ...req.body,
          image: req.file ? req.file.filename : journal.image,
        };
        const oldFilePath = journal.image;

        await journal.update(updateData);

        if (req.file && oldFilePath) {
          try {
            console.log(oldFilePath);
            const coverPath = path.join("uploads/journal/", oldFilePath);
            if (fs.existsSync(coverPath)) {
              fs.unlinkSync(coverPath);
            }
          } catch (error) {
            console.error("Error deleting old journal image:", error);
          }
        }
        res.json(journal);
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  moveToTrash: async (req, res) => {
    try {
      const journal = await Journal.findByPk(req.params.id);
      if (!journal) {
        return res.status(404).json({ error: "Journal not found" });
      }

      await journal.update({ trash: true });
      res.json({ message: "Journal moved to trash" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const journal = await Journal.findByPk(req.params.id);
      if (!journal) {
        return res.status(404).json({ error: "Journal not found" });
      }

      await journal.destroy();
      res.json({ message: "Journal deleted permanently" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = journalController;
