const express = require("express")
const cors = require("cors")
const { connect } = require("./configs/db.config")
const initRoutes = require("./routes/index.route")
const logger = require('./utils/logger.util');

require("dotenv").config()

const app = express()

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
    logger.info(`:::::Request: ${req.method} ${req.url} (${res.statusCode})`);
    next();
  });

initRoutes(app)
connect()

const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(":::::SERVER READY ON " + PORT))