import ForwardPropagation from "./propagation/Forward.js";
import FullyConnectedLayer from "./layers/FullyConnectedLayer.js";
import BackPropagation from "./propagation/Back.js";

class CNN {
  filters = [];
  features = [];
  weights = [];
  biases = [];
  neuron_count = 10;

  constructor(filter_size, filter_count) {
    this.initiateWeights(filter_count);
    this.initiateFilters(filter_size, filter_count);
    this.initiateBiases();
  }

  initiateFilters(filter_size, filter_count) {
    this.filters = Array.from({ length: filter_count }, () =>
      Array.from({ length: filter_size }, () =>
        Array.from({ length: filter_size }, () => Math.random())
      )
    );
  }

  initiateWeights(filter_count) {
    this.weights = new Array(this.neuron_count).fill(
      new Array(filter_count).fill(new Array(28 * 28).fill(Math.random()))
    );
  }

  initiateBiases() {
    this.biases = new Array(this.neuron_count).fill(Math.random() * 2 - 1);
  }

  train(input, target) {
    // console.log("target:", target);
    // let output = 0;
    // for (let i = 0; i < 10000; i++) {
    const forwardPropagation = new ForwardPropagation(this.filters);

    forwardPropagation.convolute(input);
    forwardPropagation.activate();

    const fullyConnectedLayer = new FullyConnectedLayer(
      forwardPropagation.features,
      this.weights,
      this.biases
    );

    fullyConnectedLayer.flatten();
    fullyConnectedLayer.apply();
    const output = fullyConnectedLayer.predict();
    const backPropagation = new BackPropagation(this.weights, this.biases);
    backPropagation.propagate(
      fullyConnectedLayer.flattenedFeatures,
      output,
      target
    );

    // }

    // console.log(
    //   "output:",
    //   output,
    //   "value:",
    //   output.indexOf(Math.min(...output))
    // );
  }

  predict(input) {
    const forwardPropagation = new ForwardPropagation(this.filters);

    forwardPropagation.convolute(input);
    forwardPropagation.activate();

    const fullyConnectedLayer = new FullyConnectedLayer(
      forwardPropagation.features,
      this.weights,
      this.biases
    );

    fullyConnectedLayer.flatten();
    fullyConnectedLayer.apply();
    const output = fullyConnectedLayer.predict();
    console.log(output);
    return output.indexOf(Math.max(...output));
  }
}

export default CNN;
