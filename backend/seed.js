const mongoose = require("mongoose");
const dotenv = require("dotenv");

const User = require("./models/User");
const Project = require("./models/Project");
const Bug = require("./models/Bug");

dotenv.config();

const seedData = async () => {

    try {

        // ============================
        // Connect MongoDB
        // ============================

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        // ============================
        // Clear old test data
        // ============================

        // IMPORTANT:
        // Do NOT bcrypt.hash here.
        // User.js will hash it automatically.

        const password = "password123";

        // ============================
        // USERS
        // ============================

        const admin = await User.create({
            name: "Admin User",
            email: "admin@bugtracker.com",
            password: password,
            role: "admin",
            team: ""
        });

        const developer1 = await User.create({
            name: "John Developer",
            email: "john@bugtracker.com",
            password: password,
            role: "developer",
            team: "frontend"
        });

        const developer2 = await User.create({
            name: "David Developer",
            email: "david@bugtracker.com",
            password: password,
            role: "developer",
            team: "backend"
        });

        const developer3 = await User.create({
            name: "Arun Developer",
            email: "arun@bugtracker.com",
            password: password,
            role: "developer",
            team: "frontend"
        });

        const tester = await User.create({
            name: "Tester User",
            email: "tester@bugtracker.com",
            password: password,
            role: "tester",
            team: "qa"
        });

        console.log("Users created");

        // ============================
        // PROJECTS
        // ============================

        const bugTracker = await Project.create({
            name: "Bug Tracker",
            description: "Bug management application",
            status: "active",
            createdBy: admin._id
        });

        const ecommerce = await Project.create({
            name: "E-Commerce Application",
            description: "Online shopping application",
            status: "active",
            createdBy: admin._id
        });

        const crm = await Project.create({
            name: "CRM System",
            description: "Customer relationship management system",
            status: "on_hold",
            createdBy: admin._id
        });

        console.log("Projects created");

        // ============================
        // BUGS
        // ============================

        await Bug.create([

            {
                title: "Login button not working",

                description:
                    "Clicking the login button does not submit the form.",

                project: bugTracker._id,

                reporter: tester._id,

                assignedTo: developer1._id,

                team: "frontend",

                priority: "high",

                status: "pending",

                bugUrl:
                    "https://example.com/bugs/login-button",

                imageUrl: ""
            },

            {
                title: "API returns 500 error",

                description:
                    "Projects API returns a 500 response when the database is unavailable.",

                project: bugTracker._id,

                reporter: tester._id,

                assignedTo: developer2._id,

                team: "backend",

                priority: "urgent",

                status: "in_progress",

                bugUrl:
                    "https://example.com/bugs/projects-api",

                imageUrl: ""
            },

            {
                title: "Dashboard alignment issue",

                description:
                    "Dashboard cards are not aligned correctly on smaller screens.",

                project: bugTracker._id,

                reporter: tester._id,

                assignedTo: developer3._id,

                team: "frontend",

                priority: "medium",

                status: "resolved",

                bugUrl:
                    "https://example.com/bugs/dashboard-alignment",

                imageUrl: ""
            },

            {
                title: "Product search is slow",

                description:
                    "Product search takes more than five seconds to return results.",

                project: ecommerce._id,

                reporter: tester._id,

                assignedTo: developer2._id,

                team: "backend",

                priority: "high",

                status: "pending",

                bugUrl:
                    "https://example.com/bugs/product-search",

                imageUrl: ""
            },

            {
                title: "Cart item quantity incorrect",

                description:
                    "Cart quantity does not update correctly after refreshing the page.",

                project: ecommerce._id,

                reporter: tester._id,

                assignedTo: developer1._id,

                team: "frontend",

                priority: "medium",

                status: "reopened",

                bugUrl:
                    "https://example.com/bugs/cart-quantity",

                imageUrl: ""
            },

            {
                title: "Customer API validation missing",

                description:
                    "Customer API accepts invalid email addresses.",

                project: crm._id,

                reporter: tester._id,

                assignedTo: developer2._id,

                team: "backend",

                priority: "high",

                status: "closed",

                bugUrl:
                    "https://example.com/bugs/customer-validation",

                imageUrl: ""
            }

        ]);

        console.log("Bugs created");

        // ============================
        // LOGIN DETAILS
        // ============================

        console.log("\n=================================");
        console.log("TEST DATA CREATED SUCCESSFULLY");
        console.log("=================================\n");

        console.log("ADMIN");
        console.log("Email    : admin@bugtracker.com");
        console.log("Password : password123\n");

        console.log("DEVELOPER 1");
        console.log("Email    : john@bugtracker.com");
        console.log("Password : password123");
        console.log("Team     : frontend\n");

        console.log("DEVELOPER 2");
        console.log("Email    : david@bugtracker.com");
        console.log("Password : password123");
        console.log("Team     : backend\n");

        console.log("DEVELOPER 3");
        console.log("Email    : arun@bugtracker.com");
        console.log("Password : password123");
        console.log("Team     : frontend\n");

        console.log("TESTER");
        console.log("Email    : tester@bugtracker.com");
        console.log("Password : password123");
        console.log("Team     : qa\n");

        await mongoose.connection.close();

        console.log("MongoDB connection closed");

        process.exit(0);

    } catch (error) {

        console.error("Seed error:", error);

        await mongoose.connection.close();

        process.exit(1);
    }
};

seedData();