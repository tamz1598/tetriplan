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

module.exports = getAllTasks;
