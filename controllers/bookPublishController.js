const { BookPublish } = require("../models");
const multer = require("multer");
const path = require("path");
const { deletefilewithfoldername } = require("../utils/utils");
const { Op } = require("sequelize");

// Configure Multer for file upload
const storage = multer.diskStorage({
  destination: "./uploads/bookPublish",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage }).single("file");

const bookPublishController = {
  create: async (req, res) => {
    try {
      console.log(req.file, "----");

      upload(req, res, async (err) => {
        if (err) {
          await deletefilewithfoldername(req.file, "bookPublish");
          return res.status(500).json({ error: err.message });
        }

        const { first_name, last_name, email, title, book_type } = req.body;
        if (!title || !first_name || !last_name || !book_type || !email) {
          return res.status(400).json({
            error:
              "All fields are required: title, first_name, last_name,email and book_type.",
          });
        }
        const book = await BookPublish.create({
          ...req.body,
          file: req.file ? req.file.filename : null,
        });
        res.status(201).json(book);
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      // const books = await BookPublish.findAll({ where: { trash: false } });
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const searchQuery = req.query.q || "";
      whereQuery = { trash: false };

      if (searchQuery) {
        whereQuery[Op.or] = [
          { first_name: { [Op.like]: `%${searchQuery}%` } },
          { last_name: { [Op.like]: `%${searchQuery}%` } },
          { email: { [Op.like]: `%${searchQuery}%` } },
          { title: { [Op.like]: `%${searchQuery}%` } },
        ];
      }
      const { count, rows: books } = await BookPublish.findAndCountAll({
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
        data: books,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getOne: async (req, res) => {
    try {
      const book = await BookPublish.findByPk(req.params.id);
      if (!book) return res.status(404).json({ error: "Book not found" });
      res.json(book);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      upload(req, res, async (err) => {
        if (err) {
          await deletefilewithfoldername(req.file, "bookPublish");
          return res.status(400).json({ error: err.message });
        }

        const book = await BookPublish.findByPk(req.params.id);
        if (!book) {
          await deletefilewithfoldername(req.file, "bookPublish");
          return res.status(404).json({ error: "Book not found" });
        }

        const updateData = {
          ...req.body,
          file: req.file ? req.file.filename : book.file,
          user_id: 0,
        };

        const oldFilePath = book.file;

        await book.update(updateData);

        if (req.file && oldFilePath) {
          try {
            const coverPath = path.join("uploads/bookPublish/", oldFilePath);
            if (fs.existsSync(coverPath)) {
              fs.unlinkSync(coverPath);
            }
          } catch (error) {
            console.error("Error deleting old book publish file:", error);
          }
        }
        res.status(201).json(book);
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  moveToTrash: async (req, res) => {
    try {
      const book = await BookPublish.findByPk(req.params.id);
      if (!book) return res.status(404).json({ error: "Book not found" });

      await book.update({ trash: true });
      res.json({ message: "Book moved to trash" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const book = await BookPublish.findByPk(req.params.id);
      if (!book) return res.status(404).json({ error: "Book not found" });

      await book.destroy();
      res.json({ message: "Book deleted permanently" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = bookPublishController;
