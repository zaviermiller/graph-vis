import { Edge, Graph, GraphNode } from '../graph';

export function getNodeAt(
  graph: Graph,
  x: number,
  y: number,
  radius: number
): GraphNode | null {
  for (const node of graph.nodes) {
    const dx = node.pos!.x - x;
    const dy = node.pos!.y - y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < radius) {
      return node;
    }
  }
  return null;
}

export function edgeOver(graph: Graph, x: number, y: number): Edge | null {
  const TOLERANCE = 0.1;

  for (const edge of graph.edges) {
    const mdX = edge.node1.pos!.x - x;
    const mdY = edge.node1.pos!.y - y;
    const ndX = edge.node1.pos!.x - edge.node2.pos!.x;
    const ndY = edge.node1.pos!.y - edge.node2.pos!.y;

    if (!betweenNodes(edge.node1, edge.node2, x, y)) continue;

    const mouseSlope = mdY / mdX;
    const nodeSlope = ndY / ndX;

    if (Math.abs(mouseSlope - nodeSlope) < TOLERANCE) {
      return edge;
    }
  }
  return null;
}

function betweenNodes(n1: GraphNode, n2: GraphNode, x: number, y: number) {
  const n1x = n1.pos!.x;
  const n1y = n1.pos!.y;
  const n2x = n2.pos!.x;
  const n2y = n2.pos!.y;

  if (n1x < x && x < n2x) {
    if (n1y < y && y < n2y) {
      return true;
    } else if (n1y > y && y > n2y) {
      return true;
    }
  } else if (n1x > x && x > n2x) {
    if (n1y < y && y < n2y) {
      return true;
    } else if (n1y > y && y > n2y) {
      return true;
    }
  }

  return false;
}
