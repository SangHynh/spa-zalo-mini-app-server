const express = require("express")
const cors = require("cors")
const { connect } = require("./config/db.config")
const initRoutes = require("./routes/index.route")

require("dotenv").config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

initRoutes(app)
connect()

const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(":::::SERVER READY ON " + PORT))