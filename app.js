const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const path = require("path");
const rateLimit = require("express-rate-limit");

const menuRouter = require("./routes/menuRouter");
const orderRouter = require("./routes/orderRouter");
const userRouter = require("./routes/userRouter");
const reviewsRouter = require("./routes/reviewsRouter");

app.use(
  cors({
    origin: "https://culinarycharmgrill.netlify.app",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour",
});

app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());

app.use((req, res, next) => {
  req.reqTime = new Date().toISOString();
  next();
});

app.use("/menu", menuRouter);
app.use("/orders", orderRouter);
app.use("/user", userRouter);
app.use("/reviews", reviewsRouter);

app.use(compression());

module.exports = app;
