export default class TextArea {
  el: HTMLTextAreaElement;
  private _value: string;
  constructor(selector: string, value?: string) {
    this.el = document.querySelector(selector)!;
    this._value = value ? value : '';

    this.el.value = this._value;
  }

  onChange(callback: () => void) {
    this.el.addEventListener('change', () => {
      this._value = this.el.value;
      callback();
    });
  }

  get value(): string {
    return this._value;
  }

  set value(value: string) {
    this.el.value = value;
    this._value = value;
    console.log(this._value);
  }
}
