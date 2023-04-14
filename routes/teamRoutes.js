const express = require('express');
const router = express.Router()
const teamsController = require("../controllers/teamsController")
router.route("/")
.get(teamsController.getallTeams)
.post(teamsController.createTeam)
.patch(teamsController.updateTeam)
.delete(teamsController.deleteTeam)

module.exports = router