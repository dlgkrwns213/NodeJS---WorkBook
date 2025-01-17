import express from "express";
import Word from "../models/Word.js";
import expressAsyncHandler from "express-async-handler";

const router = express.Router();

router.post(
  "/word/save",
  expressAsyncHandler(async (req, res) => {
    try {
      const { word, pronunciation, ...data } = req.body;

      console.log("Received word data:", req.body);

      // meanings 데이터 변환
      const meanings = [];
      for (let i = 1; data[`partOfSpeech${i}`]; i++) {
        const examples = [];
        for (let j = 1; data[`example${i}_${j}`]; j++) {
          examples.push({
            example: data[`example${i}_${j}`],
            translation: data[`translation${i}_${j}`],
          });
        }
        meanings.push({
          partOfSpeech: data[`partOfSpeech${i}`],
          meaning: data[`meaning${i}`],
          examples,
        });
      }

      // 단어 데이터 생성
      const wordDocument = new Word({
        word,
        pronunciation,
        meanings,
      });

      // MongoDB에 저장
      const savedWord = await wordDocument.save();

      // res.status(200).json({
      //   message: "단어가 성공적으로 저장되었습니다.",
      //   data: savedWord,
      // });

      res.redirect("/tmp");
    } catch (error) {
      console.error("Error saving word:", error.message);
      if (!res.headersSent) {
        res.status(500).json({
          message: "단어 저장 중 오류가 발생했습니다.",
          error: error.message,
        });
      }
    }
  })
);

export default router;
