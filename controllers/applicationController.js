import Application from "../models/Application.js";
import Project from "../models/Project.js";

export const applyToProject = async (req, res) => {
  try {

    const { projectId } = req.params;

    // Check project exists

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    // Prevent owner from applying

    if (
      project.createdBy.toString() ===
      req.user._id.toString()
    ) {
      return res.status(400).json({
        success: false,
        message: "You cannot apply to your own project"
      });
    }

    // Check duplicate application

    const existingApplication =
      await Application.findOne({
        projectId,
        applicantId: req.user._id
      });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "Already applied to this project"
      });
    }

    const application =
      await Application.create({
        projectId,
        applicantId: req.user._id
      });

    res.status(201).json({
      success: true,
      message: "Application Submitted Successfully",
      application
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

export const getProjectApplicants = async (req, res) => {
  try {

    const { projectId } = req.params;

    // Check project exists

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    // Only project owner can view applicants

    if (
      project.createdBy.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access Denied"
      });
    }

    const applications = await Application
      .find({ projectId })
      .populate("applicantId", "-password");

    res.status(200).json({
      success: true,
      applications
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

export const acceptApplication = async (req, res) => {
  try {

    const application = await Application.findById(
      req.params.applicationId
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    application.status = "Accepted";

    await application.save();

    await Project.findByIdAndUpdate(
      application.projectId,
      {
        $inc: {
          currentMembers: 1
        }
      }
    );

    res.status(200).json({
      success: true,
      message: "Application Accepted"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

export const rejectApplication = async (req, res) => {
  try {

    const application = await Application.findById(
      req.params.applicationId
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    application.status = "Rejected";

    await application.save();

    res.status(200).json({
      success: true,
      message: "Application Rejected"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

export const getMyApplications = async (req, res) => {
  try {

    const applications = await Application
      .find({
        applicantId: req.user._id
      })
      .populate(
        "projectId",
        "title projectType mode currentMembers teamSize"
      );

    res.status(200).json({
      success: true,
      applications
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

