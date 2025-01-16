import dotenv from "dotenv";
import express from "express";
import mainRouter from "./routes/main.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static("public"));

app.use("/", mainRouter);

app.listen(port, () => {
  console.log(`Application listening on port ${port}`)
})