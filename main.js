import * as fs from "node:fs";
import jpeg from "jpeg-js";
import CNN from "./NN_models/cnn/CNN.js";
import Preceptron from "./NN_models/perceptron/Perceptron.js";
import SimplePerceptron from "./NN_models/perceptron/SimplePerceptron.js";
import { loadMnistData, extractTestData } from "./loadMnistData.js";

function exportImage(digit, name = "test") {
  const pixels = new Uint8Array(28 * 28 * 4);
  for (let j = 0; j < digit.length; j++) {
    let color = digit[j] * 255;
    pixels[j * 4 + 0] = color;
    pixels[j * 4 + 1] = color;
    pixels[j * 4 + 2] = color;
    pixels[j * 4 + 3] = 255;
  }

  const imageData = {
    data: pixels,
    width: 28,
    height: 28,
  };

  const jpegImageData = jpeg.encode(imageData);
  fs.writeFileSync(`./images/image-${name}.jpeg`, jpegImageData.data);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function createMiniBatches(data, batchSize) {
  const miniBatches = [];

  for (let i = 0; i < data.length; i += batchSize) {
    const miniBatch = data.slice(i, i + batchSize);
    miniBatches.push(miniBatch);
  }

  return miniBatches;
}

// transpose([[1,2], [1,2], [1,2]]);

// process.exit();

// let res = dot([1, 2,3,4,5], [2,3,4,5,6]);
// let res = dot([1,2,4,5], [[2,4,6], [3,5,7],[3,5,7], [3,5,7]]);
// let res = dot([[[2,4,6], [1,2,3]], [3,5,7]], [8,9,10]);

// process.exit();

// console.log(set.training[0], set.test.length);
//
// const cnn = new CNN(3, 32);
// cnn.train(set.training[0].input, set.training[0].output);

// const perceptron = new SimplePerceptron();

// for (let i = 0; i < 100; i++) {
//   perceptron.train(i)
// }

// console.log("weights: ", perceptron.weights);
// console.log("biases: ", perceptron.biases);

// console.log(data[0])

const preceptron = new Preceptron();
const data = await loadMnistData();
const test = await extractTestData();

// exportImage(data[1].pixels)

// process.exit();

// for (let i = 0; i < 1; i++) {
//   preceptron.train(data[1].pixels, data[1].label);
// }

// const probability = preceptron.predict(data[1].pixels, data[1].label, true);

// console.log("probability: ", probability);

// process.exit();

// console.log("Data length:", data.length);
// console.log("Test length:", test.length);

let layers = [];

preceptron.layers.forEach((l) => {
  layers.push(l.length);
});

console.log(
  `params: layers: ${preceptron.layers.length}(${layers.join(
    ","
  )}) learning rate: ${preceptron.learningRate}`
);

for (let epoch = 0; epoch < 10; epoch++) {
  shuffle(data);

  for (let i = 0; i < data.length; i++) {
    preceptron.train(data[i].pixels, data[i].label);
  }

  let accuracy = { correct: 0, incorrect: 0 };
  for (let i = 0; i < test.length; i++) {
    const res = preceptron.predict(test[i].pixels, test[i].label);
    if (res) {
      accuracy.correct += 1;
    } else {
      accuracy.incorrect += 1;
      // exportImage(set.test[i].input)
      // console.log(preceptron.layers[preceptron.layers.length - 1])
      // process.exit()
    }
  }
  console.log(accuracy);
}
