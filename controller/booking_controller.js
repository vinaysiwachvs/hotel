const { findById } = require("../model/booking");
const bookingService = require("../service/booking_service");
const hotelService = require("../service/hotel_service")

exports.bookHotel = async(req, res) => {
    try {
        const { hotelId, userId, checkInDate, checkOutDate, rooms } = req.body;
        const hotel = await hotelService.getHotelById(hotelId);
        
        const booking = await bookingService.bookHotel(hotelId,userId,checkInDate,checkOutDate,rooms);

        res.status(200).send({ booking });
    } catch (error) {
        console.error(error);
        res
            .status(400)
            .json({ error: error.m });
    }
};

exports.cancelBookedHotel = async(req, res) => {
    try {
        const { bookingId } = req.params;

        const canceledBooking = await bookingService.cancelBookedHotel(bookingId);

        if (canceledBooking) {
            res.status(200).json({ message: "Booking canceled successfully." });
        } else {
            res.status(404).json({ error: "Booking not found." });
        }
    } catch (error) {
        console.error(error);
        res
            .status(400)
            .json({ error: "An error occurred while canceling the hotel booking." });
    }
};