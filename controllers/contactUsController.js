const { ContactUs } = require("../models");
const { Op } = require("sequelize");

const contactUsController = {
  create: async (req, res) => {
    try {
      const { first_name, last_name, email } = req.body;

      if (!first_name || !last_name || !email) {
        return res.status(400).json({
          error: "All fields are required:  first_name, last_name and email.",
        });
      }

      if (!req.body.first_name || !req.body.email) {
        return res
          .status(400)
          .json({ error: "First name and email are required" });
      }
      const contact = await ContactUs.create(req.body);
      res.status(201).json(contact);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      // const contacts = await ContactUs.findAll({ where: { trash: false } });
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
        ];
      }
      const { count, rows: contacts } = await ContactUs.findAndCountAll({
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
        data: contacts,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getOne: async (req, res) => {
    try {
      const contact = await ContactUs.findByPk(req.params.id);
      if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
      }
      res.json(contact);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const contact = await ContactUs.findByPk(req.params.id);
      if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
      }
      await contact.update(req.body);
      res.json(contact);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  moveToTrash: async (req, res) => {
    try {
      const contact = await ContactUs.findByPk(req.params.id);
      if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
      }
      await contact.update({ trash: true });
      res.json({ message: "Contact moved to trash" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const contact = await ContactUs.findByPk(req.params.id);
      if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
      }
      await contact.destroy();
      res.json({ message: "Contact deleted permanently" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = contactUsController;
