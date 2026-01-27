function someFunction() {
  return "Hello, World!";
}

function someOtherFunction() {
  return "Goodbye, World!";
}

export function doHelloWorld() {
  console.log(someFunction());
  console.log(someOtherFunction());
}
