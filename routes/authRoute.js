const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
// Protected dashboard
const { verifyToken } = require("../middleware/authMiddleware");

// Public routes
router.get("/register", authController.registerForm);
router.post("/register", authController.register);
router.get("/", authController.loginForm);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

router.get("/dashboard", verifyToken, authController.dashboard);

module.exports = router;
