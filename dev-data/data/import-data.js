const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
// const Menu = require("../../models/menuModel");
// const User = require("../../models/userModel");
const Reviews = require("../../models/reviewsModel");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => {
    console.log("DB connection successful");
  })
  .catch((err) => {
    console.log("DB connection error:", err.message);
  });

// const menu = JSON.parse(fs.readFileSync(`${__dirname}/menu.json`, "utf-8"));
// const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, "utf-8")
);

const importData = async () => {
  try {
    // await Menu.create(menu);
    // await User.create(users);
    await Reviews.create(reviews);
  } catch (err) {
    console.error("Error importing data:", err.message);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    // await Menu.deleteMany();
    // await User.deleteMany();
    await Reviews.deleteMany();
  } catch (err) {
    console.error("Error deleting data:", err.message);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
