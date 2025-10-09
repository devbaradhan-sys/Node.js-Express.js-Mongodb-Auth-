const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true , default: null },
    maths: { type: Number, default: 0 , required: true },
    science: { type: Number, default: 0 , required: true},
    social: { type: Number, default: 0 ,  required: true},
    total: { type: Number, default: 0 ,  required: true}
  },{ timestamps: true });

  subjectSchema.pre("save", function (next) {
  this.total = this.maths + this.science + this.social;
  next();
});

module.exports = mongoose.model("Subject", subjectSchema);