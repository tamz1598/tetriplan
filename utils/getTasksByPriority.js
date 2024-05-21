const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://admin:tetriplan@cluster0.spo41rp.mongodb.net/tetriplan-tasks";

const client = new MongoClient(uri);

const priorityValues = {
  high: 3,
  medium: 2,
  low: 1,
};
async function getAllTasksByIdAndPriority(userID) {
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

module.exports = getAllTasksByIdAndPriority;
