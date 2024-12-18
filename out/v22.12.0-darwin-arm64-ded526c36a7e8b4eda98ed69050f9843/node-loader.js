// ../buster/src/node-loader.ts
import { register } from "node:module";
register("./node-hooks.js", import.meta.url);
