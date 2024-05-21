const {getAllTasksByIdAndPriority} = require("../utils/taskUtils");

async function testGetAllTasks() {
  try {
    const userID = "1";

    const tasks = await getAllTasksByIdAndPriority(userID);
  } catch (error) {
    console.error("Error:", error);
  }
}

testGetAllTasks();
