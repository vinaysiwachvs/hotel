const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        validate: {
            validator: function(name) {
                return /^[a-zA-Z0-9 ]*$/.test(name);
            },
            message: (props) =>
                `${props.value} contains special characters which are not allowed!`,
        },
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        lowercase: true,
        immutable: true,
        validate: {
            validator: function(email) {
                var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                return re.test(email);
            },
            message: (props) => `${props.value} is not a valid email!`,
        },
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function(password) {
                var re =
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                return re.test(password);
            },
            message: (props) =>
                `${props.value} validation failed, Please user Speacial characters.`,
        },
    },
    joinedOn: {
        type: Date,
        default: Date.now(),
        immutable: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    token: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    mobileVerified: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
    book: [{
        hotelId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hotel"
        },
        rooms: {
            type: Number,
            default: 1
        }
    }]

});

UserSchema.pre("save", async function(next) {
    const encryptedPassword = await hashPassword(this.password);
    this.password = encryptedPassword;
    next();
});

const hashPassword = async(password) => {
    const salt = await bcrypt.genSalt(8);
    return await bcrypt.hash(password, salt);
};

UserSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);