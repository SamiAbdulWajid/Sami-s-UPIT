// models/User.js
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const { v4: uuidv4 } = require("uuid");
const Project = require("./Project");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  projects: [
    {
      project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
      role: { type: String, default: "participant" } // "creator" or "participant"
    }
  ],

  profilePic: { type: String, default: "" }

});

userSchema.plugin(passportLocalMongoose, { usernameField: "email" });

userSchema.post("findOneAndDelete", async function (doc) {
  try {
    if (!doc) return;
    // Only delete projects where the user is the creator
    const creatorProjectIds = Array.isArray(doc.projects)
      ? doc.projects
        .filter(p => p.role === "creator" && p.project)
        .map(p => p.project)
      : [];
    if (creatorProjectIds.length === 0) return;
    const res = await Project.deleteMany({ _id: { $in: creatorProjectIds } });
    console.log("Deleted projects created by user:", res);
  } catch (err) {
    console.log("Error deleting the Projects", err);
  }
});

module.exports = mongoose.model("User", userSchema);
