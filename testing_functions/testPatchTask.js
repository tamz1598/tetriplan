// patchTaskTest.js
const patchTask = require("../utils/patchTask");

async function testPatchTask() {
  try {
    const taskIDToUpdate = "1";
    const updatedFields = {
      description: "Updated description",
      category: "Updated category",
      endTime: "15:00",
      completionStatus: true,
    };
    await patchTask(taskIDToUpdate, updatedFields);
    console.log(`Task with ID ${taskIDToUpdate} patched/updated successfully`);
  } catch (error) {
    console.error("Error patching/updating task:", error);
  }
}
testPatchTask().catch(console.error);
