
const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/User");
const Project = require("../models/Project");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError.js");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Multer config for profile picture uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../uploads/profilePics");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, req.user._id + "_profile" + ext);
  }
});
const upload = multer({ storage });

// Profile picture upload route
router.post("/uploadProfilePic", upload.single("profilePic"), wrapAsync(async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  // Save the relative path to the user's profilePic field
  const profilePicPath = `/uploads/profilePics/${req.file.filename}`;
  await User.findByIdAndUpdate(req.user._id, { profilePic: profilePicPath });
  res.json({ message: "Profile picture updated", profilePic: profilePicPath });
}));

// Create a new User
router.post("/signup", wrapAsync(async (req,res,next) => {
   const { username, email, password } = req.body;
  const user = new User({ username, email });
  const registeredUser = await User.register(user, password);

  // Log the user in after signup to set the session cookie
  req.login(registeredUser, (err) => {
    if (err) return next(err);
    res.status(201).json({ message: "Signup successful", user: registeredUser });
  }); 
}));

// Deleting User
router.delete("/:_id", wrapAsync(async (req, res, next) => {
    try {
        const { _id } = req.params;
        // Delete all projects where this user is the creator
        await Project.deleteMany({ creator: _id });
        const deletingUser = await User.findByIdAndDelete(_id);
        if (!deletingUser) throw new ExpressError(404, "User not found");
        req.logout(function(err) {
            if (err) {
                console.error("Logout error after delete:", err);
                return next(err);
            }
            return res.json({ message: "User deleted and logged out" });
        });
    } catch (err) {
        console.error("Delete user error:", err);
        return res.status(500).json({ error: err.message || err });
    }
}));

// Login Route
// router.post("/login", (req, res, next) => {
//   passport.authenticate("local", (err, user, info) => {
//     if (err) return next(err);

//     if (!user) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     req.login(user, (err) => {
//       if (err) return next(err);
//       return res.json({ message: "Welcome back old Friend", user });
//     });
//   })(req, res, next);
// });

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    req.login(user, (err) => {
      if (err) return next(err);
      // Ensure session is saved before sending response
      req.session.save(() => {
        return res.json({ message: "Welcome back old Friend", user });
      });
    });
  })(req, res, next);
});

// Logout Route
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    console.log("User successfully logged out :)");
    return res.json({ message: "User successfully logged out" });
  });
});

// Check if user is logged in or not 
router.get("/checkAuth", (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({ isAuthenticated: true, user: req.user });
  }
  res.json({ isAuthenticated: false });
});

// Update password route
router.post("/updatePassword", wrapAsync(async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }
  const user = await User.findById(req.user._id);
  await user.setPassword(newPassword);
  await user.save();
  res.json({ message: "Password updated successfully" });
}));

module.exports = router;