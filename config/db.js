import dotenv from "dotenv"
import mongoose from "mongoose";
import expressAsyncHandler from "express-async-handler";

dotenv.config();

const connectDB = expressAsyncHandler( async() => {
  const connect  = await mongoose.connect(process.env.MONGODB_URI);
  console.log(`DB Connected: ${connect.connection.host}`);
});

export default connectDB;