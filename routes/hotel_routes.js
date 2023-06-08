const express = require("express");
const router = express.Router();
const hotelController = require("../controller/hotel_controller");
const bookingController = require("../controller/booking_controller");
const { authorize, verifyToken } = require("../controller/auth_controller");

router
    .route("/")
    .post(verifyToken, authorize(["Admin"]), hotelController.createHotel);
router
    .route("/:id")
    .delete(verifyToken, authorize(["Admin"]), hotelController.deleteHotel);
router.route("/:id/review").post(verifyToken, hotelController.createReview);

router.route("/").get(hotelController.getAllHotels);
router.route("/:id").get(hotelController.getHotelById);
router
    .route("/:id")
    .patch(verifyToken, authorize(["Admin"]), hotelController.activeHotel);

router.get("/search/address/:address", hotelController.searchByLocation);
router.get(
    "/search/price/:minPrice/:maxPrice",
    hotelController.searchByPriceRange,
);

router.post("/booking", bookingController.bookHotel);
router.delete("/booking/:bookingId", bookingController.cancelBookedHotel);

module.exports = router;
