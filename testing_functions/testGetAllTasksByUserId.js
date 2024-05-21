const getAllTasks = require("../utils/getAllTasksByUserId");
async function run() {
  const userID = "1";
  const tasks = await getAllTasks(userID);
}
run();
