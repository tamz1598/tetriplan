const getTasksByIdSortedByDate = require("../utils/getTasksByDate");

async function testGetTasksSortedByDate() {
  try {
    const userID = "1";
    const tasks = await getTasksByIdSortedByDate(userID);
    console.log(`Sorted Tasks for User ID: ${userID}:`, tasks);
  } catch (error) {
    console.error("Error:", error);
  }
}

testGetTasksSortedByDate();
