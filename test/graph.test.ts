import { describe, expect, it, test } from 'vitest';
import { deepCopy, GraphFactory } from '../src/graph';

describe('Graph tests', () => {
  describe('GraphFactory tests', () => {
    test('create works', () => {
      const adjList = [
        [0, 1, 1, 0, 0, 0],
        [1, 0, 1, 0, 0, 0],
        [1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0],
        [0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ];
      const graph = deepCopy(GraphFactory.create(adjList));
      expect(graph.nodes.length).toBe(6);
      expect(graph.edges.length).toBe(4);
    });

    test('create_random works', () => {
      const graph = GraphFactory.create_random(6, 1);
      expect(graph.nodes.length).toBe(6);
      expect(graph.edges.length).toBe(15);
    });
    it('should throw err when edge_freq is not between 0 and 1', () => {
      expect(() => GraphFactory.create_random(6, -1)).toThrow(
        'edge_freq must be between 0 and 1'
      );
      expect(() => GraphFactory.create_random(6, 2)).toThrow(
        'edge_freq must be between 0 and 1'
      );
    });
  });

  test('deepCopy', () => {
    const graph = GraphFactory.create_random(6, 0.5);
    const graph2 = deepCopy(graph);
    expect(graph2.nodes).toEqual(graph.nodes);
    expect(graph2.edges).toEqual(graph.edges);
    expect(graph2).not.toBe(graph);
  });
});
