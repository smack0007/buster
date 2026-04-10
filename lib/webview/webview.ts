import { libWebview } from "./ffi.ts";

export class Webview {
  #webview: unknown;

  constructor() {
    this.#webview = libWebview.functions.webview_create(0, 0);
  }

  run(): void {
    libWebview.functions.webview_run(this.#webview);
  }

  setHtml(html: string): void {
    libWebview.functions.webview_set_html(this.#webview, html);
  }

  setSize(width: number, height: number): void {
    libWebview.functions.webview_set_size(this.#webview, width, height, 0);
  }

  setTitle(title: string): void {
    libWebview.functions.webview_set_title(this.#webview, title);
  }
}
