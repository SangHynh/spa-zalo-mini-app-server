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
}

module.exports = new StudentController()