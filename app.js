const express = require("express");
const pagesRouter = require("./routes");
const path = require("path");
const exphbs = require('express-handlebars');
const app = express();
const port = 3000;
const cookieParser = require("cookie-parser");
require("dotenv").config();

//Starters
const connectToDatabase = require("./config/mongoDbConfig");
const hbsHelpers = require('./helpers/helpers');

//cookie parser
app.use(cookieParser()); 

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS, JS, images)
app.use(express.static("public"));

// Set view engine to hbs
app.engine('hbs', exphbs.engine({
extname: '.hbs',
defaultLayout: 'main', // If main.hbs is your default layout
layoutsDir: __dirname + '/views/layouts/', // Adjust if your layouts are elsewhere
partialsDir: __dirname + '/views/partials/',
  helpers: hbsHelpers 
}));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// Use routes
app.use("/", pagesRouter);

//connect database
connectToDatabase();

// Start server
app.listen(port, () => {
  console.log(`Portfolio server running at http://localhost:${port}`);
});
