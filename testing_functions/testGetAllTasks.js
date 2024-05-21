const getAllTasks = require("../utils/getAllTasks");

async function run() {
  await getAllTasks();
}

run().catch(console.error);
