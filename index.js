const express = require("express");
const cors = require('cors');
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;
const dbConnect = require("./utils/dbConnect");
const bodyParser = require("body-parser");
const swaggerUi = require('swagger-ui-express');
swaggerDocument = require('./swagger.json');
const authRouter = require("./routes/auth_routes");
const hotelRouter = require("./routes/hotel_routes");
const bookingRouter = require("./routes/booking_routes")

dbConnect.initDB();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api/hotel", hotelRouter);
app.use("/api/booking", bookingRouter);

app.use((req, res, next) => {
    console.log("Hello from middleware");
    next();
});

process.on("SIGINT", () => {
    dbConnect.disconnectDB();
    console.log("Closing server");
    process.exit();
});

process.on("exit", () => {
    console.log("Server closed");
});

app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});