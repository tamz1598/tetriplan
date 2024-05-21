const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://admin:tetriplan@cluster0.spo41rp.mongodb.net/tetriplan-tasks";

const client = new MongoClient(uri);

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

module.exports = getAllTasksByIdAndCategory;
