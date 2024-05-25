const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// task scheme
const taskSchema = new Schema({
    userID: {
      type: mongoose.Schema.Types.ObjectId,
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
    dateAdded: {
      type: Date,
      default: () => Date.now(),
      immutable: true,
    },
    __v: {
      type: Number,
    },
    calendar: {
      type: String,
    },
  });

  const Task = model("Task", taskSchema, "tetriplan-tasks");

  module.exports = Task;