export default class Number {
  el: HTMLTextAreaElement;
  private _value: string;
  constructor(selector: string, value?: number) {
    this.el = document.querySelector(selector)!;
    this._value = value ? value.toString() : '';

    this.el.value = this._value;
  }

  onChange(callback: (value: number) => void) {
    this.el.addEventListener('change', () => {
      this.value = this.el.value;
      callback(this.value);
    });
  }

  get value(): number {
    return parseInt(this._value);
  }

  set value(value: string | number) {
    if (typeof value === 'string') {
      this.el.value = value;
      this._value = value;
    } else {
      this.el.value = value.toString();
      this._value = value.toString();
    }
    console.log(this._value);
  }
}
