const Booking = require("../model/booking");
const { Hotel } = require("../model/hotel");

exports.bookHotel = async (hotelId, user, checkInDate, checkOutDate, rooms) => {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    if (checkIn.getTime() === checkOut.getTime()) {
        throw new Error("Check-in and check-out dates cannot be the same.");
    }
    if (checkIn.getTime() >= checkOut.getTime()) {
        throw new Error(
            "Check-in dates cannot be greater then check-out dates.",
        );
    }
    if (checkIn.getTime() <= Date.now()) {
        throw new Error("Past dates are not allowed.");
    }

    const existingBookings = await Booking.find({
        hotel: hotelId,
        $or: [
            {
                checkInDate: { $lte: checkInDate },
                checkOutDate: { $gt: checkInDate },
            },
            {
                checkInDate: { $lt: checkOutDate },
                checkOutDate: { $gte: checkOutDate },
            },
        ],
    });

    const bookedRooms = existingBookings.reduce(
        (total, booking) => total + booking.rooms,
        0,
    );

    const hotel = await Hotel.findById(hotelId);

    if (!hotel) {
        throw new Error("Hotel not found.");
    }

    const availableRooms = hotel.rooms - bookedRooms;
    if (rooms > availableRooms) {
        throw new Error(`Only ${availableRooms} room(s) available`);
    }
    const noOfDays = (checkOut - checkIn) / 86400000;
    const cost = hotel.price * rooms * noOfDays;

    const newBooking = new Booking({
        hotel: hotelId,
        user: user._id,
        checkInDate,
        checkOutDate,
        rooms,
        cost,
    });
    const savedBooking = await newBooking.save();
    return savedBooking;
};

exports.cancelBookedHotel = async (hotelId, bookingId, user) => {
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) throw new Error("Hotel not found");
    const booking = await Booking.findById(bookingId);
    if (!booking) throw new Error("No booking found");
    if (user.role == "Admin" || toString(user._id) === toString(booking.user)) {
        const canceledBooking = await Booking.findByIdAndDelete(bookingId);
        if (canceledBooking) {
            const { hotel, rooms } = canceledBooking;

            const hotelToUpdate = await Hotel.findById(hotel);

            if (hotelToUpdate) {
                hotelToUpdate.availableRooms += rooms;
                await hotelToUpdate.save();
            }

            return canceledBooking;
        }
    }
};
