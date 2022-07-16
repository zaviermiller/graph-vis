import PinAction from './pin';
import SelectAction from './select';

export { SelectAction, PinAction };

export type Action = {
  activate(): void;
  deactivate(): void;
};
