import SelectAction from './select';

export { SelectAction };

export type Action = {
  activate(): void;
  deactivate(): void;
};
