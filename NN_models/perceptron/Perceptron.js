import { dot, add, subtract, transpose, multiply } from "../../libs/arr.js";

export default class Preceptron {
  // Example with 784 pixels, 2 hidden layers with 18 and 16 neurons, 10 output classes 0..9
  constructor(size = 784, hiddenLayers = [30], classes = 10) {
    this.layers = this.initLayers([size, ...hiddenLayers, classes]);
    this.weights = this.initWeights(this.layers);
    this.biases = this.initBiases(this.layers);
    this.learningRate = 0.35;

    //params: layers: 3(784,30,10) learning rate: 0.35 activation: sigmoid
    // { correct: 9536, incorrect: 464 }
    // { correct: 9518, incorrect: 482 }
    // { correct: 9539, incorrect: 461 }
    // { correct: 9526, incorrect: 474 }
    // { correct: 9548, incorrect: 452 }
  }

  initLayers(layers) {
    return Array.from(layers, (layerSize) => {
      return Array.from({ length: layerSize });
    });
  }

  initWeights(layers) {
    return Array.from(layers.slice(0, -1), (layer, index) => {
      let callback = () =>
        Array.from(
          { length: layers[index + 1].length },
          () => Math.random() * 2 - 1
        );
      return Array.from({ length: layer.length }, callback);
    });
  }

  initBiases(layers) {
    return Array.from(layers.slice(1), (layer) => {
      return Array.from({ length: layer.length }, () => Math.random() * 2 - 1);
    });
  }

  forward() {
    for (let layer = 0; layer < this.layers.length - 1; layer++) {
      const neurons = this.layers[layer];
      const weights = this.weights[layer];
      const biases = this.biases[layer];

      let zs = dot(neurons, weights);

      // console.log("zs:", zs)

      zs = add(zs, biases);

      const activations = zs.map((z) => this.sigmoid(z));

      this.layers[layer + 1] = activations;
    }
  }

  back(target) {
    let delta = null;
    // const gradientClippingThreshold = 1.0; // Adjust the threshold as needed

    for (let layer = this.layers.length - 1; layer >= 0; layer--) {
      const neurons = this.layers[layer];

      // Calculating gradient for output neurons is different from hidden layers
      if (layer == this.layers.length - 1) {
        delta = neurons.map((n, i) => (n - target[i]) * this.sigmoid_deriv(n));

        // Clip gradients to prevent explosion
        // delta = delta.map((grad) => Math.min(grad, gradientClippingThreshold));

        // Update biases of the output neurons

        // console.log("delta:", delta)

        this.biases[layer - 1] = this.biases[layer - 1].map(
          (b, i) => b - this.learningRate * delta[i]
        );

        // console.log("delta after:", delta)

        // process.exit()

        continue;
      }

      const weights = this.weights[layer];

      const w_gradient = neurons.map((n) => delta.map((d) => n * d));

      this.weights[layer] = w_gradient.map((gradients, n) =>
        gradients.map(
          (gradient, w) => weights[n][w] - this.learningRate * gradient
        )
      );

      // update delta for next itereation
      delta = multiply(
        dot(delta, transpose(weights)),
        neurons.map((n) => this.sigmoid_deriv(n))
      );

      // Clip gradients to prevent explosion
      // delta = delta.map((grad) => Math.min(grad, gradientClippingThreshold));

      if (layer > 0) {
        this.biases[layer - 1] = this.biases[layer - 1].map(
          (b, i) => b - this.learningRate * delta[i]
        );
      }
    }
  }

  train(imagePixels, target) {
    this.layers[0] = imagePixels;
    this.forward();
    this.back(target);
  }

  relu(z) {
    return Math.max(0, z);
  }

  relu_deriv(z) {
    return z >= 0 ? 1 : 0;
  }

  sigmoid(z) {
    return 1.0 / (1.0 + Math.exp(-z));
  }

  sigmoid_deriv(x) {
    // since I am already passing through sigmoid in forward, no need to use sigmoid function again
    return x * (1 - x);
  }

  softmax(x) {
    const expValues = x.map(Math.exp);
    const sumExp = expValues.reduce((acc, val) => acc + val, 0);
    return expValues.map((exp) => exp / sumExp);
  }

  cost(output, target) {
    const squaredCost = target.map((v, i) => Math.pow(v - output[i], 2));
    const cost = squaredCost.reduce((a, b) => a + b, 0) / target.length;
    console.log("cost:", cost);
    return cost;
  }

  predict(imagePixels, target, probability = false) {
    this.layers[0] = imagePixels;
    this.forward();
    const output = this.layers[this.layers.length - 1];

    if (target === 2) {
      return output.indexOf(Math.max(...output));
    }

    if (probability) {
      //return output.indexOf(Math.max(...output));

      return [
        output,
        target,
        target.indexOf(Math.max(...target)) ===
          output.indexOf(Math.max(...output)),
      ];
    }

    return (
      target.indexOf(Math.max(...target)) ===
      output.indexOf(Math.max(...output))
    );
  }
}
