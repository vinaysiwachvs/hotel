const hotelService = require("../service/hotel_service");
const { Hotel } = require("../model/hotel");

exports.createHotel = async (req, res) => {
    try {
        const {
            name,
            images,
            mobile,
            description,
            price,
            address,
            rooms,
            amenities,
            rating,
        } = req.body;
        const user = req.loggedInUser;
        if (!user) {
            throw new Error("User not found");
        }
        const hotel = new Hotel({
            name,
            images,
            mobile,
            description,
            price,
            address,
            amenities,
            rooms,
            rating,
            createdBy: user._id,
            updatedBy: user._id,
        });
        await hotelService.createHotel(hotel);

        res.status(201).json({
            id: hotel._id,
            message: "Hotel created successfully",
        });
    } catch (error) {
        console.log("error in create hotel ", error);
        res.status(400).send({ message: error.message });
    }
};

exports.getAllHotels = async (req, res) => {
    const token = req.headers["authorization"];
    try {
        const hotels = await hotelService.getAllHotel(token);
        return res.json(hotels);
    } catch (error) {
        console.log("error in getting hotels ", error);
        res.status(400).send({ message: error.message });
    }
};

exports.getHotelById = async (req, res) => {
    try {
        const id = req.params.id;
        const hotel = await hotelService.getHotelById(id);
        if (!hotel) {
            res.status(404).send("Hotel not found or in active");
        } else res.status(200).send(hotel);
    } catch (error) {
        console.log("error in getting hotel by id ", error);
        res.status(400).send({ message: error.message });
    }
};

exports.createReview = async (req, res) => {
    try {
        const hotelId = req.params.id;
        const { comment, rating } = req.body;

        const userId = req.loggedInUser._id;
        const hotel = await hotelService.getHotelById(hotelId);
        const result = await hotelService.createReview(
            hotelId,
            userId,
            comment,
            rating,
        );

        res.status(201).json({ message: result });
    } catch (error) {
        console.error("error occured in adding a review", error);
        res.status(400).json({ message: error.message });
    }
};

exports.deleteHotel = async (req, res) => {
    try {
        const hotelId = req.params.id;
        const userid = req.loggedInUser;
        const result = await hotelService.deleteHotel(hotelId, userid);
        res.status(201).send({ message: result });
    } catch (error) {
        console.log("error in deleting Hotel ", error);
        res.status(400).send({ message: error.message });
    }
};

exports.getReviews = async (req, res) => {
    try {
        const hotelId = req.params.id;
        const hotel = await hotelService.getHotelById(hotelId);
        console.log(hotel.reviews);
        return res.status(200).json(hotel.reviews);
    } catch (error) {
        console.log("error in getting hotel ", error);
        res.status(400).send({ message: error.message });
    }
};

exports.searchByLocation = async (req, res) => {
    try {
        const { address } = req.params;
        const hotels = await Hotel.find({ address });
        res.json(hotels);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

exports.searchByPriceRange = async (req, res) => {
    try {
        const { minPrice, maxPrice } = req.params;
        if (Number(minPrice) > Number(maxPrice))
            throw new Error("minimum price should be less then maximum price");
        const hotels = await Hotel.find({
            price: { $gte: minPrice, $lte: maxPrice },
        });
        res.json(hotels);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

exports.searchByRating = async (req, res) => {
    try {
        const { rating } = req.params;
        const hotels = await Hotel.find({ rating: { $gte: rating } });
        res.json(hotels);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

exports.activeHotel = async (req, res) => {
    try {
        const hotelId = req.params.id;
        const userid = req.loggedInUser;
        const result = await hotelService.activeHotel(hotelId, userid);
        res.status(200).send({ message: result });
    } catch (error) {
        console.log("error in deleting Hotel ", error);
        res.status(400).send({ message: error.message });
    }
};
