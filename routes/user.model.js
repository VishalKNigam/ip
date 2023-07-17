const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const UserSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    pass: {type: String, required: true}
},
    {timestamps: true}
)
const UserModel = mongoose.model("user", UserSchema);
module.exports = {UserModel};