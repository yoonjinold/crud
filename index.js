const path = require("path");
const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
//mongodb관련 모듈
const MongoClient = require("mongodb").MongoClient;

let db = null;
MongoClient.connect(process.env.MONGO_URL, { useUnifiedTopology: true }, (err, client) => {
  console.log("연결");
  if (err) {
    console.log(err);
  }
  db = client.db("crudapp");
});

app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.get("/", (req, res) => {
  res.send("hello node");
});
app.get("/write", (req, res) => {
  res.sendFile(path.join(__dirname, "public/html/write.html"));
});
app.post("/add", (req, res) => {
  const subject = req.body.subject;
  const contents = req.body.contents;
  //insert delete update select
  const insertData = {
    subject: "곧점심",
    contents: "배고파",
  };
  db.collection("crud").insertOne(insertData, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log("잘들어갔음");
  });
  res.send(`<script>alert("글이 입력되었습니다."); location.href="/list"</script>`);
  res.redirect("/list");
});
app.get("/list", (req, res) => {
  //crud에서 데이터 받아보기
  db.collection("crud")
    .find()
    .toArray((err, result) => {
      console.log(result);
      res.render("list", { list: result, title: "테스트용입니다." });
    });
});
app.listen(8099, () => {
  console.log("8099에서 서버 대기중");
});
