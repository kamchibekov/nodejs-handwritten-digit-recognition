import Layer from "./Layer.js";

export default class FullyConnectedLayer {
  output = [];
  flattenedFeatures = [];
  constructor(features, weights, biases) {
    this.features = features;
    this.weights = weights;
    this.biases = biases;
  }

  apply() {
    const numNeurons = this.biases.length;
    this.output = new Array(numNeurons);
    const featureCount = this.flattenedFeatures.length;

    // for each neuron 0..9
    for (let neuron = 0; neuron < numNeurons; neuron++) {
      let sum = 0;

      // for each feature 0..31
      for (let feature = 0; feature < featureCount; feature++) {
        const featureValue = this.flattenedFeatures[feature];
        const featureWeight = this.weights[neuron][feature];

        // for each pixel 0..784
        for (let i = 0; i < featureValue.length; i++) {
          sum += featureValue[i] * featureWeight[i];
        }
      }
      this.output[neuron] = sum + this.biases[neuron];
    }
  }

  flatten() {
    this.flattenedFeatures = this.features.map((feature) => feature.flat());
  }

  softmax() {
    const maxLogit = Math.max(...this.output);
    const shiftedLogits = this.output.map((logit) => logit - maxLogit);
    const exps = shiftedLogits.map((logit) => Math.exp(logit));
    const sumExps = exps.reduce((acc, exp) => acc + exp, 0);
    this.output = exps.map((exp) => exp / sumExps);
  }

  predict() {
    this.softmax();
    return this.output;
  }
}
