import { Graph, GraphNode } from '../graph';
import CanvasRenderer from '../render/canvas_renderer';
import Vec2d from '../vec2d';
import { getNodeAt } from './util';

export default class SelectAction {
  graph: Graph;
  canvasRenderer: CanvasRenderer;
  active: boolean;
  mouseDown: boolean;
  origPos: { x: number; y: number } = { x: 0, y: 0 };
  selected: GraphNode | null = null;

  constructor(graph: Graph, canvasRenderer: CanvasRenderer) {
    this.graph = graph;
    this.active = false;
    this.mouseDown = false;
    this.canvasRenderer = canvasRenderer;
  }

  onClick(canvas: HTMLCanvasElement): (e: MouseEvent) => void {
    return (e: MouseEvent) => {
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
        this.canvasRenderer.simulationManager.selected = node.id;
        this.selected = node;
      } else {
        this.canvasRenderer.simulationManager.selected = -1;
        this.selected = null;
      }
    };
  }

  onMouseDown(canvas: HTMLCanvasElement): (e: MouseEvent) => void {
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
        this.canvasRenderer.simulationManager.selected = node.id;
        this.selected = node;
      } else {
        this.canvasRenderer.simulationManager.selected = -1;
        this.selected = null;
      }

      this.origPos = { x, y };
      this.mouseDown = true;
    };
  }

  onMouseMove(canvas: HTMLCanvasElement): (e: MouseEvent) => void {
    return (e: MouseEvent) => {
      if (this.active && this.mouseDown) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const posOffset = { x: x - this.origPos.x, y: y - this.origPos.y };

        if (this.selected)
          this.selected!.pos = new Vec2d(posOffset.x, posOffset.y).add(
            this.origPos
          );
      }
    };
  }

  onMouseUp(_: HTMLCanvasElement): (e: MouseEvent) => void {
    return (_: MouseEvent) => {
      this.mouseDown = false;
      this.canvasRenderer.simulationManager.selected = -1;
      this.selected = null;
    };
  }

  activate() {
    this.active = true;

    const onClick = this.onClick.bind(this);
    const onMouseDown = this.onMouseDown.bind(this);
    const onMouseMove = this.onMouseMove.bind(this);
    const onMouseUp = this.onMouseUp.bind(this);

    // this.canvas.addEventListener('click', onClick);
    // annoying typescript, annoying.
    this.canvasRenderer.addCanvasEvent('click', 'select', onClick);
    this.canvasRenderer.addCanvasEvent('mousedown', 'select', onMouseDown);
    this.canvasRenderer.addCanvasEvent('mousemove', 'select', onMouseMove);
    this.canvasRenderer.addCanvasEvent('mouseup', 'select', onMouseUp);
  }

  deactivate() {
    this.active = false;
    this.canvasRenderer.simulationManager.selected = -1;
    this.mouseDown = false;

    this.canvasRenderer.removeCanvasEvent('click', 'select');
    this.canvasRenderer.removeCanvasEvent('mousedown', 'select');
    this.canvasRenderer.removeCanvasEvent('mousemove', 'select');
    this.canvasRenderer.removeCanvasEvent('mouseup', 'select');
  }
}
