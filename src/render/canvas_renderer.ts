import { Graph } from '../graph';
import { SimulationManager } from '../simulation';

interface EventHandlers {
  [name: string]: (e: Event | MouseEvent) => void;
}

export interface CanvasRendererOptions {
  radius: number;
}

const DEFAULT_OPTIONS: CanvasRendererOptions = {
  radius: 10,
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
      window.$cr = this;
    }

    this.canvas.height = this.canvas.scrollHeight;
    this.canvas.width = this.canvas.scrollWidth;
  }

  render() {
    const graph = this.graph;
    const canvas = this.canvas;
    const ctx = this.ctx;

    this.simulationManager.step();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // draw edges, then draw nodes
    graph.edges.forEach(({ node1, node2 }) => {
      const edgeSelected =
        this.simulationManager.selected === node1.id ||
        this.simulationManager.selected === node2.id;
      ctx.beginPath();
      ctx.lineWidth = this.options.radius / 3;
      ctx.strokeStyle = edgeSelected ? '#818ef7' : '#666';
      ctx.moveTo(node1.pos!.x, node1.pos!.y);
      ctx.lineTo(node2.pos!.x, node2.pos!.y);
      ctx.stroke();
    });

    graph.nodes.forEach((node) => {
      const pos = node.pos!;
      ctx.beginPath();
      ctx.strokeStyle =
        node.id == this.simulationManager.selected ? '#666' : '#f2f2f2';
      ctx.fillStyle = this.simulationManager.pinned.includes(node.id)
        ? '#818ef7'
        : '#fca643';
      ctx.lineWidth = this.options.radius / 2;
      ctx.arc(pos.x, pos.y, this.options.radius, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = `${this.options.radius}px monospace`;
      ctx.fillText(
        `${node.id}`,
        pos.x - this.options.radius / 3,
        pos.y + this.options.radius / 3
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
    builder: (canvas: HTMLCanvasElement) => (e: Event | MouseEvent) => void
  ) {
    this.addRawCanvasEvent(event, name, builder(this.canvas));
  }

  removeCanvasEvent(event: string, name: string) {
    this.canvas.removeEventListener(event, this.handlers[`${name}.${event}`]);
    delete this.handlers[`${name}.${event}`];
  }
}
