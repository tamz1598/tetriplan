const tf = require('@tensorflow/tfjs-node');
const { prepareData } = require('./prepareData');

function withTimeout(promise, ms) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error(`Operation timed out after ${ms} ms`));
        }, ms);

        promise
            .then((res) => {
                clearTimeout(timer);
                resolve(res);
            })
            .catch((err) => {
                clearTimeout(timer);
                reject(err);
            });
    });
}


async function recommendTasks(userId) {

    try {
        console.log("Starting to prepare data...");
        const { matrix, userIndex, taskIndex, tasks } = await withTimeout(prepareData(), 10000);
        console.log("Data preparation completed.");
    
        const userIdx = userIndex[userId];
        if (userIdx === undefined) {
            throw new Error(`User ID ${userId} not found in userIndex`);
        }
    
        // Get user vector
        const userVector = tf.tensor1d(matrix[userIdx]);

        // Calculate similarity scores
        const taskEmbeddings = tf.tensor2d(matrix).transpose();

        const similarityScores = await withTimeout(
            tf.matMul(userVector.expandDims(0), taskEmbeddings).squeeze(),
            5000 // 5-second timeout
        );

        // Get top 5 task indices
        const recommendedIndices = await withTimeout(similarityScores.topk(5).indices.array(), 5000);

        // Map indices to task IDs
        const recommendedTaskIds = recommendedIndices.map(index => tasks[index]._id);

        console.log(recommendedTaskIds)
        return recommendedTaskIds;
    } catch (error) {
        console.error("Error in recommendTasks:", error);
        throw error;
    }
}

module.exports = { recommendTasks };