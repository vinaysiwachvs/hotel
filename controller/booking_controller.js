const bookingService = require("../service/booking_service");
const hotelService = require("../service/hotel_service");

exports.bookHotel = async (req, res) => {
    try {
        const hotelId = req.params.id;
        const { checkInDate, checkOutDate, rooms } = req.body;
        const user = req.loggedInUser;
        const hotel = await hotelService.getHotelById(hotelId);

        const booking = await bookingService.bookHotel(
            hotelId,
            user,
            checkInDate,
            checkOutDate,
            rooms,
        );

        res.status(200).send({ booking });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
};

exports.cancelBookedHotel = async (req, res) => {
    try {
        const hotelId = req.params.id;
        const bookingId = req.params.bookingId;
        const user = req.loggedInUser;
        // console.log(user);

        const canceledBooking = await bookingService.cancelBookedHotel(
            hotelId,
            bookingId,
            user,
        );

        if (canceledBooking) {
            res.status(200).json({ message: "Booking canceled successfully." });
        } else {
            res.status(404).json({ error: "Booking not found." });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: "An error occurred while canceling the hotel booking.",
        });
    }
};
