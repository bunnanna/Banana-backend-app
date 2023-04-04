const express = require('express');
const router = express.Router()
const rolesController = require("../controllers/rolesController")
router.route("/")
.get(rolesController.getallRoles)
.post(rolesController.createRole)
.patch(rolesController.updateRole)
.delete(rolesController.deleteRole)

router.route("/:filter")
.get(rolesController.getallRoles)
module.exports = router