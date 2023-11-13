import * as http from "http";
import CNN from "./NN_models/cnn/CNN.js";
import path from "path";
import fs from "fs";
import Preceptron from "./NN_models/perceptron/Perceptron.js";
import { loadMnistData } from "./loadMnistData.js";

const preceptron = new Preceptron();

const server = http.createServer((req, res) => {
  const url = req.url == "/" ? "/index.html" : req.url;

  if (url == "/recognize") {
    let postData = "";

    req.on("data", (chunk) => {
      postData += chunk;
    });

    req.on("end", () => {
      const postDataJSON = JSON.parse(postData);

      res.statusCode = 200;
      // res.setHeader("Content-Type", "text/plain");
      try {
        res.end(preceptron.predict(postDataJSON.image, 2, true).toString());
      } catch (e) {
        res.end("error");
        console.log(e);
      }
    });
  }

  const filePath = path.join(path.resolve(), "public" + url);
  const ext = path.extname(filePath);

  let contentType;
  switch (ext) {
    case ".html":
      contentType = "text/html";
      break;
    case ".css":
      contentType = "text/css";
      break;
    case ".js":
      contentType = "text/javascript";
      break;
    default:
      contentType = "text/plain";
      break;
  }

  fs.readFile(filePath, function (err, data) {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("File not found");
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    }
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});


const data = await loadMnistData();

// train
for (let epoch = 0; epoch < 10; epoch++) {
  for (let i = 0; i < 10000; i++) {
    preceptron.train(data[i].pixels, data[i].label);
  }

  let accuracy = { correct: 0, incorrect: 0 };
  for (let i = 0; i < 10000; i++) {
    const res = preceptron.predict(data[i].pixels, data[i].label);
    if (res) {
      accuracy.correct += 1;
    } else {
      accuracy.incorrect += 1;
    }
  }
  console.log(accuracy);
}