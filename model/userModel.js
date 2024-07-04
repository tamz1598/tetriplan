const mongoose = require("mongoose");
const { Schema, model } = mongoose;

//user schema
const userSchema = new Schema({
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  });


const User = model("User", userSchema, "tetriplan-users");

module.exports = User;