const express = require('express');
const router = express.Router()
const projectsController = require("../controllers/projectsController")
router.route("/")
.get(projectsController.getallProjects)
.post(projectsController.createProject)
.patch(projectsController.updateProject)
.delete(projectsController.deleteProject)

module.exports = router