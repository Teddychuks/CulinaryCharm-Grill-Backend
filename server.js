const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");
const cron = require("node-cron");
const axios = require("axios");

dotenv.config({ path: "./config.env" });

process.on("unhandledRejection", (err) => {
  process.exit(1);
});

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => {
  console.log("DB connection successful");
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}....`);
});

// Function to send a request to your server
const sendRequest = async () => {
  // Modify the URL and endpoint based on your server setup
  const response = await axios.get(
    "https://culinarycharmgrill.onrender.com/menu/cocktail/656e347d1fdb19422c8ebed0"
  );
  console.log("Request sent successfully", response.data);
};

// Schedule the cron job every 14 minutes
cron.schedule("*/14 * * * *", () => {
  sendRequest();
});
