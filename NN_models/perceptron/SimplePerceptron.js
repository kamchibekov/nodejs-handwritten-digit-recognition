export default class SimplePerceptron {
  // Example with 2 pixels, 1 hidden layer with 1 neuron, 1 output class
  constructor(size = 2, hiddenLayers = [], classes = 1) {
    //size + size because it's non square data
    this.layers = this.initLayers([size, ...hiddenLayers, classes]);
    this.weights = this.initWeights(this.layers);
    this.biases = this.initBiases(this.layers);

    // example data
    this.layers[0][0] = 0.1;
    this.layers[0][1] = 0.5;
    this.layers[0][2] = 0.2;

    this.weights[0][0] = 0.4;
    this.weights[0][1] = 0.3;
    this.weights[0][2] = 0.6;

    this.biases[0][0] = 0.5;
  }

  initLayers(layers) {
    return Array.from(layers, (layerSize) => {
      return Array.from({ length: layerSize });
    });
  }

  initWeights(layers) {
    return Array.from(layers.slice(0, -1), (layer) =>
      Array(layer.length).fill(Math.random())
    );
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

      let activation =
        neurons[0] * weights[0] +
        neurons[1] * weights[1] +
        neurons[2] * weights[2] +
        biases[0];

      this.layers[layer + 1] = this.activate(activation);
    }
  }

  error_predicted_deriv(predicted, target) {
    return predicted - target;
  }

  sigmoid_deriv(x) {
    return x * (1 - x);
  }

  error(predicted, target) {
    return Math.pow(predicted - target, 2);
  }

  backPropagation(target) {
    // Learning rate
    const learningRate = 0.1;

    let error_deriv_calc = null;
    let sigmoid_deriv_calc = null;

    // Iterate backwards
    for (let layer = this.layers.length - 1; layer >= 0; layer--) {
      const neurons = this.layers[layer];
      const weights = this.weights[layer];
      const biases = this.biases[layer];

      if (layer == this.layers.length - 1) {
        error_deriv_calc = this.error_predicted_deriv(neurons, target);
        sigmoid_deriv_calc = this.sigmoid_deriv(neurons);

        continue;
      }

      if (!error_deriv_calc) {
        throw "error_deriv_calc is null˝";
      }

      let gradients = neurons.map(
        (n) => n * error_deriv_calc * sigmoid_deriv_calc
      );

      this.weights[layer] = weights.map(
        (w, i) => w - learningRate * gradients[i]
      );
      this.biases[layer] = biases.map(
        (b) => b - learningRate * error_deriv_calc
      );
    }
  }

  train(iter, target = 0.54) {
    this.forward();
    this.backPropagation(target);
    const err = this.error(this.layers[1], target);
    console.log(`#${iter} output:`, this.layers[1], "error:", err);
    if (err.toFixed(4) === "0.0000") {
      console.log("reached 0.0000");
      process.exit();
    }
  }

  activate(x, method = "SIGMOID") {
    // Since we are taking weight numbers from 0..1 we will divide or compare to max (1)
    switch (method.toUpperCase()) {
      case "RELU":
        return Math.max(0, Math.min(1, x / 255));
      case "SIGMOID":
        return 1.0 / (1.0 + Math.exp(-x));
      case "SOFTMAX":
        const max = Math.max(...x);
        const exps = x.map((value) => Math.exp(value - max));
        const sumExps = exps.reduce((acc, exp) => acc + exp, 0);
        const softmaxOutput = exps.map((exp) => exp / sumExps);
        return softmaxOutput;
      default:
        return Math.max(0, x);
    }
  }
}
