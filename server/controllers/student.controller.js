const Student = require("../models/student.model");

class StudentController {
    // TEST
    async helloWorld(req, res) {
        return res.status(200).json({
            message: "Hello World",
        })
    }

    async functionWithParams(req, res) {
        return res.status(200).json({
            message: `Hello ${req.params.name}!`
        })
    }

    // GET STUDENTS
    async getStudents(req, res) {
        try {
            const students = await Student.find()
            return res.status(200).json({
                message: "Get students successfully",
                data: students
            })
        } catch (error) {
            return res.status(500).json({
                error: 'An error occurred' 
            })
        }
    }

    // CREATE STUDENT
    async createStudent(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No image uploaded' });
            }
            console.log(req.file)

            const { name, age } = req.body;
            const imageUrl = req.file.path;

            const student = await Student.create({
                name, age, image: imageUrl
            })
            return res.status(200).json({
                message: "Create student successfully",
                data: student
            })
        } catch (error) {
            return res.status(500).json({
                error: 'An error occurred',
                message: error.message
            })
        }
    }
}

module.exports = new StudentController()