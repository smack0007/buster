import { argv } from "node:process";
import { sayHello } from "./sayHello.ts";

const args = argv.slice(2);
const name = args.length ? args.join(" ") : "World";
console.info(sayHello(name));
