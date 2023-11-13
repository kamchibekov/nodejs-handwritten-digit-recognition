export function reshape(arr, size) {
  var newArr = [];
  for (var i = 0; i < arr.length; i += size) {
    newArr.push(arr.slice(i, i + size));
  }
  return newArr;
}

export function max(a, b) {
  return a.map((elem, index) => {
    if (Array.isArray(elem)) {
      return max(elem, Number.isInteger(b) ? b : b[index]);
    }
    return Math.max(elem, Number.isInteger(b) ? b : b[index]);
  });
}

export function dot(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) {
    throw new Error("a, b must be arrays");
  }

  if (a.length != b.length) {
    throw new Error("a length doesn't match b's row count");
  }

  const product = Array.from({ length: b[0].length }, () => 0);

  for (let i = 0; i < b[0].length; i++) {
    for (let j = 0; j < a.length; j++) {
      product[i] += a[j] * b[j][i];
    }
  }

  return product;
}

export function add(a, b) {
  if (a.length !== b.length) {
    throw new Error("Array lengths do not match");
  }

  return a.map((a, i) => a + b[i]);
}

export function subtract(a, b) {
  if (a.length !== b.length) {
    throw new Error("Array lengths do not match");
  }

  return a.map((a, i) => a - b[i]);
}

export function transpose(a) {
  const result = Array.from({ length: a[0].length }, () =>
    Array(a.length).fill(0)
  );

  for (let i = 0; i < a[0].length; i++) {
    for (let j = 0; j < a.length; j++) {
      result[i][j] = a[j][i];
    }
  }

  return result;
}

export function multiply(a, b) {
  if (a.length !== b.length) {
    throw new Error("Array lengths do not match");
  }

  return a.map((a, i) => a * b[i]);
}
