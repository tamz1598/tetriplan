const express = require("express");
const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const app = express();

mongoose.set("strictQuery", false);

//connect to mongoose
mongoose
  .connect(
    "mongodb+srv://admin:tetriplan@cluster0.spo41rp.mongodb.net/tetriplan-tasks"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

//schema
const userSchema = new mongoose.Schema({
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
});

const taskSchema = new mongoose.Schema({
  userID: {
    type: Number,
    required: true,
  },
  taskName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
  },
  dateAdded: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  completionStatus: {
    type: Boolean,
    required: true,
    default: false,
  },
  label: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    required: true,
    lowercase: true,
  },
});

//error handling
app.all("*", (request, response, next) => {
  response.status(404).send({ message: "endpoint not found" });
});

app.use((err, request, response, next) => {
  if (err.status && err.message)
    response.status(err.status).send({ message: err.message });
  next(err);
});

app.use((err, request, response, next) => {
  response.status(500).send({ message: "internal server error" });
});

const Task = model("Task", taskSchema, "tetriplan-tasks");
const User = model("User", userSchema, "tetriplan-users");

module.exports = app;
module.exports = { Task, User };
