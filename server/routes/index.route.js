const student = require("./student.route")
const test = require("./test.route")
const product = require('./products')
const user = require('./users')
const category = require('./categories')
const cart = require('./carts')
const { verifyAccessToken } = require("../configs/jwt.config");


const initRoutes = (app) => {
    app.use("/api/students",verifyAccessToken, student)
    app.use("/api/test",verifyAccessToken, test)
    app.use('/api/products',verifyAccessToken, product)
    app.use('/api/users',verifyAccessToken, user)
    app.use('/api/categories', verifyAccessToken, category)
    app.use('/api/carts', verifyAccessToken, cart)
}

module.exports = initRoutes