const express = require("express");
const app = express();
const authRouter = require("./authRoute");
const schoolRouter = require("./schoolRoute")
//const adminRouter = require("./adminRoute")
const { verifyToken } = require("../middleware/authMiddleware");

// Auth routes
app.use("/", authRouter);

app.use('/school', schoolRouter);

//app.use("/admin", adminRouter);

module.exports = app;
