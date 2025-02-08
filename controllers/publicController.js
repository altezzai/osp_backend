const { Book, Journal, Team , TrendingStory} = require("../models"); // This line changed
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { Op } = require("sequelize");

const publicController = {
  getBooks: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const searchQuery = req.query.q || "";
      const types = req.query.type
        ? req.query.type.split(",")
        : ["ruby", "diamond"];
      const { count, rows: books } = await Book.findAndCountAll({
        offset,
        distinct: true,
        limit,
        where: {
          trash: false,
          type: types,
          [Op.or]: [
            { title: { [Op.like]: `%${searchQuery}%` } },
            { description: { [Op.like]: `%${searchQuery}%` } },
            { category: { [Op.like]: `%${searchQuery}%` } },
            { sub_category: { [Op.like]: `%${searchQuery}%` } },
          ],
        },
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
  getJournals: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const searchQuery = req.query.q || "";
      const types = req.query.type
        ? req.query.type.split(",")
        : ["ruby", "diamond"]; //default value is ruby
      const { count, rows: journals } = await Journal.findAndCountAll({
        offset,
        distinct: true,
        limit,
        where: {
          trash: false,
          type: types,
          [Op.or]: [
            { title: { [Op.like]: `%${searchQuery}%` } },
            { description: { [Op.like]: `%${searchQuery}%` } },
            { category: { [Op.like]: `%${searchQuery}%` } },
            { sub_category: { [Op.like]: `%${searchQuery}%` } },
          ],
        },
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
  getStories: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const searchQuery = req.query.q || "";

      const { count, rows: stories } = await TrendingStory.findAndCountAll({
        offset,
        distinct: true,
        limit,
        where: {
          trash: false,
          [Op.or]: [
            { title: { [Op.like]: `%${searchQuery}%` } },
            { description: { [Op.like]: `%${searchQuery}%` } },
          
          ],
        },
        order: [["createdAt", "DESC"]],
      });
      const totalPages = Math.ceil(count / limit);
      res.status(200).json({
        totalContent: count,
        totalPages,
        currentPage: page,
        data: stories,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getTeams: async (req, res) => {
    try {
      const searchQuery = req.query.q || "";
      const teams = await Team.findAll({
        where: {
          trash: false,
          status: "active",
          [Op.or]: [{ name: { [Op.like]: `%${searchQuery}%` } }],
        },
        order: [["name", "ASC"]],
      });

      res.json({ message: "Teams", data: teams });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = publicController;
