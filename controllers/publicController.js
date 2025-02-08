const { Book, Journal, Team, TrendingStory } = require("../models");
const College = require("../models/knowledge_models/college");
const Department = require("../models/knowledge_models/department");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { Op, Sequelize } = require("sequelize");

const getBooks = async (req, res) => {
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
};
const getJournals = async (req, res) => {
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
    const uniqueSchools = await Department.findAll({
      attributes: [
        [Sequelize.fn("DISTINCT", Sequelize.col("schoolOf")), "schoolOf"],
      ],
    });

    // Map the results to a simple array of unique `schoolOf` values
    const schools = uniqueSchools.map((school) => school.schoolOf);

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

    const departments = departmentslist.map((dept) => dept.department_name);

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
    const colleges = await College.findAll({
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
    res.status(201).json(colleges);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getBooks,
  getJournals,
  getStories,
  getTeams,

  getSchoolOf,
  getDepartmentBySchoolof,

  getcolleges,
};
