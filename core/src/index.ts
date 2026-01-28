function sayHello() {
  return "Hello, World!";
}

function sayGoodbye() {
  return "Goodbye, World!";
}

function sayGoodAfternoon() {
  return "Good Afternoon, World!";
}


export function doHelloWorld() {
  const hello = sayHello();
  const goodbye = sayGoodbye();
  const goodAfternoon = sayGoodAfternoon();

  return { hello, goodbye, goodAfternoon };
}
