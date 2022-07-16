import {
  mdiCursorDefault,
  mdiCursorDefaultOutline,
  mdiHandBackRight,
  mdiHandBackRightOutline,
  mdiPause,
  mdiPin,
  mdiPinOutline,
  mdiPlay,
} from '@mdi/js';
import { Graph, GraphFactory } from './graph';
import { SelectAction } from './interaction';
import PinAction from './interaction/pin';
import CanvasRenderer from './render/canvas_renderer';
import { Vec2d } from './simple_vec';
import { SimulationManager, SpringElectrical } from './simulation';
import './style.css';
import Button from './view/button';

main();

function main() {
  const canvas = document.querySelector<HTMLCanvasElement>('#graph')!;

  // const g1 = GraphFactory.create([
  //   [0, 1, 0, 1],
  //   [1, 0, 1, 1],
  //   [0, 1, 0, 0],
  //   [1, 1, 0, 0],
  // ]);
  const g2 = GraphFactory.create_random(100, 0.1);

  // const eOpts: EadesOptions = {
  //   idealLength: 10,
  //   springConstant: 1,
  //   repulsionConstant: 2,
  //   falloff: 0.99,
  //   minChange: 3,
  // };

  const seOps = {
    K: 15,
    maxStepSize: 10,
    tolerance: 1,
  };

  // const eades = new Eades(eOpts);
  const simple = new SpringElectrical(seOps);

  const simManager = new SimulationManager(g2, {
    simulation: simple,
    maxSteps: 1000,
    startPaused: true,
    tolerance: 1,
  });
  const canvasRenderer = new CanvasRenderer('#graph', simManager, {
    radius: 5,
  });
  // CanvasRenderer.DEBUG = true;

  // create actions
  const selectAction = new SelectAction(simManager.graph, canvasRenderer);
  const pinAction = new PinAction(simManager.graph, canvasRenderer);

  // create buttons with linked actions
  const pinBtn = new Button('.actions .pin', mdiPinOutline, mdiPin, pinAction);
  const panBtn = new Button(
    '.actions .pan',
    mdiHandBackRightOutline,
    mdiHandBackRight
  );
  const selectBtn = new Button(
    '.actions .select',
    mdiCursorDefaultOutline,
    mdiCursorDefault,
    selectAction
  );
  const playBtn = new Button('.actions .play-pause', mdiPlay, mdiPause);

  // group buttons
  Button.group(selectBtn, panBtn, pinBtn);

  panBtn.handle('click', () => {
    console.log('TODO: panning');
  });

  playBtn.handle('click', () => {
    if (playBtn.active) simManager.start();
    else simManager.stop();
  });

  // randomly init positions
  init_pos(simManager.graph, canvas);

  // begin simulation
  canvasRenderer.renderLoop();
}

function init_pos(graph: Graph, canvas: HTMLCanvasElement) {
  graph.nodes.forEach((node) => {
    const x =
      (Math.random() * canvas.width) / 2 + (Math.random() * canvas.width) / 2;
    const y =
      (Math.random() * canvas.height) / 2 + (Math.random() * canvas.height) / 2;

    node.pos = new Vec2d(x, y);
  });
}
