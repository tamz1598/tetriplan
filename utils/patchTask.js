const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://admin:tetriplan@cluster0.spo41rp.mongodb.net/tetriplan-tasks";

const client = new MongoClient(uri);

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

module.exports = patchTask;
