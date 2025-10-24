const express = require("express");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/User");


// Models & utils
const Project = require("../models/Project");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");

const router = express.Router({ mergeParams: true });
const upload = multer({ 
  storage: multer.memoryStorage(), 
  limits: { fileSize: 20 * 1024 * 1024 } 
});


// ----------------- CREATE PROJECT -----------------
router.post("/", upload.array("files"), wrapAsync(async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "You must be logged in to create a Project :)" });
  }
  if (!req.body.metadata) {
    throw new ExpressError(400, "Send valid data");
  }

  let metadata;
  try {
    metadata = JSON.parse(req.body.metadata);
  } catch (err) {
    throw new ExpressError(400, "Metadata is not valid JSON");
  }

  // Validate participants by username
  const participants = metadata.participants || [];
if (participants.length > 0) {
  const currentUser = await User.findById(req.user._id);
  const filteredParticipants = participants.filter(p => p !== currentUser.username);

  const foundUsers = await User.find({ username: { $in: filteredParticipants } });
  if (foundUsers.length !== filteredParticipants.length) {
    const foundUsernames = foundUsers.map(u => u.username);
    const missing = filteredParticipants.filter(p => !foundUsernames.includes(p));
    return res.status(400).json({ message: `Participant(s) not found: ${missing.join(", ")}` });
  }

  // metadata.participants = filteredParticipants;
  metadata.participants = foundUsers.map(u => ({
  user: u._id,
  role: "participant"
}));
}

  const files = req.files
    .filter(file => file.originalname !== ".DS_Store")
    .map(file => ({
      id: uuidv4(),
      filename: file.originalname,
      content: file.buffer.toString("utf-8"),
      language: path.extname(file.originalname).substring(1) || "txt",
    }));

  const project = new Project({
    name: metadata.name,
    type: metadata.type,
    visibility: metadata.visibility,
    participants: metadata.participants,
    files,
    creator:req.user._id
  });

  const saved = await project.save();
  // Add project to creator's projects array
// await User.findByIdAndUpdate(req.user._id, { $push: { projects: saved._id } });
await User.findByIdAndUpdate(req.user._id, { $push: { projects: { project: saved._id, role: "creator" } } });

// Also add project to all participants' projects arrays
// if (metadata.participants && metadata.participants.length > 0) {
//   await User.updateMany(
//     { username: { $in: metadata.participants } },
//     { $push: { projects: saved._id } }
//   );
// }

if (metadata.participants && metadata.participants.length > 0) {
  for (const p of metadata.participants) {
    await User.findByIdAndUpdate(p.user, { $push: { projects: { project: saved._id, role: "participant" } } });
  }
}

  res.status(201).json(saved);
}));

// ----------------- GET MY PROJECTS -----------------
router.get("/my-projects", wrapAsync(async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  const user = await User.findById(req.user._id);

  const userProjects = user.projects.map(p => p.project);
  const projects = await Project.find({
  $or: [
    { creator: req.user._id },
    { _id: { $in: userProjects } }
  ]
});
  res.json({data:projects});
}));


// ----------------- SEARCH PROJECTS -----------------
router.get("/searchProject", wrapAsync(async (req, res) => {
  const { name } = req.query;
  let query = { visibility: "public" };

  if (name) {
    query.name = { $regex: name, $options: "i" }; // case-insensitive search
  }

  const projects = await Project.find(query).populate("creator");
const filteredProjects = projects.filter(p => p.creator !== null);
if (!filteredProjects.length) {
  return res.json({ success: false, message: "No projects found" });
}
res.json({ success: true, data: filteredProjects });

}));


// ----------------- GET ALL PROJECTS -----------------
router.get("/", wrapAsync(async (req, res) => {
  try {
    const projects = await Project.find();
    console.log("Projects:", projects);
    res.json(projects);
  } catch (err) {
    console.error("Error in /projects:", err);
    res.status(500).json({ error: err.message });
  }
}));


// ----------------- GET PROJECT BY ID -----------------
router.get("/:_id", wrapAsync(async (req, res) => {
  const { _id } = req.params;
  const project = await Project.findById(_id).populate("creator").populate("participants.user");;
  if (!project) throw new ExpressError(404, "Project not found");
  res.json(project);
}));



// DELETE PROJECT: Only creator can delete
router.delete("/:_id", wrapAsync(async (req, res) => {
  const { _id } = req.params;
  const project = await Project.findById(_id);
  if (!project) throw new ExpressError(404, "Project not found");

  // Only creator can delete
  if (!req.isAuthenticated() || String(project.creator) !== String(req.user._id)) {
    return res.status(403).json({ message: "Only the creator can delete this project." });
  }

  await Project.findByIdAndDelete(_id);
  res.json({ message: "Project deleted successfully" });
}));


router.patch("/:_id/files", wrapAsync(async (req, res) => {
  const { _id } = req.params;
  const { files } = req.body;
  const project = await Project.findById(_id).populate("participants.user");
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  // Check if user is creator or participant
  const isCreator = String(project.creator) === String(req.user._id);
  const isParticipant = project.participants.some(
    p => String(p.user._id || p.user) === String(req.user._id)
  );

  if (!req.isAuthenticated() || (!isCreator && !isParticipant)) {
    return res.status(403).json({ message: "Only the creator or a participant can edit files." });
  }

  project.files = files;
  await project.save();

  res.json({ success: true, message: "Files updated successfully", data: project });
}));


// PATCH PROJECT: Only creator can edit settings/name
router.patch("/:_id", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const project = await Project.findById(_id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // Only creator can edit project settings/name
    if (!req.isAuthenticated() || String(project.creator) !== String(req.user._id)) {
      return res.status(403).json({ message: "Only the creator can edit this project." });
    }

    const { name } = req.body;
    if (name) {
      const existingProject = await Project.findOne({ name: name, _id: { $ne: _id } });
      if (existingProject) {
        return res.status(400).json({
          success: false,
          message: "Project name already exists. Please provide a different name."
        });
      }
    }

    if (req.body.participants && req.body.participants.length > 0) {
  const updatedParticipants = [];
  for (const username of req.body.participants) {
    const userDoc = await User.findOne({ username });
    if (userDoc) {
      updatedParticipants.push({ user: userDoc._id, role: "participant" });
    } else {
      return res.status(400).json({ message: `User "${username}" does not exist.` });
    }
  }
  req.body.participants = updatedParticipants;
}

// If project is group and participants is now empty, set type to solo
if (
  project.type === "group" &&
  (!req.body.participants || req.body.participants.length === 0)
) {
  req.body.type = "solo";
}

    const updatedProject = await Project.findByIdAndUpdate(
      _id,
      req.body,
      { new: true, runValidators: true }
    );

    const newParticipantIds = req.body.participants.map(p => p.user.toString());
const allUserIds = await User.find({ "projects.project": _id }, "_id");
for (const user of allUserIds) {
  if (!newParticipantIds.includes(user._id.toString())) {
    await User.findByIdAndUpdate(user._id, {
      $pull: { projects: { project: _id } }
    });
  }
}

// Add project to new participants' projects array (if not already present)
for (const pid of newParticipantIds) {
  await User.findByIdAndUpdate(pid, {
    $addToSet: { projects: { project: _id, role: "participant" } }
  });
}

    res.json({ success: true, message: "Project updated successfully", data: updatedProject });
  } catch (error) {
    console.log(error);
    next(error);
  }
});


module.exports = router;
