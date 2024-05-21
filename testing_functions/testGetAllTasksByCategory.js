const getAllTasksByIdAndCategory = require("../utils/getAllTasksByCategory");

async function testGetAllTasks() {
  try {
    const userID = "1";
    const category = "Test";
    const tasks = await getAllTasksByIdAndCategory(userID, category);
    console.log("Tasks:", tasks);
  } catch (error) {
    console.error("Error:", error);
  }
}

testGetAllTasks();
