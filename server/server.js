const express = require("express");
const cors = require("cors");
const createError = require("http-errors");
const dotenv = require("dotenv");

const { connect } = require("./configs/db.config");
const initRoutes = require("./routes/index.route");
const loggingMiddleware = require("./middlewares/logger.middleware");
const authRoute = require("./auth/auth.route");
const { verifyAccessToken } = require("./configs/jwt.config");
require("./configs/redis.config");
require("./configs/jwt.config");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/auth", authRoute);

// Middleware ghi log
app.use(loggingMiddleware);

// Initialize routes
initRoutes(app);

// Database connection
connect();

// Test route
app.get("/", verifyAccessToken, async (req, res, next) => {
  res.send("Hello kitty");
});

// Middleware xử lý các yêu cầu không khớp với bất kỳ route nào
app.use(async (req, res, next) => {
  next(createError.NotFound("No route"));
});

// Middleware xử lý lỗi
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(":::::SERVER READY ON " + PORT));
