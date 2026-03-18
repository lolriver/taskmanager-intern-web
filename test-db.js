const mongoose = require('mongoose');

const uri = "mongodb+srv://lolriver25_db_user:sbuBOMots2yCXKXM@taskmanager.dolszco.mongodb.net/taskapp?retryWrites=true&w=majority&appName=taskmanager";

async function testConnection() {
  try {
    console.log("Attempting to connect to MongoDB...");
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("✅ Successfully connected to MongoDB Atlas!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
}

testConnection();
