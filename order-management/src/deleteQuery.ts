import mongoose from "mongoose";

// MongoDB connection URI
const uri = "mongo_uri";

// Function to connect to the MongoDB database and perform the delete operation
async function deleteDocuments() {
  try {
    // Connect to the MongoDB database
    await mongoose.connect(uri);
    console.log("Connected to the database");

    // Define the filter to delete all documents except the specified _id
    const filter = {
      _id: { $ne: new mongoose.Types.ObjectId("661ee4bde6254c704e7d3b29") }
    };
    // Delete documents from the collection
    const result = await mongoose.connection.db.collection("reviews").deleteMany(filter);
    console.log(`${result.deletedCount} documents deleted`);
  } catch (error) {
    console.error("Error occurred:", error);
  } finally {
    // Disconnect from the MongoDB database
    await mongoose.disconnect();
    console.log("Disconnected from the database");
  }
}

// Call the function to delete documents
deleteDocuments();
