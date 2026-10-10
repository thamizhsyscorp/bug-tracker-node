require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const path = require("path");
const connectDB = require("./config/db");
const { loginMiddleware } = require("./middlewares/middlewares");
const User = require("./models/User");
const bugRoutes = require("./routes/bugRoutes");
const projectRoutes = require("./routes/projectRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

connectDB();

app.use("/images",express.static(path.join(__dirname, "images")));

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({extended: true}));


app.post("/api/login",loginMiddleware,async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({email});
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "User not found"
                });
            }
            if (!user.isActive) {
                return res.status(403).json({
                    success: false,
                    message: "User account is inactive"
                });
            }
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid password"
                });
            }
            const token = jwt.sign(
                {
                    id: user._id.toString(),
                    role: user.role
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1h"
                }
            );
            return res.status(200).json({
                success: true,
                message: "Login successful",
                token,

                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    team: user.team
                }
            });

        } catch (error) {

            console.error("Login error:", error);

            return res.status(500).json({
                success: false,
                message: "Server error"
            });
        }
    }
);


app.get("/", (req, res) => {
    console.log("Hello from the backend!");
    res.send("Bug Tracker API is running");
});
app.use("/api/bugs", bugRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `Server running on http://localhost:${PORT}`
    );
});