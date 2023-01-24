const express = require('express');
const router = express.Router()
const usersController = require("../controllers/usersController")
router.route("/")
.get(usersController.getallUsers)
.post(usersController.createUser)
.patch(usersController.updateUser)
.delete(usersController.deleteUser)
.put(usersController.getallUsers)

module.exports = router