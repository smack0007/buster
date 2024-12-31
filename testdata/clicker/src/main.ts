import { Clicker } from "./clicker.ts";

const app = document.querySelector<HTMLDivElement>("#app");

if (app === null) {
  throw new Error("App element is null.");
}

app.innerHTML = `
  <div id="clicker">
  </div>
`;

new Clicker("#clicker");
