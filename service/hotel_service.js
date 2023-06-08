const { Hotel } = require("../model/hotel");

exports.getAllHotel = async (page, limit, user) => {
    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);

    if (parsedPage < 0 || parsedLimit < 0)
        throw new Error(
            `Please enter a positive value for page number or limit`,
        );

    const skipIndex = (parsedPage - 1) * parsedLimit;

    let pipeline = [
        {
            $project: {
                _id: 1,
                name: 1,
                images: 1,
                price: 1,
                description: 1,
                createdOn: 1,
                isActive: 1,
            },
        },
        { $skip: skipIndex },
        { $limit: parsedLimit },
    ];

    if (user.role !== "Admin") {
        pipeline.unshift({
            $match: {
                isActive: true,
            },
        });
    }

    const hotels = await Hotel.aggregate(pipeline);

    if (!hotels[0]) throw new Error("Hotel not found");

    return hotels;
};

exports.createHotel = async (hotel) => {
    console.log("In create Hotel ", hotel);
    await hotel.save();
    return hotel.id;
};

exports.getHotelById = async (id) => {
    const hotel = await Hotel.findById(id);
    if (hotel.isActive == false) {
        throw new Error("Hotel is inactive");
    }
    console.log(hotel);
    return hotel;
};

exports.createReview = async (hotelId, userId, comment, rating) => {
    try {
        const hotel = await Hotel.findById(hotelId);

        if (!hotel) {
            throw new Error("Hotel not found");
        }

        const review = { user: userId, comment, rating };

        hotel.reviews.push(review);

        const totalReviews = hotel.reviews.length;
        const averageRating =
            (hotel.rating * (totalReviews - 1) + review.rating) / totalReviews;
        hotel.rating = averageRating;

        await Hotel.updateOne({ _id: hotelId }, { $set: hotel });

        return { message: "Review posted successfully" };
    } catch (error) {
        console.error(error);
        throw new Error("Failed to post review");
    }
};

exports.deleteHotel = async (hotelId) => {
    const hotel = await Hotel.findById(hotelId);
    const deletedHotel = await Hotel.findByIdAndUpdate(hotelId, {
        isActive: false,
    });
    if (!deletedHotel) {
        console.log("Hotel not found");
        return { message: "Hotel do not exist" };
    } else return { message: "Hotel removed successfully from list" };
};

exports.activeHotel = async (hotelId) => {
    const hotel = await Hotel.findById(hotelId);
    const activeHotel = await Hotel.findByIdAndUpdate(hotelId, {
        isActive: true,
    });
    if (!activeHotel) {
        console.log("Hotel not found");
        return { message: "Hotel do not exist" };
    } else return { message: "Hotel added successfully to list" };
};
