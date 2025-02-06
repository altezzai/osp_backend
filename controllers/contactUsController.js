const { ContactUs } = require("../models");

const contactUsController = {
  create: async (req, res) => {
    try {
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
      const contacts = await ContactUs.findAll({ where: { trash: false } });
      res.json(contacts);
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
