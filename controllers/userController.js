import User from "../models/User.js";

export const updateProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const {
      bio,
      skills,
      github,
      linkedin,
      portfolio
    } = req.body;

    user.bio = bio || user.bio;
    user.skills = skills || user.skills;
    user.github = github || user.github;
    user.linkedin = linkedin || user.linkedin;
    user.portfolio = portfolio || user.portfolio;

    user.profileCompleted = true;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      user
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};

export const getProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user._id)
      .select("-password");

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};

export const completeProfile = async (
  req,
  res
) => {
  try {

    const {
      phone,
      bio,
      skills,
      github,
      linkedin,
      portfolio
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        phone,
        bio,
        skills,
        github,
        linkedin,
        portfolio,
        profileCompleted: true
      },
      { new: true }
    );

    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};