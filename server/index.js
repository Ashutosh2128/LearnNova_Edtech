const express = require("express");
const app = express();

// Import all the routes
const authRoutes = require("./routes/Auth");
const profileRoutes = require("./routes/Profile");
// const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");
const contactUsRoutes = require("./routes/Contact");

// database import
const database = require("./config/database");

const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 4000;

// database connect
database.connect();
// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
)
// file upload middleware
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp",
    })
)
// cloudinary connection
cloudinaryConnect();

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
// app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoutes);

// def route

app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Your server is up and running....",
    });
});

app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`);
})














// Initial flow
// const express = require("express");
// const app = express();

// require("dotenv").config();
// const PORT = process.env.PORT || 4000;

// app.use(express.json);

// const database = require("./config/database");
// database.connect();

// app.get("/", (req, res) => {
//     return res.json({
//         success: true,
//         message: "Your server is up and running...",
//     })
// });

// app.listen(PORT, () => {
//     console.log(`App is running at ${PORT}`);
// })