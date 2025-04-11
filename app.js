const express = require("express");
const dotenv = require("dotenv");
// const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
dotenv.config();

const app = express();

const journalRoutes = require("./routes/journalRoutes");
const bookRoutes = require("./routes/bookRoutes");
const storyRoutes = require("./routes/trendingStoryRoutes");
const teamRoutes = require("./routes/teamRoutes");
const contactUsRoutes = require("./routes/contactUsRoutes");
const bookPublishRoutes = require("./routes/bookPublishRoutes");
const publicRoutes = require("./routes/publicRoutes");

const { auth } = require("./middleware/authMiddleware");

// const { sequelize } = require("./models");

const {
  ospSequelize,
  knowledgeSequelize,
  janewaySequelize,
} = require("./config/connection");

// app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extend: true }));
app.use(auth);

app.use("/uploads", express.static("uploads"));

app.use("/api/journals", journalRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/contactUs", contactUsRoutes);
app.use("/api/bookPublish", bookPublishRoutes);
app.use("/api/public", publicRoutes);

const PORT = process.env.PORT || 3000;
const startServer = async () => {
  try {
    await knowledgeSequelize.authenticate();
    console.log(
      "Connection to knowledge database has been established successfully."
    );

    await ospSequelize.authenticate();
    console.log(
      "Connection to osp database has been established successfully."
    );

    await knowledgeSequelize.sync();
    console.log("knowledge database synchronized.");
    await ospSequelize.sync();
    console.log("osp database synchronized.");

    // await janewaySequelize.sync();
    // console.log("repository database synchronized.");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
};

process.on("SIGINT", async () => {
  console.log("SIGINT signal received: closing HTTP server");
  await knowledgeSequelize.close();
  await janewaySequelize.close();
  process.exit(0);
});

startServer();
