const Task = require('../model/taskModel')
const User = require('../model/userModel')
const {ObjectId} = require('mongodb')
const { recommendTasks } = require('../services/aiService');

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
    const { username } = req.params;

    if(!taskData.description) return res.status(400).end()

    try {
        //find user by username
        const user = await User.findOne({ username: username });
    
        if (!user) {
          return res.status(404).json({ message: 'user not found' });
        }

        taskData.userID = new ObjectId(user._id);
        
        const newtask = new Task(taskData);
        const savedTask = await newtask.save();
        savedTask.completionStatus = !!savedTask.completionStatus;
        
        res.status(201).json({savedTask});
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(400).json({ message: "Error" });
    }
};

exports.getTaskById = async (req, res) => {
    const { taskID } = req.params;
    try {
        const task = await Task.findById(taskID);
        console.log(task) // Use findById method from Mongoose
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json({task});
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(400).json({ message: "Error" });
    }
};

exports.patchTask = async (req, res) => {
    const { taskID } = req.params;
    const updatedFields = req.body;
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            taskID, 
            updatedFields, 
            { new: true } // Return the updated document
        );

        if (updatedTask) {
            res.status(202).json({ update: updatedTask });
        } else {
            res.status(404).json({ message: "Task not found" });
        }
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(400).json({ message: "Error" });
    }
};

exports.deleteTaskById = async (req, res) => {
    const { taskID } = req.params;
    try {
        await Task.findByIdAndDelete(taskID);
        console.log("Task deleted");
    } catch (error) {
        console.error("Error deleting this task:", error);
        res.status(400).json({ message: "Error" });
    }
};

exports.getAllTasksByUserId = async (req, res) => {
    const { username } = req.params;
    const { category, sort } = req.query;
    console.log(category, "this is in the controller")
    try {
        const user = await User.find({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let query = { userID: user._id };
        if (category) {
            query.category = category;
        }

        let tasks;
        
        if (sort === 'date') {
            tasks = await Task.find(query).sort({ calendar: -1 }); // Sort by date in descending order
        } else if (sort === 'priority'){
            tasks = await Task.find(query).sort({ priority: 1 });
        } else if (sort === 'label') {
            const { label } = req.query;
            tasks = await Task.find({ label });
        } else {
            tasks = await Task.find(query)
        }
        if(!tasks.length === 0){
            return res.status(200).json({tasks: [] });
        } else{
            return res.status(200).json({ tasks });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    
};

async function withTimeout(promise, ms) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error(`Operation timed out after ${ms} ms`));
        }, ms);

        promise
            .then((res) => {
                clearTimeout(timer);
                resolve(res);
            })
            .catch((err) => {
                clearTimeout(timer);
                reject(err);
            });
    });
}

exports.getRecommendedTasks = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await withTimeout(User.findOne({ username: username }), 5000); //
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const userId = user._id;

         const recommendedTaskIds = await withTimeout(recommendTasks(userId), 10000); 

        const recommendedTasks = await withTimeout(
            Task.find({ _id: { $in: recommendedTaskIds.map(id => id.toString()) } }),
            5000 // 5-second timeout for finding tasks
        );
        res.status(200).json({ recommendedTasks });
    } catch (error) {
        console.error("Error getting recommended tasks:", error);
        res.status(500).json({ error: "Could not get recommended tasks" });
    }
  };

