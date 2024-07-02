//Connection file to mongo db
import mongoose from "mongoose";
import colors from "colors";
const {MongoClient} = require('mongodb');
const uri = "mongodb+srv://mpp:mpp@<your-cluster-url>/test?retryWrites=true&w=majority";

const MONGO_URI = "mongodb+srv://test:test@cluster0.jo8ln.mongodb.net/test?retryWrites=true&w=majority"


const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    process.exit();
  }

  
};

export default connectDB;
