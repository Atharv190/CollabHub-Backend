import Application from "../models/Application.js";
import Project from "../models/Project.js";
import cloudinary from "../config/cloud.js";
import streamifier from "streamifier";
import axios from "axios";

export const viewResume = async (req, res) => {
  try {

    const application =
      await Application.findById(
        req.params.applicationId
      );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    const response = await axios.get(
      application.resumeUrl,
      {
        responseType: "stream"
      }
    );

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    response.data.pipe(res);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

export const downloadResume = async (
  req,
  res
) => {
  try {

    const application =
      await Application.findById(
        req.params.applicationId
      );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    const response = await axios.get(
      application.resumeUrl,
      {
        responseType: "stream"
      }
    );

    const fileName =
      application.resumeName ||
      "Resume.pdf";

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName}"`
    );

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    response.data.pipe(res);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

export const applyToProject = async (req, res) => {
try {

const { projectId } = req.params;

const project = await Project.findById(projectId);

if (!project) {
  return res.status(404).json({
    success: false,
    message: "Project not found"
  });
}

// Owner cannot apply
if (
  project.createdBy.toString() ===
  req.user._id.toString()
) {
  return res.status(400).json({
    success: false,
    message: "You cannot apply to your own project"
  });
}

// Team Full Check
if (
  project.currentMembers >=
  project.teamSize
) {
  return res.status(400).json({
    success: false,
    message: "Team is already full"
  });
}

// Duplicate Application Check
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

let resumeUrl = "";
let resumePublicId = "";
let resumeName = "";

if (req.file) {

  const uploadFromBuffer = () =>
    new Promise((resolve, reject) => {

      const stream =
  cloudinary.uploader.upload_stream(
    {
      folder: "collabhub/resumes",
      resource_type: "raw",
      use_filename: true,
      unique_filename: true
    },
    (error, result) => {

      if (error) {
        reject(error);
      } else {
        resolve(result);
      }

    }
  );

      streamifier
        .createReadStream(req.file.buffer)
        .pipe(stream);

    });

  const result =
    await uploadFromBuffer();

  resumeUrl = result.secure_url;
resumePublicId = result.public_id;
resumeName = req.file.originalname;
}

const application =
  await Application.create({
    projectId,
    applicantId: req.user._id,
    resumeUrl,
    resumePublicId,
    resumeName,
    coverLetter: req.body.coverLetter
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

/* ===========================
Get Project Applicants
=========================== */

export const getProjectApplicants = async (req, res) => {
try {

const { projectId } = req.params;

const project = await Project.findById(
  projectId
);

if (!project) {
  return res.status(404).json({
    success: false,
    message: "Project not found"
  });
}

// Only Owner Can View Applicants

if (
  project.createdBy.toString() !==
  req.user._id.toString()
) {
  return res.status(403).json({
    success: false,
    message: "Access Denied"
  });
}

const applications =
  await Application.find({
    projectId
  })
  .populate(
    "applicantId",
    "name email phone bio skills github linkedin portfolio"
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

/* ===========================
Accept Application
=========================== */

export const acceptApplication = async (req, res) => {
try {

const application =
  await Application.findById(
    req.params.applicationId
  );

if (!application) {
  return res.status(404).json({
    success: false,
    message: "Application not found"
  });
}

const project =
  await Project.findById(
    application.projectId
  );

if (!project) {
  return res.status(404).json({
    success: false,
    message: "Project not found"
  });
}

// Only Owner Can Accept

if (
  project.createdBy.toString() !==
  req.user._id.toString()
) {
  return res.status(403).json({
    success: false,
    message: "Access Denied"
  });
}

// Already Processed

if (
  application.status !== "Pending"
) {
  return res.status(400).json({
    success: false,
    message:
      "Application already processed"
  });
}

// Team Full Check

if (
  project.currentMembers >=
  project.teamSize
) {
  return res.status(400).json({
    success: false,
    message: "Team is already full"
  });
}

application.status = "Accepted";

await application.save();

project.currentMembers += 1;

await project.save();

res.status(200).json({
  success: true,
  message: "Application Accepted"
});


} catch (error) {

console.log(error);

res.status(500).json({
  success: false,
  message: error.message
});


}
};

/* ===========================
Reject Application
=========================== */

export const rejectApplication = async (req, res) => {
try {

const application =
  await Application.findById(
    req.params.applicationId
  );

if (!application) {
  return res.status(404).json({
    success: false,
    message: "Application not found"
  });
}

const project =
  await Project.findById(
    application.projectId
  );

if (!project) {
  return res.status(404).json({
    success: false,
    message: "Project not found"
  });
}

// Only Owner Can Reject

if (
  project.createdBy.toString() !==
  req.user._id.toString()
) {
  return res.status(403).json({
    success: false,
    message: "Access Denied"
  });
}

// Already Processed

if (
  application.status !== "Pending"
) {
  return res.status(400).json({
    success: false,
    message:
      "Application already processed"
  });
}

application.status = "Rejected";

await application.save();

res.status(200).json({
  success: true,
  message: "Application Rejected"
});


} catch (error) {


console.log(error);

res.status(500).json({
  success: false,
  message: error.message
});


}
};

/* ===========================
My Applications
=========================== */

export const getMyApplications = async (req, res) => {
try {

const applications =
  await Application.find({
    applicantId: req.user._id
  })
  .populate(
    "projectId",
    "title description projectType mode currentMembers teamSize"
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
