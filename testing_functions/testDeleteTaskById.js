const deleteTaskById = require("../utils/deleteTaskById");

async function testDeleteTask() {
  try {
    const taskIDToDelete = "123";
    await deleteTaskById(taskIDToDelete);
  } catch (error) {
    console.error("Error deleting task:", error);
  }
}

testDeleteTask().catch(console.error);
