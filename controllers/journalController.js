const db = require("../models");
const Journal = db.Journal;
const multer = require("multer");
const path = require("path");

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
      const journals = await Journal.findAll({
        where: { trash: false },
      });
      res.json(journals);
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
          return res.status(400).json({ error: err.message });
        }

        const journal = await Journal.findByPk(req.params.id);
        if (!journal) {
          return res.status(404).json({ error: "Journal not found" });
        }

        const updateData = {
          ...req.body,
          image: req.file ? req.file.filename : journal.image,
        };

        await journal.update(updateData);
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
