const {addTask} = require("../utils/taskUtils");

const mockRequest = {
  user: {
    _id: ObjectId('664f18a0ae1408ed6c5fb65c') // Replace "user_id_here" with the actual user ID
  }
};

async function main() {
  const taskObject = {
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
    const newTask = await addTask(mockRequest, null, taskObject)
      console.log('here is the new task', newTask);
  } catch (error) {
    console.error("Error adding task:", error);
  }
}

main().catch(console.error);
