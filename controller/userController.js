const User = require('../model/userModel')
const Task = require('../model/taskModel')
const {ObjectId} = require('mongodb')

exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json({users});
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(400).json({ message: "Error" });
    }
};

exports.getUserById = async (req, res) => {
    const { username } = req.params;
    try {
      const user = await User.getUserById(username);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(400).json({ message: "Error" });
    }
};

exports.addUser = async (req, res) => {
    const userData = req.body;
    const username = req.params;

    if(!userData) return res.status(400).end()

    try {
      const existingUser = await User.findOne({ username: username });
        if (existingUser) {
          return res.status(404).json({ message: "username taken." });
    }
      const newUser = new User(userData);
      const savedUser = await newUser.save();
      res.status(201).json({
          savedUser: {
            userID: savedUser._id.toString(),
            username: savedUser.username,
            email: savedUser.email,
            fullName: savedUser.fullName,
            password: savedUser.password,
        }
      });
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(400).json({ message: "Error" });
    }
};

exports.patchUser = async (req, res) => {
    const { username } = req.params;
    const updatedFields = req.body;

    try {
      const user = await User.findOne(username)
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const updatedUser = await User.findByIdAndUpdate(
        user._id, 
        updatedFields, 
        { new: true }
      );

      if (updatedUser) {
        res.status(202).json({ update: updatedUser });
    } else {
        res.status(404).json({ message: "User not found" });
    }
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(400).json({ message: "Error" });
    }
};

exports.deleteUserById = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne(username)
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        await User.findByIdAndDelete(user._id);
        console.log("User deleted");
    } catch (error) {
        console.error("Error deleting this task:", error);
        res.status(400).json({ message: "Error" });
    }
};