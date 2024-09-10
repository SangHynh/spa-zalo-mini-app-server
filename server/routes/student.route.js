const studentController = require("../controllers/student.controller");
const router = require("express").Router();

// GET
router.get("/", (req, res) => studentController.getStudents(req, res));

module.exports = router;