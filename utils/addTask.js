const { MongoClient } = require("mongodb");
const uri =
  "mongodb+srv://admin:tetriplan@cluster0.spo41rp.mongodb.net/tetriplan-tasks";
const client = new MongoClient(uri);
async function addTask(
  taskID,
  userID,
  taskName,
  description,
  category,
  date,
  startTime,
  endTime,
  duration,
  completionStatus,
  label,
  priority
) {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    const database = client.db();
    const collection = database.collection("tetriplan-tasks");
    const task = {
      taskID: taskID,
      userID: userID,
      taskName: taskName,
      description: description,
      category: category,
      date: date,
      startTime: startTime,
      endTime: endTime,
      duration: duration,
      completionStatus: completionStatus,
      label: label,
      priority: priority,
    };

    const result = await collection.insertOne(task);
    console.log(
      `New task inserted with the following id: ${result.insertedId}`
    );
    const query = { taskID: taskID };
    const findResult = await collection.findOne(query);
    console.log("Found task:", findResult);

    return findResult;
  } finally {
    await client.close();
  }
}

module.exports = addTask;
