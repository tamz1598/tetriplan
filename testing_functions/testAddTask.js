const {addTask} = require("../utils/taskUtils");

async function main() {
  const taskObject = {
    taskID: 234,
    userID: 1,
    taskName: "Testing differently",
    description: "This is a test task ",
    category:"test",
    date: "2024-05-24",
    dateAdded: new Date(),
    startTime: "02:00",
    endTime: "13:00",
    duration: 60,
    completionStatus: false,
    label: "Test Label",
    priority: "high"
  }

  try {
    const newTask = await addTask(taskObject)
      console.log('here is the new task', newTask);
  } catch (error) {
    console.error("Error adding task:", error);
  }
}

main().catch(console.error);
