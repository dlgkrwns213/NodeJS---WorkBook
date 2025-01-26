import mongoose from "mongoose";

const BookmarkSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
  },
  wordID: {
    type: String,
    required: true,
  }
});

// 복합키 설정
BookmarkSchema.index({userID: 1, wordID: 1}, {unique: true});

export default mongoose.model("Bookmark", BookmarkSchema);