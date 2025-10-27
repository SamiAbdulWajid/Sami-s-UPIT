require('dotenv').config();
const express = require("express");
const cors = require("cors");

const projects = require("./routes/project.js");
const users = require("./routes/user.js");

const methodOverride = require("method-override");
const path = require("path");

const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const MongoStore=require('connect-mongo');
const User = require("./models/User");
const ExpressError = require("./utils/ExpressError.js");
const dbUrl=process.env.MONGODB_URI;

const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SESSION_SECRET
  },
  touchAfter:24 * 3600,
});

store.on("error" ,()=>{
  console.log("error is mongo session store",err);
})

const sessionOptions = {
  store,
  secret: process.env.SESSION_SECRET, // change this to env variable in production
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires:Date.now() + 7 * 24 *60 *60 *1000,
    maxAge:7 * 24 *60 *60 *1000,
    httpOnly:true,
     sameSite: "none",   // <--- add this
    secure: true   
  }
}

const app = express();
const port = process.env.PORT || 8080;

// ================== MONGODB CONNECTION ================== //
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ================== MIDDLEWARE ================== //

// app.use(cors({
//   origin: "http://localhost:5173",
//     // <-- your React/Vite dev server
//   credentials: true                // <-- allow cookies to be sent
// }));

app.use(cors({
  origin: [
    "http://localhost:5173", // for local development
    "https://sami-s-upit-frontend.onrender.com" // for deployed frontend
  ],
  credentials: true
}));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb" }));
 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// ✅ Add session BEFORE passport
app.use(session(sessionOptions));

//new 
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//new 

// ================== ROUTES ================== //

app.use("/projects", projects);
app.use("/users", users);

// ================== ERROR HANDLING ================== //

app.use((req, res, next) => {
  next(new ExpressError(404, "Page not Found"));
});

app.use((err, req, res, next) => {
  console.error("Error handler caught:", err);

  if (err.code === 11000) {
    return res.status(400).json({ success: false, message: "Project name already exists" });
  }

  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).json({ error: message });
});

// ================== START SERVER ================== //
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
