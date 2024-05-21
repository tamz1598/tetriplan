const fetchTaskById = require("../utils/getTaskById");

async function run() {
  await fetchTaskById("234");
}

run().catch(console.error);
