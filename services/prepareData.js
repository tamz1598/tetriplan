require('dotenv').config();
const mongoose = require('mongoose');
const Task = require('../model/taskModel');
const User = require('../model/userModel');

mongoose.connect(process.env.MONGODB_CONNECT_URI, {});

async function prepareData() {
  const users = await User.find({});
  const tasks = await Task.find({});

  // Create user and task indices
  // userID = 1 etc
  // taskID = 1 etc
  const userIndex = {};
  const taskIndex = {};
  users.forEach((user, i) => userIndex[user._id] = i);
  tasks.forEach((task, i) => taskIndex[task._id] = i);

  // Create interaction matrix, will start at 0 due to no interaction as of yet
  // Creates the table here, for every null user it creates a task with the value of 0.
  const matrix = Array(users.length).fill(null).map(() => Array(tasks.length).fill(0));

  //map through task and give it binary numbers.
  //1 = the user has the task
  //0 = the user does not have the task
  tasks.forEach(task => {
    const userIdx = userIndex[task.userID];
    const taskIdx = taskIndex[task._id];
    if (userIdx !== undefined && taskIdx !== undefined) {
      matrix[userIdx][taskIdx] = 1; 
    }
  });

  return { matrix, userIndex, taskIndex, users, tasks };
}




module.exports = { prepareData };