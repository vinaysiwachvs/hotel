const bookService = require("../service/booking_service");

exports.addToBook = async (req, res) => {
    try {
        const { hotelId, rooms } = req.body;
        const userId = req.loggedInUser._id;
        const result = await bookService.addToBook(userId, hotelId, rooms);
        res
            .status(200)
            .json({ message: "Rooms are selected." });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

exports.removeFromBook = async (req, res) => {
    try {
        const userId = req.loggedInUser._id;
        const hotelId = req.params.hotelId;

        const book = await bookService.removeFromBook(userId, hotelId);

        res
            .status(200)
            .json({ message: "Rooms are removed." });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

exports.getBooking = async (req, res) => {
    try {
        const userId = req.loggedInUser._id;

        const cart = await bookService.getBooking(userId);

        res.status(200).send(cart);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};