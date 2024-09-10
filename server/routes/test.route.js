const studentController = require("../controllers/student.controller");
const router = require("express").Router();

// GET
router.get("/", (req, res) => studentController.helloWorld(req, res));
router.get("/:name", (req, res) => studentController.functionWithParams(req, res));

module.exports = router;