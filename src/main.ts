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
import { GraphFactory } from './graph';
import { SelectAction } from './interaction';
import PinAction from './interaction/pin';
import CanvasRenderer from './render/canvas_renderer';
import { SimulationManager, SpringElectrical } from './simulation';
import './style.css';
import Button from './view/button';

main();

function main() {
  // const g1 = GraphFactory.create([
  //   [0, 1, 0, 1],
  //   [1, 0, 1, 1],
  //   [0, 1, 0, 0],
  //   [1, 1, 0, 0],
  // ]);
  const g2 = GraphFactory.create_random(10, 0.5);

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
  const simManager = new SimulationManager(g2, {
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

  // actions for interacting with the graph
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

  // begin simulation
  canvasRenderer.renderLoop();
}
