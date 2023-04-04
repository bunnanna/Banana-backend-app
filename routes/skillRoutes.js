const express = require('express');
const router = express.Router()
const skillsController = require("../controllers/skillsController")
router.route("/")
.get(skillsController.getallSkills)
.post(skillsController.createSkill)
.patch(skillsController.updateSkill)
.delete(skillsController.deleteSkill)

router.route("/:filter")
.get(skillsController.getallSkills)

module.exports = router