// Get the canvas element
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

// Set canvas width and height
canvas.width = 400;
canvas.height = 400;

// Variables to track mouse position and drawing state
let isDrawing = false;
let mouseX = 0;
let mouseY = 0;

// Set drawing properties
context.strokeStyle = "white"; // Set drawing color to white
context.lineWidth = 8; // Set brush thickness

// Event listeners for mouse events
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);

// Function to start drawing
function startDrawing(e) {
  isDrawing = true;
  updateMousePosition(e);
}

// Function to draw on the canvas
function draw(e) {
  if (!isDrawing) return;

  context.beginPath();
  context.moveTo(mouseX, mouseY);
  updateMousePosition(e);
  context.lineTo(mouseX, mouseY);
  context.stroke();
}

// Function to stop drawing
function stopDrawing() {
  isDrawing = false;
}

// Function to update mouse position
function updateMousePosition(e) {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
}

// Clear button event listener
const clearButton = document.getElementById("clearButton");
clearButton.addEventListener("click", clearCanvas);

// Function to clear the canvas
function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

// Function to get the canvas data and convert it to a 28x28 array
function getCanvasData() {
  // Resize canvas to 28x28
  const resizedCanvas = document.createElement("canvas");
  const resizedContext = resizedCanvas.getContext("2d");
  resizedCanvas.width = 28;
  resizedCanvas.height = 28;

  // Draw the current canvas data onto the resized canvas
  resizedContext.drawImage(canvas, 0, 0, 28, 28);

  // Get the image data of the resized canvas
  const imageData = resizedContext.getImageData(0, 0, 28, 28).data;

  // Convert the image data to a 28x28 grayscale array
  const grayscaleArray = [];

  for (let i = 0; i < imageData.length; i += 4) {
    // Extract RGB values from image data
    const red = imageData[i];
    const green = imageData[i + 1];
    const blue = imageData[i + 2];

    // Calculate grayscale value using the formula: grayscale = (0.299 * red + 0.587 * green + 0.114 * blue)
    const grayscale = 0.299 * red + 0.587 * green + 0.114 * blue;

    // Normalize grayscale value to range [0, 1]
    const normalizedGrayscale = grayscale / 255;

    // Push the grayscale value to the array
    grayscaleArray.push(normalizedGrayscale);
  }

  return grayscaleArray;
}

// recognize button event listener
const recognizeButton = document.getElementById("recognize");
const digitArea = document.getElementById("digit");
recognizeButton.addEventListener("click", () => {
  const grayscaleArray = getCanvasData();
  console.log(grayscaleArray.length);
  const data = {
    image: grayscaleArray,
  };

  fetch("/recognize", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.text())
    .then((responseData) => {
      // Handle the response data
      digitArea.innerHTML = responseData;
    })
    .catch((error) => {
      // Handle any errors
      console.error("Error:", error);
    });
});
