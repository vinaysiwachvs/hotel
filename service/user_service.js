const User = require("../model/user");

exports.getUserfromDB = async() => {
    return await User.find();
};