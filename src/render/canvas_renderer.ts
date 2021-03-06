import { Graph } from '../graph';
import { SimulationManager } from '../simulation';

interface EventHandlers {
  [name: string]: (e: Event | MouseEvent) => void;
}

export interface CanvasRendererOptions {
  nodeRadius: number;
}

const DEFAULT_OPTIONS: CanvasRendererOptions = {
  nodeRadius: 10,
};

// singleton class CanvasRenderer
export default class CanvasRenderer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  graph: Graph;
  simulationManager: SimulationManager;
  handlers: EventHandlers = {};
  options: CanvasRendererOptions;

  static DEBUG = false;

  constructor(
    canvasSelector: string,
    simulationManager: SimulationManager,
    options?: CanvasRendererOptions
  ) {
    this.canvas = document.querySelector(canvasSelector) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    if (!simulationManager.graph) throw 'SimulationManager must have a graph';
    this.graph = simulationManager.graph;
    this.simulationManager = simulationManager;
    this.options = options ? options : DEFAULT_OPTIONS;

    this.setup();
  }

  setup() {
    if (CanvasRenderer.DEBUG) {
      (<any>window).$cr = this;
    }

    this.canvas.height = this.canvas.scrollHeight;
    this.canvas.width = this.canvas.scrollWidth;

    this.simulationManager.setup(this.canvas.width, this.canvas.height);
  }

  render() {
    const graph = this.graph;
    const canvas = this.canvas;
    const ctx = this.ctx;

    this.simulationManager.step();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // draw edges, then draw nodes
    graph.edges.forEach((edge) => {
      const node1 = edge.node1;
      const node2 = edge.node2;
      const edgeSelected =
        this.simulationManager.selected === node1.id ||
        this.simulationManager.selected === node2.id;
      ctx.beginPath();
      ctx.lineWidth = this.options.nodeRadius / 3;
      if (edgeSelected) {
        ctx.strokeStyle = '#818ef7';
      } else if (edge === this.simulationManager.activeEdge) {
        ctx.strokeStyle = '#f54542';
      } else {
        ctx.strokeStyle = '#666';
      }
      // ctx.strokeStyle = edgeSelected ? '#818ef7' : '#666';
      ctx.moveTo(node1.pos!.x, node1.pos!.y);
      ctx.lineTo(node2.pos!.x, node2.pos!.y);
      ctx.stroke();
    });

    graph.nodes.forEach((node) => {
      const pos = node.pos!;
      ctx.beginPath();
      if (node.id == this.simulationManager.selected) {
        ctx.strokeStyle = '#818ef7';
      } else if (this.simulationManager.pinned.includes(node.id)) {
        ctx.strokeStyle = '#cf3230';
      } else {
        ctx.strokeStyle = '#d68629';
      }
      ctx.fillStyle = this.simulationManager.pinned.includes(node.id)
        ? '#f54542'
        : '#fca643';
      ctx.lineWidth = this.options.nodeRadius / 2;
      ctx.arc(pos.x, pos.y, this.options.nodeRadius, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = `${this.options.nodeRadius}px monospace`;
      ctx.fillText(
        `${node.id}`,
        pos.x - this.options.nodeRadius / 3,
        pos.y + this.options.nodeRadius / 3
      );
      if (CanvasRenderer.DEBUG) {
        ctx.fillStyle = '#000';
        ctx.fillText(
          `(${Math.round(pos.x)}, ${Math.round(pos.y)})`,
          pos.x + 10,
          pos.y + 15
        );
      }
    });
  }

  renderLoop() {
    this.render();
    requestAnimationFrame(this.renderLoop.bind(this));
  }

  addRawCanvasEvent(
    event: string,
    name: string,
    callback: (e: Event | MouseEvent) => void
  ) {
    this.canvas.addEventListener(event, callback);
    this.handlers[`${name}.${event}`] = callback;
  }

  addCanvasEvent(
    event: string,
    name: string,
    builder: (canvas: HTMLCanvasElement, graph: Graph) => (e: any) => void
  ) {
    this.addRawCanvasEvent(event, name, builder(this.canvas, this.graph));
  }

  removeCanvasEvent(event: string, name: string) {
    this.canvas.removeEventListener(event, this.handlers[`${name}.${event}`]);
    delete this.handlers[`${name}.${event}`];
  }
}
