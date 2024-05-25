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
    res.json({tasks})
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
  const { username } = req.params; 
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    const database = client.db();
    const userCollection = database.collection("tetriplan-users");
    const taskCollection = database.collection("tetriplan-tasks");

    const existingUser = await userCollection.findOne({
      username: username,
    });

    if (!existingUser) {
      console.log("User with the given userID does not exist");
      return res.status(404).json({error: "User not found"});
    }
     // Assign user ID to the task object
     taskObject.userID = existingUser._id;

     // Convert userID to ObjectId
     const userId = new ObjectId(taskObject.userID);

    const existingTask = await taskCollection.findOne({
      userID: userId,
      taskName: taskObject.taskName,
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
    const task = await collection.findOne({ _id: new ObjectId(taskID) });
    console.log(task)
    if (task) {
      console.log("Found task:", task);
      res.status(200).json({task});
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

async function patchTask(req, res) {
  const { taskID } = req.params;
  console.log(taskID)
  const updatedFields = req.body;
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    const database = client.db();
    const collection = database.collection("tetriplan-tasks");

   const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(taskID) },
      { $set: updatedFields },
      { returnOriginal: false }
    );

    console.log(result)

    if (result) {
      console.log(`Task with ID ${taskID} patched/updated successfully`);
      res.status(202).json({ update: result });
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

async function deleteTaskById(req, res) {
  const { taskID } = req.params;
  try {
    await client.connect();
    const database = client.db();
    const collection = database.collection("tetriplan-tasks");

    const result = await collection.deleteOne({ _id: new ObjectId(taskID) });
    if (result.deletedCount === 1) {
      console.log(`Task with ID ${taskID} deleted successfully`);
      res.status(204).json({ message: `Task with ID ${taskID} deleted successfully` });
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

async function getAllTasksByUserId(req, res) {
  const { username } = req.params;
  const { category, sort } = req.query;
  const priorityValues = { high: 3, medium: 2, low: 1 };
  console.log(username, category)
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");

    const database = client.db();
    const usercollection = database.collection("tetriplan-users");
    const taskcollection = database.collection("tetriplan-tasks");

    const user = await usercollection.findOne({ username });

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    let query = { userID: user._id };
    if (category) {
      query.category = category;
    }

    let tasks = await taskcollection.find(query).toArray();

    if (sort === 'date') {
      tasks.sort((a, b) => new Date(b.calendar) - new Date(a.calendar)); // Sort by date in descending order
    }

    if (sort === 'priority') {
      tasks.sort((a, b) => priorityValues[b.priority] - priorityValues[a.priority])
    }

    if (sort === 'label') {
      tasks = tasks.filter(task => task.label === label);
    }

    if (tasks.length === 0) {
      console.log(`No tasks found for the user and Category: ${category}`);
      return res.status(200).json({ tasks: [] });
    } else {
      console.log(`All Tasks for the user and Category: ${category}`, tasks);
      return res.status(200).json({ tasks });
    }
  } catch (error) {
    console.error("Error retrieving tasks by userID:", error);
    res.status(500).json({ error: "Could not retrieve task"})
  } finally {
    await client.close();
  }
}


module.exports = {
  deleteTaskById,
  addTask,
  getTaskById,
  getAllTasks,
  getAllTasksByUserId, 
  getPriorityValue, 
  priorityValues,
  patchTask,
};
