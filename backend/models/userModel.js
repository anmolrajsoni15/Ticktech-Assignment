const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"]
    },
    age: {
        type: Number,
        required: [true, "Please enter your age"]
    },
    //hobbies as array of strings
    hobbies: [
        {
            type: String,
            // required: [true, "Please enter your hobbies"]
        }
    ]
});

module.exports = mongoose.model("User", userSchema);