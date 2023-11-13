import Layer from "../layers/Layer.js";

export default class Back {
  newWeights = [];
  constructor(weights, biases) {
    this.weights = weights;
    this.biases = biases;
  }

  propagate(input, output, target) {
    const learningRate = 0.01;
    const numNeurons = this.biases.length;
    const featureCount = input.length;

    for (let neuron = 0; neuron < numNeurons; neuron++) {
      const delta = target[neuron] - output[neuron] + this.biases[neuron];

      // for each feature 0..31
      for (let feature = 0; feature < featureCount; feature++) {
        const featureValue = input[feature];

        // for each pixel 0..784
        for (let i = 0; i < featureValue.length; i++) {
          const weightDelta = delta * featureValue[i];
          this.weights[neuron][feature][i] -= learningRate * weightDelta;
        }
      }
      this.biases[neuron] -= learningRate * delta;
    }
  }
}
