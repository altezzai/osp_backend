const { Book } = require("../models"); // This line changed
const multer = require("multer");
const path = require("path");

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
  // fileFilter: (req, file, cb) => {
  //   const allowedTypes = /jpeg|jpg|png/;
  //   const extname = allowedTypes.test(
  //     path.extname(file.originalname).toLowerCase()
  //   );
  //   const mimetype = allowedTypes.test(file.mimetype);
  //   if (extname && mimetype) {
  //     return cb(null, true);
  //   }
  //   cb(new Error("Only jpeg, jpg, and png files are allowed!"));
  // },
}).single("image");

const bookController = {
  // Create new book
  create: async (req, res) => {
    try {
      upload(req, res, async (err) => {
        if (err) {
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

  // Get all books
  getAll: async (req, res) => {
    try {
      const books = await Book.findAll({
        where: { trash: false },
        order: [["createdAt", "DESC"]],
      });
      res.json(books);
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
  update: async (req, res) => {
    try {
      upload(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }

        const book = await Book.findByPk(req.params.id);
        if (!book) {
          return res.status(404).json({ error: "Book not found" });
        }

        const updateData = {
          ...req.body,
          image: req.file ? req.file.filename : book.image,
        };

        await book.update(updateData);
        res.json(book);
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

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
