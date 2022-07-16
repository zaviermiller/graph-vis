import { default as PinAction, default as SelectAction } from './select';

export { SelectAction, PinAction };

export type Action = {
  activate(): void;
  deactivate(): void;
};
