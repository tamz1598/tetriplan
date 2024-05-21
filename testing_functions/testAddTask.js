const addTask = require("../utils/addTask");

async function main() {
  try {
    const taskID = 1;
    const userID = 1;
    const taskName = "Testing Task again";
    const description = "This is a test task ";
    const category = "test";
    const date = "2024-05-24";
    const dateAdded = new Date();
    const startTime = "02:00";
    const endTime = "13:00";
    const duration = 60;
    const completionStatus = false;
    const label = "Test Label";
    const priority = "high";

    const newTask = await addTask(
      taskID,
      userID,
      taskName,
      description,
      category,
      date,
      dateAdded,
      startTime,
      endTime,
      duration,
      completionStatus,
      label,
      priority
    );
  } catch (error) {
    console.error("Error adding task:", error);
  }
}

main().catch(console.error);
