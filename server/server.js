const express = require("express");
const cors = require("cors");
const createError = require("http-errors");
const dotenv = require("dotenv");
const helmet = require('helmet');

const { connect } = require("./configs/db.config");
const initRoutes = require("./routes/index.route");
const loggingMiddleware = require("./middlewares/logger.middleware");
const authRoute = require("./auth/auth.route");
const { verifyAccessToken } = require("./configs/jwt.config");
const redis = require("./configs/redis.config");
require("./configs/jwt.config");

dotenv.config();

const app = express();

// Che dấu công nghệ sử dụng phía BE
app.disable('x-powered-by');

// Middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
app.use(cors({
  origin: function(origin, callback) {
    // Nếu không có origin (ví dụ như khi gọi từ Postman), cho phép tất cả
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(loggingMiddleware);
app.use("/auth", authRoute);

// Initialize routes
initRoutes(app);

// Database connection
connect();

// Test route
app.get("/", verifyAccessToken, async (req, res, next) => {
  res.send("Hello kitty");
  const delay = 10000; // 10 giây

  setTimeout(() => {
    // Gửi phản hồi sau 10 giây
    res.send("Hello kitty");
  }, delay);
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
