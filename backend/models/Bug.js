const mongoose = require("mongoose");

const bugSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true
        },

        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true
        },

        reporter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        team: {
            type: String,
            enum: ["frontend", "backend", "fullstack", "qa"],
            default: "backend"
        },

        priority: {
            type: String,
            enum: ["low", "medium", "high", "urgent"],
            default: "medium"
        },

        status: {
            type: String,
            enum: [
                "assigned",
                "pending",
                "in_progress",
                "resolved",
                "closed",
                "reopened"
            ],
            default: "assigned"
        },

        bugUrl: {
            type: String,
            default: ""
        },

        imageUrl: {
            type: String,
            default: ""
        },

        resolvedAt: {
            type: Date,
            default: null
        },

        closedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Bug", bugSchema);