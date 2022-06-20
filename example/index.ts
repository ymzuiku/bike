import fastify from "fastify";
import { module } from "./module";

const app = fastify();

app.get("/", async () => {
  return { msg: "hello world example" };
});

app.get("/v1/hello", async () => {
  module();
  return { msg: "world" };
});

console.log("Server listen: http://localhost:5000");

// setTimeout(() => {
//   module();
// }, 100);

function fibonacci(n: number) {
  if (n == 0 || n == 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

async function start() {
  console.time("js");
  fibonacci(43);
  console.timeEnd("js");
}

start();

app.listen({ port: 5000 });
