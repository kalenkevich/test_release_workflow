function sayHello() {
  return "Hello, World!";
}

function sayGoodbye() {
  return "Goodbye, World!";
}

export function doHelloWorld() {
  const hello = sayHello();
  const goodbye = sayGoodbye();

  return { hello, goodbye };
}
