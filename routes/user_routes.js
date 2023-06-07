const express = require("express");
const router = express.Router();
const { getUser } = require("../controller/user_controller");
const { verifyToken, authorize } = require("../controller/auth_controller");

router.route("/").get(verifyToken,authorize(["Admin"]),getUser);
module.exports = router;