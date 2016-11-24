import { toJS, observable, autorun, transaction, createTransformer, reaction, observe } from 'mobx';
import { fabric } from 'fabric';

let states = observable([]);
let store = observable({
  currentFrame: -1
});

autorun(() => {
  if (states.length > 0) {
    store.currentFrame = states.length - 1;
  }
});

const reaction1 = reaction(
  () => store.currentFrame,
  (frame) => {
    if (frame >= 0) {
      renderFrame(store.currentFrame);
    }
  }
);

function renderFrame(frame) {
  canvas.off('object:added', handleCanvasModified);
  canvas.off('object:modified', handleCanvasModified);
  canvas.loadFromJSON(states[frame]);
  canvas.renderAll();
  console.log('render from frame changed');
  canvas.on('object:added', handleCanvasModified);
  canvas.on('object:modified', handleCanvasModified);
}

let canvas = new fabric.Canvas('canvas', {
  width: 800, height: 600
});

canvas.on('object:added', handleCanvasModified);
canvas.on('object:modified', handleCanvasModified);

function handleCanvasModified() {
  transaction(() => {
    states.push(canvas.toJSON())
  });
}

let rect1 = new fabric.Rect({
  top: 100, left: 100, width: 50, height: 50, fill: 'red'
});

let rect2 = new fabric.Rect({
  top: 200, left: 100, width: 50, height: 50, fill: 'red'
});

let rect3 = new fabric.Rect({
  top: 300, left: 100, width: 50, height: 50, fill: 'red'
});

let rect4 = new fabric.Rect({
  top: 400, left: 100, width: 50, height: 50, fill: 'red'
});

let rect5 = new fabric.Rect({
  top: 500, left: 100, width: 50, height: 50, fill: 'red'
});

canvas.add(rect1, rect2, rect3, rect4, rect5);

var undoBtn = document.getElementById('undo');
var redoBtn = document.getElementById('redo');

undoBtn.addEventListener('click', () => {
  if (store.currentFrame > 0 && store.currentFrame <= states.length) {
    store.currentFrame--;
  }
});

redoBtn.addEventListener('click', () => {
  if (store.currentFrame >= 0 && store.currentFrame < states.length - 1) {
    store.currentFrame++;
  }
});

