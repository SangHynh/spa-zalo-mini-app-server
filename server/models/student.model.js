const mongoose = require('mongoose')
const Schema = mongoose.Schema

const studentSchema = new Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true, default: 18 },
    image: { type: String, default: "" }
})

const Student = mongoose.model('Student', studentSchema)

module.exports = Student