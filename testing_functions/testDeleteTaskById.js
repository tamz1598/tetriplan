const { deleteTaskById } = require("../utils/taskUtils");

async function testDeleteTask() {
  try {
    const taskIDToDelete = "234";
    await deleteTaskById(taskIDToDelete);
  } catch (error) {
    console.error("Error deleting task:", error);
  }
}

testDeleteTask().catch(console.error);
