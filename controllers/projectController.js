import Project from "../models/Project.js";
export const createProject = async (req, res) => {
  try {

    console.log("BODY:", req.body);
    console.log("USER:", req.user);

    const {
      title,
      description,
      projectType,
      requiredSkills,
      teamSize,
      mode,
      expectedDuration
    } = req.body;

    const project = await Project.create({
      title,
      description,
      projectType,
      requiredSkills,
      teamSize,
      mode,
      expectedDuration,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: "Project Created Successfully",
      project
    });
  } catch (error) {

    console.log("PROJECT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
}
};

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project
      .find()
      .populate("createdBy", "name email");
    res.status(200).json({
      success: true,
      projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getMyProjects = async (req, res) => {
  try {

    const projects = await Project.find({
      createdBy: req.user._id
    });

    res.status(200).json({
      success: true,
      projects
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

export const getProjectById = async (req, res) => {
  try {

    const project = await Project
      .findById(req.params.id)
      .populate("createdBy", "name email");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    res.status(200).json({
      success: true,
      project
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

export const updateProject = async (req, res) => {
  try {

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success:false,
        message:"Project not found"
      });
    }

    if (
      project.createdBy.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success:false,
        message:"Access Denied"
      });
    }

    const updatedProject =
      await Project.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new:true }
      );

    res.status(200).json({
      success:true,
      message:"Project Updated Successfully",
      project:updatedProject
    });

  } catch(error) {

    res.status(500).json({
      success:false,
      message:error.message
    });

  }
};

export const deleteProject = async (req, res) => {
  try {

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success:false,
        message:"Project not found"
      });
    }

    if (
      project.createdBy.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success:false,
        message:"Access Denied"
      });
    }

    await project.deleteOne();

    res.status(200).json({
      success:true,
      message:"Project Deleted Successfully"
    });

  } catch(error) {

    res.status(500).json({
      success:false,
      message:error.message
    });

  }
};