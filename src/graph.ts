import Vec2d from './vec2d';

export interface GraphNode {
  id: number;
  // val: any | undefined;
  pos?: Vec2d;
  edges: Map<number, Edge>;
}

export interface Edge {
  node1: GraphNode;
  node2: GraphNode;
}

export interface Graph {
  nodes: GraphNode[];
  edges: Edge[];
}

export function deepCopy(g: Graph): Graph {
  const nodes = g.nodes.map((node) => ({
    ...node,
    edges: new Map(),
  }));
  const edges = g.edges.map((edge) => ({
    ...edge,
    node1: nodes.find((n) => n.id === edge.node1.id)!,
    node2: nodes.find((n) => n.id === edge.node2.id)!,
  }));

  edges.forEach((edge) => {
    edge.node1.edges.set(edge.node2.id, edge);
    edge.node2.edges.set(edge.node1.id, edge);
  });
  return { nodes, edges };
}

export function adjMat(g: Graph): number[][] {
  const adj = g.nodes.map((node) =>
    g.nodes.map((n2) => (node.edges.has(n2.id) ? 1 : 0))
  );
  return adj;
}

export class GraphFactory {
  static create(adjList: number[][]): Graph {
    let nodes: GraphNode[] = [];
    let edges: Edge[] = [];

    // create nodes
    adjList.forEach((_, i) => {
      const node = {
        id: i,
        edges: new Map<number, Edge>(),
      };
      nodes.push(node);
    });

    adjList.forEach((nodeAdj, i) => {
      let node = nodes[i];

      nodeAdj.forEach((isAdjacent, j) => {
        if (isAdjacent && !node.edges.get(j)) {
          const node2 = nodes[j];
          const edge = {
            node1: node,
            node2,
          };
          nodes[j] = node2;
          node.edges.set(j, edge);
          node2.edges.set(i, edge);
          edges.push(edge);
        }
      });
    });

    return {
      nodes,
      edges,
    };
  }

  static create_random(num_nodes: number, edge_freq: number): Graph {
    if (edge_freq > 1 || edge_freq < 0)
      throw 'edge_freq must be between 0 and 1';

    let adjList = new Array<Array<number>>(num_nodes)
      .fill([])
      .map(() => new Array<number>(num_nodes).fill(0));

    for (let i = 0; i < num_nodes; i++) {
      adjList[i].fill(0, 0);
      for (let j = i + 1; j < num_nodes; j++) {
        const connected = Math.random() - edge_freq <= 0;

        if (connected) {
          adjList[i][j] = 1;
          adjList[j][i] = 1;
        }
      }
    }

    return this.create(adjList);
  }
}
