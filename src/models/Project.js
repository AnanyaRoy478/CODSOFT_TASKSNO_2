const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
{
    title: {
        type: String,
        required: true,
    },

    description: {
        type: String,
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],

    startDate: {
        type: Date,
    },

    deadline: {
        type: Date,
    },

    status: {
        type: String,
        enum: ["Planning", "In Progress", "Completed", "On Hold"],
        default: "Planning",
    },

    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
},
{
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model("Project", projectSchema);