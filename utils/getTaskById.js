const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://admin:tetriplan@cluster0.spo41rp.mongodb.net/tetriplan-tasks";

const client = new MongoClient(uri);

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

module.exports = getTaskById;
