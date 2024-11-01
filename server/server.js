const express = require("express");
const cors = require("cors");
const createError = require("http-errors");
require("dotenv").config();
const helmet = require('helmet');
const path = require('path');

const { connect } = require("./configs/db.config");
const initRoutes = require("./routes/index.route");
const loggingMiddleware = require("./middlewares/logger.middleware");
const authRoute = require("./auth/auth.route");
const { verifyAccessToken } = require("./configs/jwt.config");
require("./configs/redis.config");
require("./configs/jwt.config");

const app = express();

// Che dấu công nghệ sử dụng phía BE
app.disable('x-powered-by');

// Middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
// app.use(cors({
//   origin: function(origin, callback) {
//     // Nếu không có origin (ví dụ như khi gọi từ Postman), cho phép tất cả
//     if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true
// }));

app.use(cors({
  origin: '*', // Cho phép tất cả các nguồn
  credentials: true 
}));

app.use(loggingMiddleware);

app.use("/auth", authRoute);

// Initialize routes
initRoutes(app);

// Database connection
connect();

// Test route
app.get("/", async (req, res, next) => {
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

// Cấu hình Express để sử dụng EJS
app.set('view engine', 'ejs');  // Đặt engine là 'ejs'
app.set('views', path.join(__dirname, 'views'));

// Start server
const PORT = process.env.PORT || 8080;
app.listen(
  PORT, 
  '0.0.0.0', 
  () => console.log(":::::SERVER READY ON " + PORT)
);
