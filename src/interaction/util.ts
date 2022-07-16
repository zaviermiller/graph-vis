import { Graph, GraphNode } from '../graph';

export function getNodeAt(
  graph: Graph,
  x: number,
  y: number,
  radius: number
): GraphNode | null {
  console.log(radius);
  for (const node of graph.nodes) {
    const dx = node.pos!.x - x;
    const dy = node.pos!.y - y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < radius) {
      console.log('detected');
      return node;
    }
  }
  return null;
}
