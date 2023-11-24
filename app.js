const path = require("path");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const menuRouter = require("./routes/menuRouter");
const orderRouter = require("./routes/orderRouter");
const userRouter = require("./routes/userRouter");
const reviewsRouter = require("./routes/reviewsRouter");

const app = express();

// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// Body parser,reading data from the body into req.body
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

app.use((req, res, next) => {
  req.reqTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// ROUTES
app.use("/menu", menuRouter);
app.use("/orders", orderRouter);
app.use("/users", userRouter);
app.use("/reviews", reviewsRouter);

module.exports = app;
