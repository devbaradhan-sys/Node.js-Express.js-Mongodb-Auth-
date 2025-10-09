const User = require("../models/UserModel");
const Subject = require("../models/studentsubjectsModel");
const mongoose = require("mongoose");

exports.liststudents = async (req, res) => {
  try{
  let studentsWithSubjects= [];

   studentsWithSubjects = await User.aggregate([
      { $match: { userType: "STUDENT"  } }, // only students
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

 console.log('studentsWithSubjects-->',studentsWithSubjects);

  res.render("school/liststudents", {
    title: "List student" ,
    year: new Date().getFullYear(),
    user: req.user,
    students: studentsWithSubjects || [],
  });
}
 catch (err) {
    console.error("Error fetching student:", err);
    res.status(500).send("Error loading student list");
  }
};

exports.editstudentform = async (req,res) =>{
  try{
console.log('req.params.id',req.params.id);
const studentWithSubjects = await User.aggregate([
      { $match: { _id: mongoose.Types.ObjectId.createFromHexString(req.params.id) } }, // only students
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

 console.log('studentsWithSubjects-->',studentWithSubjects);

  res.render("school/editstudents", {
    title: "Edit student" ,
    year: new Date().getFullYear(),
    user: req.user,
    students: studentWithSubjects[0] || {},
  });
}
 catch (err) {
    console.error("Error loading student edit form:", err);
    res.status(500).send("Error loading student editform");
  }
};

exports.editstudentdata = async (req,res) =>{
  try{

 const { id , maths , science , social } = req.body;

// Calculate total
const total = Number(maths) + Number(science) + Number(social);

// Update the data
await Subject.findOneAndUpdate(
  { user_id: id },
  { 
    $set: { 
      maths: Number(maths), 
      science: Number(science), 
      social: Number(social), 
      total 
    } 
  },
  { new: true } // returns the updated document
);

res.redirect('/school/students');

}
 catch (err) {
    console.error("Error editing student edit form:", err);
    res.status(500).send("Error editing student");
  }
};

