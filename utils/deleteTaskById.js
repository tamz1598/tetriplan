const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://admin:tetriplan@cluster0.spo41rp.mongodb.net/tetriplan-tasks";
const client = new MongoClient(uri);
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

module.exports = deleteTaskById;
