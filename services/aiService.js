const Task = require('../model/taskModel');
const tf = require('@tensorflow/tfjs-node');
const { prepareData } = require('./prepareData');

let useModel;


async function loadUSEModel() {
    if (!useModel) {
        // Load the Universal Sentence Encoder model
        // tf.loadGraphmodel solves loading issue due to asynchronous load
        useModel = await tf.loadGraphModel('https://tfhub.dev/google/universal-sentence-encoder/4/model.json');
    }
}

async function recommendTasks(userId) {
    await loadUSEModel();

    try {
        // Fetch user and task data
        const { userIndex, taskIndex } = await prepareData();

        // Fetch user's tasks
        const tasks = await Task.find({ userId });

        // Encode task descriptions using Universal Sentence Encoder
        const taskDescriptions = tasks.map(task => task.description);
        const taskEmbeddings = await useModel.predict(tf.tensor2d(taskDescriptions));

        // Make predictions
        const userEmbedding = tf.tensor1d(userIndex[userId]);
        const predictions = tf.matMul(userEmbedding, taskEmbeddings.transpose());
        const recommendedIndices = await predictions.squeeze().argMax().data();

        // Convert indices to task objects
        const recommendedTasks = recommendedIndices.map(index => tasks[index]);

        return recommendedTasks;
    } catch (error) {
        console.error("Error getting recommended tasks:", error);
        throw error;
    }
}

module.exports = { recommendTasks };