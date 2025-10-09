const User = require("../models/UserModel");
const Subject = require("../models/studentsubjectsModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const verifyToken = require('../middleware/authMiddleware')
const mongoose = require("mongoose");
// Show Register Form
exports.registerForm = (req, res) => {
  res.render("auth/register", { title: "Register", layout: "auth" });
};

// Handle Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, userType } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("auth/register", { 
        title: "Register",
        layout: "auth",
        error: "User already exists!"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, userType });
    const savedUser = await newUser.save();

// 🔹 If user is STUDENT, create a subject record
    if (userType === "STUDENT") {
      const newSubject = new Subject({
        user_id: savedUser._id
      });
      await newSubject.save();
    }

    return res.redirect("/");
  } catch (err) {
    console.error(err);
    res.render("auth/register", { 
      title: "Register",
      layout: "auth",
      error: "Something went wrong, please try again."
    });
  }
};

// Middleware to check authentication
exports.loginForm = (req, res) => {
  res.render("auth/login", { title: "Login", layout: "auth" });
};

// Handle Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.render("auth/login", { 
        title: "Login",
        layout: "auth",
        error: "Invalid email or password"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("auth/login", { 
        title: "Login",
        layout: "auth",
        error: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.userType , name:user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log('token-->',token);

// Send JWT as a secure httpOnly cookie
res.cookie("token", token, {httpOnly: true});

res.redirect("/dashboard");

  } catch (err) {
    console.error(err);
    res.render("auth/login", { 
      title: "Login",
      layout: "auth",
      error: "Something went wrong, please try again."
    });
  }
};

exports.dashboard = async (req, res) => {
   console.log('userpayload-->',req.user)
  const users = await User.find();
  const studentsCount = users.filter(u => u.userType === "STUDENT").length;
  const teachersCount = users.filter(u => u.userType === "TEACHER").length;

  let studentsWithSubjects= [];

if(req.user.role == "STUDENT"){
   studentsWithSubjects = await User.aggregate([
      { $match: { userType: "STUDENT" , _id:new mongoose.Types.ObjectId(req.user.id)  } }, // only students
      {
        $lookup: {
          from: "subjects",              // collection name in MongoDB
          localField: "_id",             // user._id
          foreignField: "user_id",       // subject.user_id
          as: "subjects"
        }
      },
      {
        $unwind: {
          path: "$subjects",
          preserveNullAndEmptyArrays: true
        }
      }
    ]);
  }

 console.log('studentsWithSubjects-->',studentsWithSubjects);

  res.render("index", {
    title: req.user.role == "ADMIN" ? "Admin Dashboard" : req.user.role == "TEACHER" ? "Teacher Dashboard" : "Student Dashbaord" ,
    year: new Date().getFullYear(),
    user: req.user,
    stats: { students: studentsCount, teachers: teachersCount },
    students: studentsWithSubjects || [],
  });
};

// Logout
exports.logout = (req, res) => {
  res.clearCookie("token");  // if JWT stored in cookies
  res.redirect("/");         // back to login
};
