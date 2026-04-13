const mongoose = require("mongoose")
const { config } = require("./config")

let connectionPromise = null

async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection
  }

  if (!config.mongoUri) {
    throw new Error("MONGODB_URI is missing. Add it to your Vercel environment variables.")
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(config.mongoUri, {
        serverSelectionTimeoutMS: 5000,
      })
      .catch((error) => {
        connectionPromise = null
        throw error
      })
  }

  await connectionPromise
  return mongoose.connection
}

module.exports = {
  connectToDatabase,
}
