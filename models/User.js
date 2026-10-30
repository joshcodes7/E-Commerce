const { required } = require("joi/lib/types/alternatives");
const { unique } = require("joi/lib/types/array");
const { timestamp } = require("joi/lib/types/date");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        username: { type:String, required:true, unique:true},
        email:  {type:String, required:true, unique:true},
        password:  {type:String, required:true},
        isAdmin: { type:Boolean, default:false}
    },
    { timestamp:true }
);

module.exports = mongoose.model("User" , UserSchema);