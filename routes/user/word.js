import express from "express";
import Word from "../../models/Word.js";
import expressAsyncHandler from "express-async-handler";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("user/default", {layout: "../views/layouts/userPage.ejs"});
});

router.get(
  "/show",
  expressAsyncHandler( async (req, res) => {
    try {
      const wordTotal = await Word.find();
      res.render("user/showTotalWord", {data: wordTotal, layout: "../views/layouts/userPage.ejs"})
    } catch (error) {
      console.log(error);
      res.status(500).send("server error");
    }
  })
);

router.get(
  "/show/:id",
  expressAsyncHandler( async (req, res) => {
    const locals = {
      title: "word 보기"
    };
    const data = await Word.findOne({_id: req.params.id});
    res.render("user/showWord", {locals, data, layout: "../views/layouts/adminPage.ejs"});
  })
)

router.put(
  "/show/:id",
  expressAsyncHandler( async (req, res) => {
    try {
      await Word.findByIdAndUpdate(req.params.id, {
        word: req.body.word,
        pronunciation: req.body.pronunciation,
      });
      req.redirect("/user/word/show")
    } catch (error) {
      console.log(error);
      res.status(500).send("server error");
    }
  })
);

export default router;
