const student = require("./student.route")
const test = require("./test.route")

const initRoutes = (app) => {
    app.use("/api/students", student)
    app.use("/api/test", test)
}

module.exports = initRoutes