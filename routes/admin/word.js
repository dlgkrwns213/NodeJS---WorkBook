import dotenv from "dotenv";
import express from "express";
import Word from "../../models/Word.js";
import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

dotenv.config();

const router = express.Router();
const jwtAdminSecret = process.env.JWT_ADMIN_SECRET || 'ADMIN_SECRET'

// Check Admin Login
const CheckAdminLogin = (req, res, next) => {
  const adminToken = req.cookies.adminToken;
  if (!adminToken)
    res.redirect("/login");
  else {
    try {
      const decode = jwt.verify(adminToken, jwtAdminSecret);
      req.adminId = decode.adminId;
      next();
    } catch (error) {
      // console.log(error);
      res.redirect("/");
    }
  }
};

router.get("/", CheckAdminLogin, (req, res) => {
  res.render("admin/default", {layout: "../views/layouts/adminPage.ejs"});
});

router.get("/add", CheckAdminLogin, (req, res) => {
  res.render("admin/saveWord", {layout: "../views/layouts/adminPage.ejs"});
});


router.post(
  "/save",
  CheckAdminLogin,
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
  CheckAdminLogin,
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
  "/edit/:id",
  CheckAdminLogin,
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
  CheckAdminLogin,
  expressAsyncHandler( async (req, res) => {
    try {
      await Word.findByIdAndUpdate(req.params.id, {
        word: req.body.word,
        pronunciation: req.body.pronunciation,
      });
      req.redirect("/admin/word/show")
    } catch (error) {
      console.log(error);
      res.status(500).send("server error");
    }
  })
);

router.delete(
  "/delete/:id",
  CheckAdminLogin,
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
