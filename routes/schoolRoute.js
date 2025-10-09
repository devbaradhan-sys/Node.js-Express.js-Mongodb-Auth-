const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const adminController = require("../controllers/adminController");
// Protected dashboard
const { verifyToken } = require("../middleware/authMiddleware");

// Public routes
router.get("/students", verifyToken , studentController.liststudents);
router.get("/editstudent/:id", verifyToken , studentController.editstudentform);
router.post("/editstudent", verifyToken , studentController.editstudentdata);


router.get("/teachers", adminController.listteachers);
router.get("/deletestudent/:id", verifyToken, adminController.deletestudentdata);
router.get("/editteacher/:id", verifyToken, adminController.editteacherform);
router.get("/deleteteacher/:id", verifyToken, adminController.deleteteacherdata);

module.exports = router;

  