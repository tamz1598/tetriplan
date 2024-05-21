// patchTaskTest.js
const { patchTask } = require("../utils/taskUtils");

async function testPatchTask() {
  try {
    const taskIDToUpdate = "1";
    const updatedFields = {
      description: "This is an update!",
      category: "brand new category",
      endTime: "19:00",
      completionStatus: false,
    };
    await patchTask(taskIDToUpdate, updatedFields);
    console.log(`Task with ID ${taskIDToUpdate} patched/updated successfully`);
  } catch (error) {
    console.error("Error patching/updating task:", error);
  }
}
testPatchTask().catch(console.error);
