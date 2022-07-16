import { Graph, removeEdge } from '../graph';
import { CanvasRenderer } from '../render';
import { edgeOver } from './util';

export default class DeleteEdgeAction {
  canvasRenderer: CanvasRenderer;

  constructor(canvasRenderer: CanvasRenderer) {
    this.canvasRenderer = canvasRenderer;
  }

  activate(): void {
    this.canvasRenderer.addCanvasEvent(
      'mousemove',
      'delete-edge',
      this.onMouseMove.bind(this)
    );
    this.canvasRenderer.addCanvasEvent(
      'click',
      'delete-edge',
      this.onClick.bind(this)
    );
  }

  deactivate(): void {
    this.canvasRenderer.removeCanvasEvent('mousemove', 'delete-edge');
    this.canvasRenderer.removeCanvasEvent('click', 'delete-edge');
  }

  onMouseMove(
    canvas: HTMLCanvasElement,
    graph: Graph
  ): (e: MouseEvent) => void {
    return (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const edge = edgeOver(graph, x, y);

      this.canvasRenderer.simulationManager.activeEdge = edge;
    };
  }

  onClick(_: HTMLCanvasElement, graph: Graph): (e: MouseEvent) => void {
    return (__: MouseEvent) => {
      for (const edge of graph.edges) {
        if (edge === this.canvasRenderer.simulationManager.activeEdge) {
          removeEdge(graph, edge);
        }
      }
    };
  }
}
