require('dotenv').config();
const { MongoClient, ObjectId } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_CONNECT_URI);

const priorityValues = {
  high: 3,
  medium: 2,
  low: 1,
};

const getPriorityValue = (priority) => {
  return priorityValues[priority] || 0;
};

async function getAllTasks(req, res) {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    const database = client.db();
    const collection = database.collection("tetriplan-tasks");
    const tasks = await collection.find({}).toArray();
    console.log("Found tasks:", tasks);
    res.json(tasks)
    return tasks;
  } catch (error) {
    console.error("Error retrieving all tasks:", error);
    throw new Error("Could not retrieve tasks");
  } finally {
    await client.close();
  }
}

async function addTask(req, res) {
  const taskObject = req.body;
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    const database = client.db();
    const userCollection = database.collection("tetriplan-users");
    const taskCollection = database.collection("tetriplan-tasks");
    const existingUser = await userCollection.findOne({
      _id: new ObjectId(taskObject.userID),
    });
    if (!existingUser) {
      console.log("User with the given userID does not exist");
      return res.status(404).json({error: "User not found"});
    }
    const existingTask = await taskCollection.findOne({
      userID: taskObject.userID,
      taskName: taskObject.taskName,
      date: taskObject.date,
    });
    if (existingTask) {
      console.log(
        `Task already exists for userID: ${taskObject.userID}, taskName: ${taskObject.taskName}, date: ${taskObject.date}`
      );
      return res.status(404).json({error: "Tasks already exist."});
    }
    const result = await taskCollection.insertOne(taskObject);
    console.log(
      `New task inserted with the following id: ${result.insertedId}`
    );
    res.status(201).json({ message: "Task added successfully", taskId: result.insertedId })
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ error: "Could not add task"});
  } finally {
    await client.close();
  }
}

async function getTaskById(req, res) {
  const { taskID } = req.params;
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    const database = client.db();
    const collection = database.collection("tetriplan-tasks");
    const task = await collection.findOne({ taskID: taskID });
    if (task) {
      console.log("Found task:", task);
      res.status(200).json(task);
    } else {
      console.log("No task found with the given taskID");
      res.status(404).json({ message: "Task not found"});
    }
    return task;
  } catch (error) {
    console.error("Error retrieving task by ID:", error);
    res.status(500).json({ error: "Could not retrieve task"})
  } finally {
    await client.close();
  }
}
async function getAllTasksById(req, res) {
  const { userID } = req.params;
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    const database = client.db();
    const collection = database.collection("tetriplan-tasks");
    const tasks = await collection.find({ userID: userID }).toArray();
    if (tasks.length === 0) {
      console.log("No tasks found for User ID:", userID);
      res.status(404).json({ message: "No tasks found for User ID"});
    } else {
      console.log("All Tasks for User ID:", tasks);
      res.status(200).json(tasks);
    }
    return tasks;
  } catch (error) {
    console.error("Error retrieving tasks by userID:", error);
    res.status(500).json({ error: "Could not retrieve task"})
  } finally {
    await client.close();
  }
}
async function getAllTasksByIdAndCategory(req, res) {
  const { userID, category } = req.params;
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    const database = client.db();
    const collection = database.collection("tetriplan-tasks");
    const tasks = await collection
      .find({ userID: userID, category: category })
      .toArray();
    if (tasks.length === 0) {
      console.log(
        `No tasks found for User ID: ${userID} and Category: ${category}`);
        res.status(404).json({ message: "No tasks found for User ID: ${userID} and Category: ${category}`"});
    } else {
      console.log(
        `All Tasks for User ID: ${userID} and Category: ${category}`,
        tasks
      );
      res.status(200).json(tasks);
    }
    return tasks;
  } catch (error) {
    console.error("Error retrieving tasks by userID and category:", error);
    res.status(500).json({ error: "Could not retrieve tasks" }); 
  } finally {
    await client.close();
  }
}
async function getTasksByIdSortedByDate(req, res) {
  const { userID } = req.params;
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    const database = client.db();
    const collection = database.collection("tetriplan-tasks");
    const tasks = await collection.find({ userID: userID }).toArray();
    tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
    if (tasks.length === 0) {
      console.log(`No tasks found for User ID: ${userID}`);
      res.status(404).json({ message: `No tasks found for User ID: ${userID}` }); 
    } else {
      console.log(`All Tasks for User ID: ${userID}`, tasks);
      res.status(200).json(tasks);
    }
    return tasks;
  } catch (error) {
    console.error("Error retrieving tasks sorted by date:", error);
    res.status(500).json({ error: "Could not retrieve tasks" });
  } finally {
    await client.close();
  }
}
async function getAllTasksByIdAndPriority(req, res) {
  const { userID } = req.params;
  const priorityValues = { high: 3, medium: 2, low: 1 };
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    const database = client.db();
    const collection = database.collection("tetriplan-tasks");
    const tasks = await collection.find({ userID: userID }).toArray();
    tasks.sort(
      (a, b) => priorityValues[b.priority] - priorityValues[a.priority]
    );
    if (tasks.length === 0) {
      console.log(`No tasks found for User ID: ${userID}`);
      res.status(404).json({ message: `No tasks found for User ID: ${userID}` });
    } else {
      console.log(`All Tasks for User ID: ${userID}`, tasks);
      res.status(200).json(tasks);
    }
    return tasks;
  } catch (error) {
    console.error("Error retrieving tasks by priority:", error);
    throw new Error("Could not retrieve tasks");
  } finally {
    await client.close();
  }
}
async function deleteTaskById(req, res) {
  const { taskID } = req.params;
  try {
    await client.connect();
    const database = client.db();
    const collection = database.collection("tetriplan-tasks");
    const result = await collection.deleteOne({ taskID: taskID });
    if (result.deletedCount === 1) {
      console.log(`Task with ID ${taskID} deleted successfully`);
      res.status(200).json({ message: `Task with ID ${taskID} deleted successfully` });
    } else {
      console.log(`Task with ID ${taskID} not found`);
      res.status(404).json({ message: `Task with ID ${taskID} not found` });
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Could not delete task" });
  } finally {
    await client.close();
  }
}
async function patchTask(req, res) {
  const { taskID } = req.params;
  const updatedFields = req.body;
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    const database = client.db();
    const collection = database.collection("tetriplan-tasks");
    const result = await collection.updateOne(
      { taskID: taskID },
      { $set: updatedFields }
    );
    if (result.modifiedCount === 1) {
      console.log(`Task with ID ${taskID} patched/updated successfully`);
      res.status(200).json({ message: `Task with ID ${taskID} patched/updated successfully` }); 
    } else {
      console.log(`Task with ID ${taskID} not found`);
      res.status(404).json({ message: `Task with ID ${taskID} not found` });
    }
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Could not update task" });
  } finally {
    await client.close();
  }
}

module.exports = {
  deleteTaskById,
  addTask,
  getTaskById,
  getAllTasks,
  getAllTasksById,
  getAllTasksByIdAndCategory,
  getTasksByIdSortedByDate,
  getAllTasksByIdAndPriority, 
  getPriorityValue, 
  priorityValues,
  patchTask,
};
