const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://admin:tetriplan@cluster0.spo41rp.mongodb.net/tetriplan-tasks";

const client = new MongoClient(uri);
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

module.exports = getAllTasksById;
