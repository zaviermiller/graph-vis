import {
  mdiContentCut,
  mdiCursorDefaultOutline,
  mdiHandBackRightOutline,
  mdiPause,
  mdiPinOutline,
  mdiPlay,
} from '@mdi/js';
import { adjMat, GraphFactory, randomizeEdges } from './graph';
import { DeleteEdgeAction, SelectAction } from './interaction';
import PinAction from './interaction/pin';
import CanvasRenderer from './render/canvas_renderer';
import { SimulationManager, SpringElectrical } from './simulation';
import './style.css';
import { Button, Number, Range, TextArea } from './view';

main();

function main() {
  // const graph = GraphFactory.create([
  //   [0, 1, 0, 1],
  //   [1, 0, 1, 1],
  //   [0, 1, 0, 0],
  //   [1, 1, 0, 0],
  // ]);
  const graph = GraphFactory.create_random(10, 0.5);

  // const eOpts: EadesOptions = {
  //   idealLength: 10,
  //   springConstant: 1,
  //   repulsionConstant: 2,
  //   falloff: 0.99,
  //   minChange: 3,
  // };

  const seOps = {
    K: 20,
    maxStepSize: 10,
    tolerance: 1,
  };

  // const eades = new Eades(eOpts);
  const simple = new SpringElectrical(seOps);

  // simManager runs the simulation and holds
  // relevant state required for rendering
  const simManager = new SimulationManager(graph, {
    simulation: simple,
    maxSteps: 1000,
    startPaused: true,
    tolerance: 1,
  });
  // canvasRenderer renders the graph to the canvas
  // using the data from the simulation manager
  const canvasRenderer = new CanvasRenderer('#graph', simManager, {
    nodeRadius: 15,
  });
  // CanvasRenderer.DEBUG = true;

  // create buttons with linked actions
  const pinBtn = new Button(
    '#actions .pin',
    mdiPinOutline,
    mdiPinOutline,
    new PinAction(canvasRenderer)
  );
  const panBtn = new Button(
    '#actions .pan',
    mdiHandBackRightOutline,
    mdiHandBackRightOutline
  );
  const selectBtn = new Button(
    '#actions .select',
    mdiCursorDefaultOutline,
    mdiCursorDefaultOutline,
    new SelectAction(canvasRenderer)
  );
  const playBtn = new Button('#actions .play-pause', mdiPlay, mdiPause);
  const cutEdgeBtn = new Button(
    '#actions .cut-edge',
    mdiContentCut,
    mdiContentCut,
    new DeleteEdgeAction(canvasRenderer)
  );
  const graphInput = new TextArea(
    '#graph-input',
    JSON.stringify(adjMat(graph))
  );
  graphInput.onChange(() => {
    const newGraph = GraphFactory.create(JSON.parse(graphInput.value));
    simManager.graph = newGraph;
    canvasRenderer.graph = newGraph;

    canvasRenderer.setup();
  });
  const edgeFreqRange = new Range('#edge-freq-input', 0.5);
  edgeFreqRange.onInput((value: number) => {
    randomizeEdges(simManager.graph, value);
  });

  const numNodesInput = new Number('#count-input', 10);
  numNodesInput.onChange((value: number) => {
    const newGraph = GraphFactory.create_random(value, 0.5);
    simManager.graph = newGraph;
    canvasRenderer.graph = newGraph;

    canvasRenderer.setup();
  });

  // group buttons
  Button.group(selectBtn, panBtn, pinBtn, cutEdgeBtn);

  panBtn.handle('click', () => {
    console.log('TODO: panning');
  });

  playBtn.handle('click', () => {
    if (playBtn.active) simManager.start();
    else simManager.stop();
  });

  // begin simulation
  canvasRenderer.renderLoop();
}
