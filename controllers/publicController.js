const { Book, Journal, Team, TrendingStory } = require("../models");
const College = require("../models/knowledge_models/college");
const Department = require("../models/knowledge_models/department");
const SchoolOf = require("../models/knowledge_models/schoolof");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { Op, Sequelize } = require("sequelize");

const getBooks = async (req, res) => {
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

    const { count, rows: books } = await Book.findAndCountAll({
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
};
const getJournals = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const categories = req.query.categories || "";
    const sub_categories = req.query.sub_categories || "";
    const searchQuery = req.query.q || "";
    const types = req.query.type
      ? req.query.type.split(",")
      : ["ruby", "diamond"]; //default value is ruby

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
};
const getStories = async (req, res) => {
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
      attributes: ["id", "title", "description", "image", "type", "date"], // Select specific fields
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
};
const getLatest3TrendingStories = async (req, res) => {
  try {
    const { rows: stories } = await TrendingStory.findAndCountAll({
      distinct: true,
      limit: 3, // Fetch only the latest 3 stories
      where: {
        trash: false,
      },
      order: [["createdAt", "DESC"]],
      attributes: ["id", "title", "description", "image", "type", "date"], // Select specific fields
    });

    res.status(200).json({
      data: stories,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTeams = async (req, res) => {
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
};

const getSchoolOf = async (req, res) => {
  try {
    const schools = await SchoolOf.findAll({
      attributes: ["id", "schoolOf"],
    });

    res.status(200).json({
      schools,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getDepartmentBySchoolof = async (req, res) => {
  try {
    const schoolOf = req.query.schoolOf;
    const departmentslist = await Department.findAll({
      where: {
        schoolOf: schoolOf,
        trash: false,
      },
      attributes: ["id", "department_name", "icon", "schoolOf"],
      order: [["department_name", "ASC"]],
    });

    res.status(200).json({
      departmentslist,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getcolleges = async (req, res) => {
  const searchQuery = req.query.q || "";

  try {
    // const colleges = await College.findAll({
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: colleges } = await College.findAndCountAll({
      offset,
      distinct: true,
      limit,
      where: {
        trash: 0,
        [Op.or]: [
          {
            college_name: {
              [Op.like]: `%${searchQuery}%`,
            },
          },
        ],
      },
      attributes: ["id", "college_name", "logo"],
    });

    const totalPages = Math.ceil(count / limit);
    res.status(200).json({
      totalContent: count,
      totalPages,
      currentPage: page,
      data: colleges,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getBooks,
  getJournals,
  getStories,
  getLatest3TrendingStories,
  getTeams,

  getSchoolOf,
  getDepartmentBySchoolof,

  getcolleges,
};
