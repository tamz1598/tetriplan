const { getTaskById } = require("../utils/taskUtils");

async function run() {
  await getTaskById("664cb96495656f4af269a1dd");
}

run().catch(console.error);
