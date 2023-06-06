const User = require("../model/user");
const Otp = require("../model/otp");
const authService = require("../service/auth_service");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
require("dotenv").config();
const otpGenerator = require("otp-generator");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

const generateOtp = () => {
    const OTP = otpGenerator.generate(6, {
        number: true,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
    });
    console.log(OTP);
    return OTP;
};

    const sendOtpToEmail = async (email, OTP) => {
    const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    },
});

    await transporter.sendMail({
        from: `"Message from Hotel Reservation System" <process.env.AUTH_EMAIL>`,
        to: email,
        subject: "OTP Verifictaion",
        html: `<b>The OTP: ${OTP} will expires in 5 mins. </b>`,
    });
    return;
};

const sendOtpToMobile = async (mobile, OTP) => {
    await client.messages.create({
        body: `The OTP: ${OTP} will expires in 5 mins. `,
        from: process.env.TWILIO_FROM,
        to: `${mobile}`,
    });
    return;
};

exports.signup = async (req, res) => {
    try {
        const { name, email, password, mobile, role } = req.body;
        const user = new User({ name, email, password, mobile, role });
        const _id = await authService.signup(user);

        const OTP = generateOtp();
        await sendOtpToEmail(email, OTP);
        await sendOtpToMobile(mobile, OTP);

        const otp = new Otp({ email: email, mobile: mobile, otp: OTP });
        await authService.saveOtpToDB(otp);

        res.status(201).json({
            id: _id,
            message:"OTP sent successfully on your registered email and mobile number. Please Verify",
    });
    } catch (error) {
        console.log("error in user post ", error);
        res.status(400).send({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password: inputPassword } = req.body;

        const token = await authService.login(email, inputPassword);

        res.status(200).send({ token: token });
    } catch (error) {
        console.log("error in user post ", error);
        res.status(400).send({ message: error.message });
    }
};

exports.logout = async (req, res) => {
    try {
        let loggedInUser = req.loggedInUser;

        await authService.logout(loggedInUser._id);
        res.status(200).send({ message: "Logged out successfully" });
    } catch (error) {
        console.log("error in user post ", error);
        res.status(401).send({ message: error.message });
    }
};

exports.verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader)
        throw new Error({ message: "Access Denied. Please send Token" }); 

    const token = authHeader.split(" ")[1];
    if (!token)
        throw new Error({ message: "Access Denied. Please send Token" });
    console.log("token" + token);

    const user = await authService.verifyToken(token);
    req.loggedInUser = user;
    next();
    } catch (error) {
    console.log("error in user post ", error);
    res.status(400).send({ message: error.message });
    }
};

exports.verifyOtpByEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const otpHolder = await Otp.findOne({ email });
    if (!otpHolder) {
        return res.status(400).json({ message: "OTP not found" });
    }

    const isOtpValid = await bcrypt.compare(otp, otpHolder.otp);
    if (!isOtpValid) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    await User.updateOne({ email: email }, { emailVerified: true });
    const userInDB = await User.findOne({ email: email });
    if (userInDB.mobileVerified == true) await Otp.deleteOne({ email: email });

    return res.status(200).json({
        message: "Email verified Succesfully",
    });
    } catch (error) {
        console.log("Error in verifying OTP ", error);
        res.status(400).send({ message: error.message });
}
};

exports.verifyOtpByMobile = async (req, res) => {
    try {
        const { mobile, otp } = req.body;
        const otpHolder = await Otp.findOne({ mobile });
        if (!otpHolder) {
            return res.status(400).json({ message: "OTP not found" });
    }

    const isOtpValid = await bcrypt.compare(otp, otpHolder.otp);
    if (!isOtpValid) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    await User.updateOne({ mobile: mobile }, { mobileVerified: true });
    const userInDB = await User.findOne({ mobile: mobile });
    if (userInDB.emailVerified == true) await Otp.deleteOne({ mobile: mobile });

    return res.status(200).json({
        message: "Mobile number verified successfully",
    });
    } catch (error) {
        console.log("Error in verifying OTP ", error);
        res.status(400).send({ message: error.message });
    }
};
