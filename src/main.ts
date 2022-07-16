import {
  mdiCursorDefault,
  mdiCursorDefaultOutline,
  mdiHandBackRight,
  mdiHandBackRightOutline,
  mdiPause,
  mdiPin,
  mdiPinOutline,
  mdiPlay,
  mdiRestore,
} from '@mdi/js';
import { Graph, GraphFactory } from './graph';
import { SelectAction } from './interaction';
import PinAction from './interaction/pin';
import CanvasRenderer from './render/canvas_renderer';
import { Vec2d } from './simple_vec';
import {
  Eades,
  EadesOptions,
  SimulationManager,
  SpringElectrical,
} from './simulation';
import './style.css';
import Button from './view/button';

main();

function main() {
  const canvas = document.querySelector<HTMLCanvasElement>('#graph')!;

  const g1 = GraphFactory.create([
    [0, 1, 0, 1],
    [1, 0, 1, 1],
    [0, 1, 0, 0],
    [1, 1, 0, 0],
  ]);
  const g2 = GraphFactory.create_random(100, 0.1);

  const eOpts: EadesOptions = {
    idealLength: 10,
    springConstant: 1,
    repulsionConstant: 2,
    falloff: 0.99,
    minChange: 3,
  };

  const seOps = {
    K: 15,
    maxStepSize: 10,
    tolerance: 1,
  };

  const eades = new Eades(eOpts);
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

  const selectAction = new SelectAction(simManager.graph, canvasRenderer);
  const pinAction = new PinAction(simManager.graph, canvasRenderer);

  // create button icons
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
  const resetBtn = new Button('.actions .reset', mdiRestore);
  // iconFor('.actions .play-pause', mdiPlayOutline);

  Button.group(selectBtn, panBtn, pinBtn);

  panBtn.handle('click', () => {});

  playBtn.handle('click', () => {
    if (playBtn.active) simManager.start();
    else simManager.stop();
  });
  // resetBtn.handle('click', () => {
  //   simManager.graph = deepCopy(simManager.originalGraph);
  //   playBtn.deactivate();
  // });

  init_pos(simManager.graph, canvas);

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

function buttonToggle(selector: string) {
  const button = document.querySelector(selector)!;
  button.addEventListener('click', () => {
    document.querySelector('button.active')?.classList.remove('active');
    button.classList.toggle('active');
  });
}
