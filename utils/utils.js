const fs = require("fs");
const path = require("path");

const deletefilewithfoldername = async (file, foldername) => {
  try {
    if (file) {
      const filePath = path.join("uploads/" + foldername + "/", file.filename);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    }
  } catch (err) {
    console.error("Error cleaning up" + foldername + " files:", err);
  }
};
module.exports = { deletefilewithfoldername };
