import express from "express";
import { hello } from "./hello";

const app = express();

app.get("/a", (req, res) => {
  res.status(200).json({
    hello: "dog",
  });
});

hello.say();

app.listen(4100, () => {
  console.log("listen in http://127.0.0.1:4100");
});
