const student = require("./student.route")
const test = require("./test.route")
const product = require('./products')
const user = require('./users')
const { verifyAccessToken } = require("../configs/jwt.config");


const initRoutes = (app) => {
    app.use("/api/students",verifyAccessToken, student)
    app.use("/api/test",verifyAccessToken, test)
    app.use('/api/products',verifyAccessToken, product)
    app.use('/api/users',verifyAccessToken, user)
}


module.exports = initRoutes