import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resumeUrl: {
      type: String,
      default: "",
    },

    resumeName: {
  type: String,
  default: "",
},

    resumePublicId: {
      type: String,
      default: "",
    },

    coverLetter: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Accepted",
        "Rejected"
      ],
      default: "Pending",
    }
  },
  {
    timestamps: true,
  }
);

applicationSchema.index(
  {
    projectId: 1,
    applicantId: 1
  },
  {
    unique: true
  }
);

const Application = mongoose.model(
  "Application",
  applicationSchema
);

export default Application;