import express from "express";
import Word from "../../models/Word.js";
import expressAsyncHandler from "express-async-handler";

const router = express.Router();

router.get(
  "/",
  (req, res) => {
  res.render("admin/default", {layout: "../views/layouts/adminPage.ejs"});
});

router.get(
  "/add",
  (req, res) => {
  res.render("admin/saveWord", {layout: "../views/layouts/adminPage.ejs"});
});


router.post(
  "/save",
  expressAsyncHandler(async (req, res) => {
    try {
      const { chapter, word, pronunciation, ...data } = req.body;

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
        chapter,
      });

      // MongoDB에 저장
      const savedWord = await wordDocument.save();

      // res.status(200).json({
      //   message: "단어가 성공적으로 저장되었습니다.",
      //   data: savedWord,
      // });

      res.redirect("/admin/word/show");
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

router.get(
  "/show",
  expressAsyncHandler( async (req, res) => {
    try {
      const wordTotal = await Word.find();
      res.render("admin/showTotalWord", {data: wordTotal, layout: "../views/layouts/adminPage.ejs"})
    } catch (error) {
      console.log(error);
      res.status(500).send("server error");
    }
  })
);

router.get(
  "/show/:id",
  expressAsyncHandler( async (req, res) => {
    const data = await Word.findOne({_id: req.params.id});

    const locals = {
      title: data.word,
    };
    res.render("admin/showWord", {locals, data, layout: "../views/layouts/adminPage.ejs"});
  })
);

router.get(
  "/edit/:id",
  expressAsyncHandler( async (req, res) => {
    const locals = {
      title: "word 편집"
    };
    const data = await Word.findOne({_id: req.params.id});
    res.render("admin/editWord", {locals, data, layout: "../views/layouts/adminPage.ejs"});
  })
)

router.put(
  "/edit/:id",
  expressAsyncHandler(async (req, res) => {
    try {
      const { chapter, word, pronunciation, meanings } = req.body;
      
      // 'meanings' 배열이 있는 경우 각 뜻을 업데이트
      const updatedData = {
        chapter,
        word,
        pronunciation,
        meanings: meanings.map((meaning) => ({
          partOfSpeech: meaning.partOfSpeech,
          meaning: meaning.meaning,
          examples: meaning.examples.map((example) => ({
            example: example.example,
            translation: example.translation,
          })),
        })),
      };

      await Word.findByIdAndUpdate(req.params.id, updatedData);
      res.redirect("/admin/word/show");
    } catch (error) {
      console.log(error);
      res.status(500).send("server error");
    }
  })
);


router.delete(
  "/delete/:id",
  expressAsyncHandler( async (req, res) => {
    try {
      await Word.deleteOne({ _id: req.params.id });
      res.redirect("/admin/word/show");
    } catch (error) {
      console.log(error);
      res.status(500).send("server error");
    }
  })
);

export default router;
