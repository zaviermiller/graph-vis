import { Graph, GraphNode } from '../graph';
import { Vec2d } from '../simple_vec';

export interface EadesOptions {
  falloff?: number;
  repulsionConstant: number;
  springConstant: number;
  idealLength: number;
  minChange?: number;
}

export class Eades {
  options: EadesOptions;
  done: boolean;
  graph: Graph | null = null;

  constructor(options: EadesOptions) {
    this.options = options;
    this.done = false;
  }

  step(graph: Graph) {
    if (this.done) return;
    this.graph = graph;
    this.graph.nodes.forEach((node, i) => {
      const forceVec = this.getForce(node);

      if (
        this.options.minChange &&
        forceVec.magnitude() < this.options.minChange
      ) {
        this.done = true;
        return;
      }

      node.pos = forceVec.scalarMult(this.options.falloff!).add(node.pos!);
    });
  }

  getForce(node: GraphNode): Vec2d {
    let totalRepulsion = new Vec2d(0, 0);
    let totalAttraction = new Vec2d(0, 0);

    this.graph!.nodes.forEach((n2, j) => {
      if (node == n2) return;
      const repul = this.repulsiveForce(node, n2);

      totalRepulsion = totalRepulsion.add(repul);
    });

    node.edges.forEach((edge) => {
      let n1, n2: GraphNode;

      if (node == edge.node1) {
        n1 = edge.node1;
        n2 = edge.node2;
      } else {
        n1 = edge.node2;
        n2 = edge.node1;
      }
      const attract = this.attractiveForce(n1, n2);

      totalAttraction = totalAttraction.add(attract);
    });

    return totalAttraction.add(totalRepulsion);
  }

  repulsiveForce(n1: GraphNode, n2: GraphNode): Vec2d {
    const u = n1.pos!;
    const v = n2.pos!;
    const vu = u.subtract(v);

    const magnitudeSqr = vu.magnitude();

    return vu.unit().scalarMult(this.options.repulsionConstant / magnitudeSqr);
  }

  attractiveForce(n1: GraphNode, n2: GraphNode): Vec2d {
    return this.springForce(n1, n2).subtract(this.repulsiveForce(n1, n2));
  }

  springForce(n1: GraphNode, n2: GraphNode): Vec2d {
    const u = n1.pos!;
    const v = n2.pos!;
    const uv = v.subtract(u);

    const dist = uv.magnitude();
    const scalarTerm =
      this.options.springConstant * Math.log(dist / this.options.idealLength);

    return uv.unit().scalarMult(scalarTerm);
  }
}
