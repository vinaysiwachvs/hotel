const express = require("express");
const router = express.Router();
const bookingController = require('../controller/booking_controller');
const {verifyToken} = require("../controller/auth_controller");

router.route("/").post(verifyToken, bookingController.addToBook);

router.route("/:hotelId").delete(verifyToken, bookingController.removeFromBook);

router.route("/").get(verifyToken, bookingController.getBooking);

module.exports = router;