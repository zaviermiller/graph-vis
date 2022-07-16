import { Graph } from '../graph';
import CanvasRenderer from '../render/canvas_renderer';
import { SimulationManager } from '../simulation';
import { getNodeAt } from './util';

export default class PinAction {
  graph: Graph;
  active: boolean;
  pinned: number[];
  canvasRenderer: CanvasRenderer;
  simManager: SimulationManager;

  constructor(graph: Graph, canvasRenderer: CanvasRenderer) {
    this.graph = graph;
    this.active = false;
    this.pinned = [];
    this.canvasRenderer = canvasRenderer;
    this.simManager = canvasRenderer.simulationManager;
  }

  onClick(canvas: HTMLCanvasElement): (e: MouseEvent) => void {
    return (e: MouseEvent) => {
      if (!this.active) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const node = getNodeAt(
        this.graph,
        x,
        y,
        this.canvasRenderer.options.nodeRadius
      );
      if (node) {
        if (this.pinned.includes(node.id)) {
          this.pinned = this.pinned.filter((id) => id !== node.id);
        } else {
          this.pinned.push(node.id);
        }
        this.simManager.pinned = this.pinned;
      }
    };
  }

  activate() {
    this.active = true;

    const onClick = this.onClick.bind(this);

    this.canvasRenderer.addCanvasEvent('click', 'pin', onClick);
  }

  deactivate() {
    this.active = false;

    this.canvasRenderer.removeCanvasEvent('click', 'pin');
  }
}
