import Layer from "../layers/Layer.js";
import * as NP from "../../../libs/arr.js";

export default class Forward {
  features = [];
  constructor(filters) {
    this.filters = filters;
  }

  convolute(array, stride = [1, 1], padding = [1, 1]) {
    // 28 x 28
    array = NP.reshape(array, 28);

    this.features = this.filters.map((filter) =>
      this.convoluteArray(array, filter, stride, padding)
    );
  }
  // ReLU
  activate() {
    // this.features.forEach((element) => {
    //   element.forEach((e) => {
    //     if (element.some((a) => a < 0)) {
    //       console.log("there are negative elements");
    //     }
    //   });
    // });

    for (let i = 0; i < this.features.length; i++) {
      const feature = this.features[i];
      this.features[i] = NP.max(feature, 0);
    }

    // this.features.forEach((element) => {
    //   element.forEach((e) => {
    //     if (element.some((a) => a < 0)) {
    //       console.log("after:", "there are still negative elements");
    //     }
    //   });
    // });

    // process.exit();
  }

  convoluteArray(array, filter, stride, padding) {
    const result = [];

    const filterHeight = filter.length;
    const filterWidth = filter[0].length;
    const [paddingHeight, paddingWidth] = padding;

    for (let i = 0; i < array.length; i += stride[0]) {
      const row = [];
      for (let j = 0; j < array[i].length; j += stride[1]) {
        let sum = 0;
        // filter
        for (let k = 0; k < filterHeight; k++) {
          for (let l = 0; l < filterWidth; l++) {
            const rowIndex = i + k - paddingHeight;
            const colIndex = j + l - paddingWidth;

            // Handle edge cases
            if (
              rowIndex >= 0 &&
              rowIndex < array.length &&
              colIndex >= 0 &&
              colIndex < array[i].length
            ) {
              sum += array[rowIndex][colIndex] * filter[k][l];
            }
          }
        }
        row.push(sum);
      }
      result.push(row);
    }

    return result;
  }
}
