const express = require('express');
const router = express.Router()
const skillsController = require("../controllers/skillsController")
router.route("/")
.get(skillsController.getallSkills)
.post(skillsController.createSkill)
.patch(skillsController.updateSkill)
.delete(skillsController.deleteSkill)

module.exports = router