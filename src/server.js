require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
require("./config/redis");
require("./workers/imageWorker");

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});