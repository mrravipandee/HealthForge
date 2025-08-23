import mongoose from "mongoose";

const connectDB = async () => {

    mongoose.connection.on('connected', () => console.log("Database Connected"))
    // Prefer a full connection string from env; otherwise default to local Compass
    // Example local: mongodb://127.0.0.1:27017/healthforge
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/healthforge';
    await mongoose.connect(uri)

}

export default connectDB;

// Do not use '@' symbol in your databse user's password else it will show an error.