// models/Project.js

const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const fileSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 }, // unique ID for each file
  filename: { type: String, required: true },
  content: { type: String, required: true },
  language: { type: String, required: true }
})

const participantSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  name: { type: String, required: true }
});

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },

   creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  files: [fileSchema],


  type: {
    type: String,
    enum: ["solo", "group"],
    default: "solo",
    required: true
  },

  visibility: {
    type: String,
    enum: ["private", "public"],
    default: "private",
    required: true
  },

//   participants: [
//     {
// type: String,
//   required: true
//     }
//       ],

participants: [
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, default: "participant" } // "participant"
  }
],

  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  }
});


module.exports = mongoose.model("Project", projectSchema);
