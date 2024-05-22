const Task = require('../model/taskModel')
const {ObjectId} = require('mongodb')
const {getPriorityValue} = require('../utils/taskUtils')

exports.getAllTasks = async (req, res) => {
    try {
      const tasks = await Task.find();
      res.status(200).json(tasks);
    } catch (error) {
      console.error("Error fetching tasks", error);
      res.status(400).json({ message: "Error getting tasks" });
    }
};

exports.addTask = async (req, res) => {
    const taskData = req.body;
    if(!taskData.description) return res.status(400).end()
    try {
      const newtask = new Task(taskData);
      const savedTask = await newtask.save();
      res.status(201).json(savedTask);
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(400).json({ message: "Error" });
    }
};

exports.getTaskById = async (req, res) => {
    const { taskID } = req.params;
    try {
        await Task.getTaskById(new ObjectId(taskID));
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(400).json({ message: "Error" });
    }
};

exports.getAllTasksById = async (req, res) => {
    const { userID } = req.params;
    try {
        const tasks = await Task.find({ userID });
        if(!tasks.length === 0){
            res.status(200).json(tasks);
        } else{
            res.status(404).json({ message: "no tasks found with this id" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllTasksByIdAndCategory = async (req, res) => {
    const { userID, category } = req.params;
    try {
        const tasks = await Task.find({ userID, category });
        if(!tasks.length === 0){
            res.status(200).json(tasks);
        } else{
            res.status(404).json({ message: "no tasks found with this id" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTasksByIdSortedByDate = async (req, res) => {
    const { userID } = req.params;
    try {
        const tasks = await Task.find({ userID }).sort({ date: -1 });
        if(!tasks.length === 0){
            res.status(200).json(tasks);
        } else{
            res.status(404).json({ message: "no tasks found with this id" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllTasksByIdAndPriority = async (req, res) => {
    const { userID } = req.params;
    const { priority } = req.body;

    if (!priority) {
        return res.status(404).json( {message: "no priority values found"} )
    }

    try {
        const tasks = await Task.find({ userID });
        tasks.sort((a,b) => getPriorityValue(b.priority) - getPriorityValue(a.priority))

        if(!tasks.length === 0){
            res.status(200).json(tasks);
        } else{
            res.status(404).json({ message: "no tasks found with this id" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.patchTask = async (req, res) => {
    const { taskId } = req.params;
    const updates = req.body;
    try {
        await Task.findByIdAndUpdate(taskId, updates);
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(400).json({ message: "Error" });
    }
};

exports.deleteTaskById = async (req, res) => {
    const { taskId } = req.params;
    try {
        await Task.findByIdAndDelete(taskId);
        console.log("Task deleted");
    } catch (error) {
        console.error("Error deleting this task:", error);
        res.status(400).json({ message: "Error" });
    }
};