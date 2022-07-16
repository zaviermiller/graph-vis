import DeleteEdgeAction from './deleteEdge';
import PinAction from './pin';
import SelectAction from './select';

export { SelectAction, PinAction, DeleteEdgeAction };

export type Action = {
  activate(): void;
  deactivate(): void;
};
