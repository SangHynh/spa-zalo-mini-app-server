const studentController = require("../controllers/student.controller");
const { upload } = require("../middlewares/upload.middlewares");
const router = require("express").Router();

// GET
router.get("/", (req, res) => studentController.getStudents(req, res));

// POST
router.post("/", (req, res, next) => {
    req.folder = process.env.STUDENT_FOLDER; // Folder name in cloud
    next();
},
    upload.single("image"),
    (req, res) => studentController.createStudent(req, res)
);

module.exports = router;