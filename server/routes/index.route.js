const product = require('./products')
const user = require('./users')
const category = require('./categories')
const cart = require('./carts')
const service = require('./services')
const voucher = require('./vouchers')
const payment = require('./payments')
const booking = require('./bookings')
const recommendations = require('./recommendations')
const configs = require('./app')

const initRoutes = (app) => {
    app.use('/api/products', product)
    app.use('/api/users', user)
    app.use('/api/categories', category)
    app.use('/api/carts', cart)
    app.use('/api/services', service)
    app.use('/api/vouchers', voucher)
    app.use('/api/payments', payment)
    app.use('/api/bookings', booking)
    app.use('/api/recommendations',recommendations)
    app.use('/api/configs', configs)
}


module.exports = initRoutes