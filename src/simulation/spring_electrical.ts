import { Graph, GraphNode } from '../graph';
import { Vec2d } from '../simple_vec';

/**
 * Spring electrical simulation, implementation of 2.1 in
 * this paper: http://yifanhu.net/PUB/ch16.pdf
 */

export interface SpringElectricalOptions {
  K: number;
  maxStepSize: number;
  tolerance: number;
}

export default class SpringElectrical {
  graph: Graph | null = null;
  options: SpringElectricalOptions;
  done: boolean = false;

  constructor(options: SpringElectricalOptions) {
    this.options = options;
  }

  step(graph: Graph): void {
    this.graph = graph;

    for (const n1 of graph.nodes) {
      if (n1.edges.size == 0) continue;
      let totalForce = new Vec2d(0, 0);
      n1.edges.forEach((edge) => {
        const n2 = n1 == edge.node1 ? edge.node2 : edge.node1;
        const force = this.attractive(n1, n2);
        totalForce = totalForce.add(force);
      });

      for (const n2 of graph.nodes) {
        if (n1 == n2 || n2.edges.size == 0) continue;

        const force = this.repulsive(n1, n2);
        totalForce = totalForce.add(force);
      }

      if (totalForce.magnitude() > this.options.tolerance) {
        totalForce = totalForce.unit().scalarMult(this.options.maxStepSize);
        n1.pos = totalForce.add(n1.pos!);
      }
    }

    // if (nDone == graph.nodes.length) this.done = true;
  }

  attractive(n1: GraphNode, n2: GraphNode) {
    const n1Pos = n1.pos!;
    const n2Pos = n2.pos!;

    const distanceVec = n1Pos.subtract(n2Pos);

    const firstFactor = distanceVec.magnitude() / this.options.K;

    return distanceVec.unit().scalarMult(-1 * firstFactor);
  }

  repulsive(n1: GraphNode, n2: GraphNode) {
    const n1Pos = n1.pos!;
    const n2Pos = n2.pos!;

    const distanceVec = n1Pos.subtract(n2Pos);

    const scalar = this.options.K ** 2 / distanceVec.magnitude();

    return distanceVec.unit().scalarMult(scalar);
  }
}
