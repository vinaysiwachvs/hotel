const express = require("express");
const router = express.Router();
const { getUser } = require("../controller/user_controller");
const { verifyToken } = require("../controller/auth_controller");

router.route("/").get(verifyToken, getUser);
module.exports = router;