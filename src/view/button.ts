import { Action } from '../interaction';

export interface ButtonState {
  icon: string;
}

export default class Button {
  el: HTMLButtonElement;
  icon: string;
  activeIcon: string;
  toggleGroup?: Button[];
  active: boolean;
  action?: Action;

  constructor(
    selector: string,
    icon: string,
    activeIcon?: string,
    action?: Action
  ) {
    this.el = document.querySelector(selector) as HTMLButtonElement;
    this.icon = icon;
    this.activeIcon = activeIcon ? activeIcon : icon;
    this.active = false;
    this.action = action;

    // render button icon
    iconFor(this.el, this.icon);

    if (this.action) {
      this.handle('click');
    }
  }

  handle(event: string, action?: (e: Event) => void) {
    this.el.addEventListener(event, (e) => {
      this.toggleGroup?.forEach((b) => {
        b.deactivate();
      });
      this.toggle();
      if (action) action(e);
    });
  }

  toggle() {
    this.active = !this.active;
    iconFor(this.el, this.active ? this.activeIcon : this.icon);
    if (this.action) {
      if (this.active) this.action.activate();
      else this.action.deactivate();
    }
  }

  activate() {
    this.active = true;
    iconFor(this.el, this.activeIcon);
    if (this.action) {
      this.action.activate();
    }
  }

  deactivate() {
    this.active = false;
    iconFor(this.el, this.icon);
    if (this.action) {
      this.action.deactivate();
    }
  }

  static group(...buttons: Button[]) {
    buttons.forEach((button) => {
      button.toggleGroup = buttons.filter((b) => b !== button);
    });
  }
}

function iconFor(el: HTMLElement, icon: string) {
  el.innerHTML = `
<svg viewBox="0 0 24 24">
  <path d="${icon}" />
</svg>`;
}
