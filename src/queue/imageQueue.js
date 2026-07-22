const { Queue } = require("bullmq");
const redis = require("../config/redis");

const imageQueue = new Queue("image-processing", {
  connection: redis,
});

module.exports = imageQueue;