const mongoose = require('mongoose');
const User = require('./User');


const courseSchema = new mongoose.Schema({
    name: { type: String },
    description: { type: String },
    imgURL: { type: String },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("Course", courseSchema);