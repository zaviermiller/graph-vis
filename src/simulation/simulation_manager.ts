import { Simulation } from '.';
import { deepCopy, Edge, Graph, GraphNode } from '../graph';
import Vec2d from '../vec2d';

export interface SimulationOptions {
  simulation: Simulation;
  maxSteps: number;
  startPaused?: boolean;
  tolerance: number;
}

export interface SimulationState {
  pinned: number[];
}

export class SimulationManager {
  options: SimulationOptions;
  stopped: boolean;
  graph: Graph;
  originalGraph: Graph;
  currentStep: number = 0;
  originalPos: Vec2d[];

  // extra state
  pinned: number[] = [];
  selected: number = -1;
  activeEdge: Edge | null = null;

  constructor(graph: Graph, options: SimulationOptions) {
    this.options = options;
    this.graph = graph;
    this.originalGraph = deepCopy(graph);
    this.stopped = !!this.options.startPaused;
    this.originalPos = new Array(graph.nodes.length);
  }

  setup(canvasWidth: number, canvasHeight: number) {
    this.graph.nodes.forEach((node) => {
      const x =
        (Math.random() * canvasWidth) / 2 + (Math.random() * canvasWidth) / 2;
      const y =
        (Math.random() * canvasHeight) / 2 + (Math.random() * canvasHeight) / 2;

      node.pos = new Vec2d(x, y);
    });
  }

  start() {
    this.stopped = false;
  }

  stop() {
    this.stopped = true;
  }

  toggle() {
    this.stopped = !this.stopped;
  }

  step() {
    if (this.stopped) return;

    // save the pos data of the nodes
    this.graph.nodes.forEach((node, i) => {
      this.originalPos[i] = new Vec2d(node.pos!.x, node.pos!.y);
    });

    if (this.pinned.length > 0) {
      this.__filteredStep(this.graph);
    } else {
      this.options.simulation.step(this.graph);
    }

    this.__checkTolerance(this.graph);

    this.currentStep++;
    this.stopped = this.currentStep >= this.options.maxSteps;

    return this.graph;
  }

  private __filteredStep(graph: Graph) {
    let nodes: GraphNode[] = graph.nodes.map((node) => ({ ...node }));

    // run sim only on filtered nodes
    this.options.simulation.step(graph);

    // update nodes with updated pos data and set them to graph nodes
    graph.nodes.forEach((node) => {
      if (this.pinned.includes(node.id)) {
        node.pos = nodes.find((n) => node.id === n.id)!.pos;
      }
    });

    return graph;
  }

  private __checkTolerance(graph: Graph) {
    const tolerance = this.options.tolerance;
    const nodes = graph.nodes;
    let count = 0;

    nodes.forEach((node, i) => {
      const nodeVec = node.pos!;
      const originalVec = this.originalPos[i];

      if (nodeVec.subtract(originalVec).magnitude() < tolerance) {
        count++;
      }
    });
    if (count === nodes.length) {
      this.stopped = true;
    } else {
      this.stopped = false;
    }
  }
}
