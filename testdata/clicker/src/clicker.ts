export class Clicker {
  private readonly element: HTMLDivElement;
  private readonly button: HTMLButtonElement;
  private clickCount = 0;

  public constructor(selector: string) {
    const element = document.querySelector<HTMLDivElement>(selector);

    if (element === null) {
      throw new Error("Clicker element is null.");
    }

    this.element = element;

    this.element.innerHTML = `
      <button class="clicker">Click me!</button>
    `;

    this.button = this.element.querySelector(".clicker")!;
    this.button.onclick = (): void => {
      this.clickCount += 1;
      this.button.innerText = `You've clicked me ${this.clickCount} times.`;
    };
  }
}
