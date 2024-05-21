const { MongoClient } = require("mongodb");
const uri =
  "mongodb+srv://admin:tetriplan@cluster0.spo41rp.mongodb.net/tetriplan-tasks";
const client = new MongoClient(uri);

async function getAllTasks() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    const database = client.db();
    const collection = database.collection("tetriplan-tasks");
    const tasks = await collection.find({}).toArray();
    console.log("Found tasks:", tasks);

    return tasks;
  } finally {
    await client.close();
  }
}

async function addTask(taskObject) {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    const database = client.db();
    const collection = database.collection("tetriplan-tasks");

    const result = await collection.insertOne(taskObject);
    console.log(
      `New task inserted with the following id: ${result.insertedId}`
    );

    return result;
  } finally {
    await client.close();
  }
}

async function getTaskById(taskID) {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");

    const database = client.db();
    const collection = database.collection("tetriplan-tasks");

    const task = await collection.findOne({ taskID: taskID });
    if (task) {
      console.log("Found task:", task);
    } else {
      console.log("No task found with the given taskID");
    }

    return task;
  } finally {
    await client.close();
  }
}

async function getAllTasksById(userID) {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");

    const database = client.db();
    const collection = database.collection("tetriplan-tasks");
    const tasks = await collection.find({ userID: userID }).toArray();

    if (tasks.length === 0) {
      console.log("No tasks found for User ID:", userID);
    } else {
      console.log("All Tasks for User ID:", tasks);
    }

    return tasks;
  } finally {
    await client.close();
  }
}

async function getAllTasksByIdAndCategory(userID, category) {
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
        `No tasks found for User ID: ${userID} and Category: ${category}`
      );
    } else {
      console.log(
        `All Tasks for User ID: ${userID} and Category: ${category}`,
        tasks
      );
    }

    return tasks;
  } finally {
    await client.close();
  }
}

async function getTasksByIdSortedByDate(userID) {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    const database = client.db();
    const collection = database.collection("tetriplan-tasks");
    const tasks = await collection.find({ userID: userID }).toArray();
    tasks.sort((a, b) => new Date(a.date) - new Date(b.date));

    if (tasks.length === 0) {
      console.log(`No tasks found for User ID: ${userID}`);
    } else {
      console.log(`All Tasks for User ID: ${userID}`, tasks);
    }

    return tasks;
  } finally {
    await client.close();
  }
}

async function getAllTasksByIdAndPriority(userID) {
  const priorityValues = {
    high: 3,
    medium: 2,
    low: 1,
  };
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
    } else {
      console.log(`All Tasks for User ID: ${userID}`, tasks);
    }

    return tasks;
  } finally {
    await client.close();
  }
}

async function deleteTaskById(taskID) {
  try {
    await client.connect();
    const database = client.db();
    const collection = database.collection("tetriplan-tasks");
    const result = await collection.deleteOne({ taskID: taskID });
    if (result.deletedCount === 1) {
      console.log(`Task with ID ${taskID} deleted successfully`);
    } else {
      console.log(`Task with ID ${taskID} not found`);
    }
  } finally {
    await client.close();
  }
}

async function patchTask(taskID, updatedFields) {
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
    } else {
      console.log(`Task with ID ${taskID} not found`);
    }
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
  patchTask,
};
