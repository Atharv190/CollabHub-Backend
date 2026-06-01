import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    projectType: {
      type: String,
      enum: [
        "College Project",
        "Hackathon",
        "Startup Idea",
        "Open Source",
        "Freelance"
      ],
      required: true,
    },

    requiredSkills: [
      {
        type: String,
        required: true,
      },
    ],

    teamSize: {
      type: Number,
      required: true,
      min: 1,
    },

    currentMembers: {
      type: Number,
      default: 1,
    },

    mode: {
      type: String,
      enum: [
        "Online",
        "Offline",
        "Hybrid"
      ],
      required: true,
    },

    expectedDuration: {
      type: Number,
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;