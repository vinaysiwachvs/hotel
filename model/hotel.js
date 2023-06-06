const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },

}, {
    timestamps: true,
});

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    contact:{
        type: String,
        required: true,
    },
    images: [String],
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required:true,
    },
    address: {
        type: String,
        required: true,
        },
    amenities:{
        type: [String],
        required: true,
    },
    rating: {
        type: Number,
    },
    totalRooms:{
        type: Number
    },
    totalAvaliableRooms:{
        type: Number,

    },
    reviews: [reviewSchema],
    createdOn: {
        type: Date,
        default: Date.now(),
        immutable: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        immutable: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("Hotel", hotelSchema);