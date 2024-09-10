const mongoose = require('mongoose');
const Student = require('../models/student.model');

async function connect() {
    try {
        await mongoose.connect(process.env.MONGODB_URI).then(async () => {
            // TEST ADD STUDENT
            const student = new Student({
                name: 'Mnh Phng',
                age: 20
            })

            try {
                const res = await Student.create(student);
                console.log('Student created successfully:', res);
            } catch (error) {
                console.error('Error creating student:', error);
            }
        })
        console.log('Connect to MongoDB successfully')
    }
    catch (err) {
        console.log("Connection to MongoDB failed")
        console.log(err)
    }
}

module.exports = { connect }