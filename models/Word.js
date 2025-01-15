import mongoose from "mongoose";

// 예문과 그 예문의 한글 해석
const exampleSchema = new mongoose.Schema({
  example: {  // 예시 문장
    type: String,
    required: true,
  },
  translation: {  // 해석
    type: String,
    required: true,
  }
});

// 단어의 품사와 뜻
const meaningSchema = new mongoose.Schema({
  partOfSpeech: {
    type: String,  // 품사
    required: true,
  },
  meaning: {  // 뜻
    type: String,
    required: true,
  },
  examples: [exampleSchema],  // 예시문장
});

const wordSchema = new mongoose.Schema({
  word: { // 단어
    type: String,
    required: true,
    unique: true,
  },
  pronunciation: {
    type: String,
    required: false,
  },
  meanings: [meaningSchema],
});

export default mongoose.model("Word", wordSchema);