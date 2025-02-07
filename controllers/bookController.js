const { Book } = require("../models"); // This line changed
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { deletefilewithfoldername } = require("../utils/utils");
const book_publish = require("../models/book_publish");
// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/books/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
}).single("image");

const bookController = {
  // Create new book
  create: async (req, res) => {
    try {
      upload(req, res, async (err) => {
        if (err) {
          await deletefilewithfoldername(req.file, "books");
          return res.status(400).json({ error: err.message });
        }

        const bookData = {
          ...req.body,
          image: req.file ? req.file.filename : null,
        };

        const book = await Book.create(bookData);
        res.status(201).json(book);
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  update: async (req, res) => {
    try {
      upload(req, res, async (err) => {
        if (err) {
          await deletefilewithfoldername(req.file, "books");
          return res.status(400).json({ error: err.message });
        }

        const book = await Book.findByPk(req.params.id);
        if (!book) {
          await deletefilewithfoldername(req.file, "books");
          return res.status(404).json({ error: "Book not found" });
        }

        const updateData = {
          ...req.body,
          image: req.file ? req.file.filename : book.image,
        };

        const oldFilePath = book.image;

        await book.update(updateData);

        if (req.file && oldFilePath) {
          try {
            const coverPath = path.join("uploads/books/", oldFilePath);
            if (fs.existsSync(coverPath)) {
              fs.unlinkSync(coverPath);
            }
          } catch (error) {
            console.error("Error deleting old book image:", error);
          }
        }
        res.status(201).json(book);
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  // Get all books
  getAll: async (req, res) => {
    try {
      // const books = await Book.findAll({
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const { count, rows: books } = await Book.findAndCountAll({
        offset,
        distinct: true,
        limit,
        where: { trash: false },
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

  // Get single book
  getOne: async (req, res) => {
    try {
      const book = await Book.findByPk(req.params.id);
      if (!book) {
        return res.status(404).json({ error: "Book not found" });
      }
      res.json(book);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get books by category
  getByCategory: async (req, res) => {
    try {
      const books = await Book.findAll({
        where: {
          category: req.params.category,
          trash: false,
        },
      });
      res.json(books);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get books by type
  getByType: async (req, res) => {
    try {
      const books = await Book.findAll({
        where: {
          type: req.params.type,
          trash: false,
        },
      });
      res.json(books);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update book

  // Move to trash
  moveToTrash: async (req, res) => {
    try {
      const book = await Book.findByPk(req.params.id);
      if (!book) {
        return res.status(404).json({ error: "Book not found" });
      }

      await book.update({ trash: true });
      res.json({ message: "Book moved to trash" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Restore from trash
  restore: async (req, res) => {
    try {
      const book = await Book.findByPk(req.params.id);
      if (!book) {
        return res.status(404).json({ error: "Book not found" });
      }

      await book.update({ trash: false });
      res.json({ message: "Book restored from trash" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Delete permanently
  delete: async (req, res) => {
    try {
      const book = await Book.findByPk(req.params.id);
      if (!book) {
        return res.status(404).json({ error: "Book not found" });
      }

      await book.destroy();
      res.json({ message: "Book deleted permanently" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = bookController;
