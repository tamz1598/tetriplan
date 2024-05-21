const {getAllTasksById} = require("../utils/taskUtils");
async function run() {
  const userID = "1";
  const tasks = await getAllTasksById(userID);
}
run();
