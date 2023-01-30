const express = require('express');
const router = express.Router()
const tasksController = require("../controllers/tasksController")
router.route("/")
.get(tasksController.getallTasks)
.post(tasksController.createTask)
.patch(tasksController.updateTask)
.delete(tasksController.deleteTask)
.put(tasksController.getallTasks)

router.route("/checklists")
.patch(tasksController.updatecheckTask)
module.exports = router