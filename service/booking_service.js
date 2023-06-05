const User = require("../model/user");
const Hotel = require("../model/hotel");

exports.addToBook = async (userId, hotelId, rooms) => {
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) throw new Error("Hotel not found");
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found.");
    const noOfRooms = await Hotel.find(Hotel.numOfRooms)
    if(!noOfRooms) throw new Error("No rooms available.")

    const existingHotel = await User.findOne({_id: userId,"book.hotelId": hotelId,});

    let res;
    if (existingHotel) {
        res = await User.updateOne(
            { _id: userId, "book.hotelId": hotelId },
            { $inc: { "book.$.rooms": 1 } }
        );
    } else {
    res = await User.updateOne(
        { _id: userId },
        { $push: { book: { hotelId, rooms: rooms } } }
    );
}
return res;
};
exports.removeFromBook = async (userId, hotelId) => {
    const user = await User.findById(userId);

    const res = await User.updateOne(
    {
        _id: userId,
    },
    {
        $pull: {
            book: {
            hotelId: hotelId,
            },
        },
    },
    { new: true }
);
    if (res.modifiedCount == 0)
        throw new Error("Hotel does not Exists in the Booking list");
    return res;
};

exports.getBooking = async (userId) => {
    const user = await User.findOne({ _id: userId }).populate("book.hotelId");
    console.log(user);
    return user.book;
};