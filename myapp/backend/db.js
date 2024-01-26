const mongoose = require('mongoose');

// const mongoURI = "mongodb://localhost:27017/notebook";
const mongoURI = "mongodb+srv://aryanmaheshwari1420:notebookhaiye@cluster0.iyd729h.mongodb.net/notebook";


const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

module.exports = connectToMongo;
