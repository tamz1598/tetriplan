const {getAllTasks} = require("../utils/taskUtils");

async function run() {
  await getAllTasks();
}

run().catch(console.error);
