const User = require('../model/userModel')
const {ObjectId} = require('mongodb')

exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(400).json({ message: "Error" });
    }
};

exports.getUserById = async (req, res) => {
    const { userID } = req.params;
    try {
      await User.getUserById(new ObjectId(userID));
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(400).json({ message: "Error" });
    }
};

exports.addUser = async (req, res) => {
    const userData = req.body;

    if(!userData) return res.status(400).end()
    try {
      const newuser = new User(userData);
      const savedUser = await newuser.save();
      res.status(201).json(savedUser);
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(400).json({ message: "Error" });
    }
};

exports.patchUser = async (req, res) => {
    const { userID } = req.params;
    const updates = req.body;
    try {
        await Task.findByIdAndUpdate(userID, updates);
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(400).json({ message: "Error" });
    }
};

exports.deleteUserById = async (req, res) => {
    const { userID } = req.params;
    try {
        await User.findByIdAndDelete(userID);
        console.log("User deleted");
    } catch (error) {
        console.error("Error deleting this task:", error);
        res.status(400).json({ message: "Error" });
    }
};