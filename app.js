const path = require("path");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const cors = require("cors");

const menuRouter = require("./routes/menuRouter");
const orderRouter = require("./routes/orderRouter");
const userRouter = require("./routes/userRouter");
const reviewsRouter = require("./routes/reviewsRouter");

const app = express();

app.use(cors());
// Serving static files
app.use(express.static(path.join(__dirname, "public")));

app.use(helmet());

// Body parser,reading data from the body into req.body
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());

app.use((req, res, next) => {
  req.reqTime = new Date().toISOString();
  next();
});

// Routes
app.use("/menu", menuRouter);
app.use("/orders", orderRouter);
app.use("/users", userRouter);
app.use("/reviews", reviewsRouter);

app.use(compression());

module.exports = app;
