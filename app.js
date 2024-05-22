const express = require("express");
const mongoose = require("mongoose");
const { getAllTasks, addTask, getTaskById, getAllTasksById, getAllTasksByIdAndCategory, getTasksByIdSortedByDate, getAllTasksByIdAndPriority, patchTask, deleteTaskById } = require("./utils/taskUtils");
const { getAllUsers, getUserById, addUser, patchUser, deleteUserById } = require('./utils/userUtils')
const app = express();
const router = express.Router();

//read json data  
app.use(express.json());

mongoose.set("strictQuery", false);

//connect to mongoose
mongoose
  .connect(
    "mongodb+srv://admin:tetriplan@cluster0.spo41rp.mongodb.net/tetriplan-tasks"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));


// routers
router.get("/tasks", getAllTasks)

router.post("/tasks", addTask)

router.get("/tasks/:taskID", getTaskById)

router.get("/tasks/:userID", getAllTasksById)

router.get("/tasks/:userID/:category", getAllTasksByIdAndCategory)

router.get("/tasks/:userID", getTasksByIdSortedByDate)

router.get("/tasks/:userID", getAllTasksByIdAndPriority)

router.patch("/tasks/:taskId", patchTask)

router.delete("/tasks/:taskId",deleteTaskById)

router.get("/users", getAllUsers)

router.get("/users/:userID", getUserById)

router.post("/users/", addUser)

router.patch("/users/userID", patchUser)

router.delete("/users/userID", deleteUserById)

//error handling
app.all("*", (request, response, next) => {
  response.status(404).send({ message: "endpoint not found" });
});

app.use((err, request, response, next) => {
  if (err.status && err.message)
    response.status(err.status).send({ message: err.message });
  next(err);
});

app.use((err, request, response, next) => {
  response.status(500).send({ message: "internal server error" });
});


module.exports = app;
