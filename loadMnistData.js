import { gunzipSync } from "zlib";
import { readFileSync } from "fs";

// Function to decompress the gzipped file and convert it into a JSON array
export async function loadMnistData() {
  try {
    // Read and decompress the image file into a buffer
    const imageDecompressedBuffer = gunzipSync(
      readFileSync('./data/train-images-idx3-ubyte.gz')
    );

    // Read and decompress the label file into a buffer
    const labelDecompressedBuffer = gunzipSync(
      readFileSync('./data/train-labels-idx1-ubyte.gz')
    );

    // Parse the MNIST image file format
    const imageMagicNumber = imageDecompressedBuffer.readUInt32BE(0);
    const numImages = imageDecompressedBuffer.readUInt32BE(4);
    const numRows = imageDecompressedBuffer.readUInt32BE(8);
    const numCols = imageDecompressedBuffer.readUInt32BE(12);

    // Parse the MNIST label file format
    const labelMagicNumber = labelDecompressedBuffer.readUInt32BE(0);
    const numLabels = labelDecompressedBuffer.readUInt32BE(4);

    // Check if the magic numbers match the expected values
    if (imageMagicNumber !== 2051 || labelMagicNumber !== 2049) {
      throw new Error('Invalid magic number in files');
    }

    if (numImages !== numLabels) {
      throw new Error('Mismatch in the number of images and labels.');
    }

    // Initialize the JSON array
    const jsonData = [];

    // Loop through each image and convert to JSON
    for (let i = 0; i < numImages; i++) {
      const imageOffset = 16 + i * numRows * numCols;
      const imageDecompressedBufferSlice = imageDecompressedBuffer.slice(
        imageOffset,
        imageOffset + numRows * numCols
      );
      
      const pixels = Array.from(imageDecompressedBufferSlice).map(value => value / 255);;

      const labelValue = labelDecompressedBuffer.readUInt8(8 + i); // Read the corresponding label

      // Represent the label as an array with zeros and a single 1
      const labelArray = Array.from({ length: 10 }, (_, index) =>
        index === labelValue ? 1 : 0
      );

      jsonData.push({
        label: labelArray,
        pixels: pixels,
      });
    }

    console.log('Data JSON completed successfully.');

    return jsonData;
  } catch (error) {
    console.error('Error:', error.message);
  }
}

export async function extractTestData() {
  try {
    // Read and decompress the image file
    const imageDecompressedBuffer = gunzipSync(
      readFileSync("./data/t10k-images-idx3-ubyte.gz")
    );

    // Read and decompress the label file
    const labelDecompressedBuffer = gunzipSync(
      readFileSync("./data/t10k-labels-idx1-ubyte.gz")
    );

    // Parse the header information
    const imageMagicNumber = imageDecompressedBuffer.readUInt32BE(0);
    const labelMagicNumber = labelDecompressedBuffer.readUInt32BE(0);

    // Check if the magic numbers match the expected values
    if (imageMagicNumber !== 2051 || labelMagicNumber !== 2049) {
      throw new Error("Invalid magic number in files");
    }

    // Get the number of images and dimensions from the header
    const numImages = imageDecompressedBuffer.readUInt32BE(4);
    const numRows = imageDecompressedBuffer.readUInt32BE(8);
    const numCols = imageDecompressedBuffer.readUInt32BE(12);

    // Get the labels from the label file
    const labels = [];
    for (let i = 0; i < numImages; i++) {
      const label = labelDecompressedBuffer.readUInt8(8 + i);
      const labelArray = Array.from({ length: 10 }, (_, index) =>
        index === label ? 1 : 0
      );
      labels.push(labelArray);
    }

    if (numImages !== labels.length) {
      throw new Error("Mismatch in the number of images and labels.");
    }

    // Create arrays to store image data and corresponding labels
    const images = [];

    for (let i = 0; i < numImages; i++) {
      const start = 16 + i * numRows * numCols;
      const end = start + numRows * numCols;
      const pixels = Array.from(imageDecompressedBuffer.slice(start, end));
      const imageArray = pixels.map((value) => value / 255); // Normalize pixel values
      images.push({ pixels: imageArray, label: labels[i] });
    }

    console.log('Test JSON completed successfully.');


    return images;
  } catch (error) {
    console.error("Error extracting test data:", error.message);
  }
}
