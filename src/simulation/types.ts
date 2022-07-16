import { Graph } from '../graph';

// must mutate graph state
export interface Simulation {
  step(graph: Graph): void;
}
