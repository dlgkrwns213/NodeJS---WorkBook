import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  nickname: {
    type: String, 
    required: true,
    unique: true,
  },
  name:  {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
})

export default mongoose.model("User", userSchema);