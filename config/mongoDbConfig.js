const mongoose = require("mongoose");

console.log("process.env.MONGODB_URL-->",process.env.MONGODB_URL);

const connectToDatabase = async () => {
  try {
    const MONGODB_URL = process.env.MONGODB_URL;
    await mongoose.connect(MONGODB_URL);
    console.log('Mongo Db is connected');
  } catch (error) {
      console.log(error);
    console.error("App starting error:", error.message);
    process.exit(1);
  }
};

module.exports = connectToDatabase;