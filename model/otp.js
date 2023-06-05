const mongoose = require("mongoose");
const OtpSchema = new mongoose.Schema(
{
    email: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        immutable: true,
        validate: {
            validator: function (email) {
                var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                return re.test(email);
            },
            message: (props) => `${props.value} is not a valid email! `,
        },
    },
    mobile: {
        type: String,
        },
    otp: {
        type: String,
        required: true
        },
    createdAt: { type: Date, default: Date.now, index: { expires: 300 } },
    },
    { timeStamps: true }
);

module.exports = mongoose.model("Otp", OtpSchema);
