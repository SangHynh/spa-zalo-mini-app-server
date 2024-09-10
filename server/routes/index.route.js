const student = require("./student.route")
const test = require("./test.route")
const product = require('./products')
const user = require('./users')

const initRoutes = (app) => {
    app.use("/api/students", student)
    app.use("/api/test", test)
    app.use('/api/products',product)
    app.use('/api/users',user)
}

module.exports = initRoutes