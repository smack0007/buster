import { Webview } from "buster:webview";

const webview = new Webview();
webview.setSize(800, 600);
webview.setTitle("Hello World!");

webview.setHtml(`
  <style>
    html {
      background-color: blue;
    }

    h1 {
      color: red;
    }
  </style>
  <h1>Hello World!</h1>
`);

webview.run();
