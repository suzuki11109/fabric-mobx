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
      renderFrame(states[store.currentFrame]);
    }
  }
);

function renderFrame(object) {
  canvas.off('object:added', handleCanvasModified);
  canvas.off('object:modified', handleCanvasModified);
  canvas.loadFromJSON(object);
  canvas.renderAll();
  canvas.on('object:added', handleCanvasModified);
  canvas.on('object:modified', handleCanvasModified);
}

let canvas = new fabric.Canvas('canvas', {
  width: 800, height: 600
});

function handleCanvasModified() {
  transaction(() => {
    if (store.currentFrame < states.length - 1) {
      states.splice(store.currentFrame + 1);
    }
    states.push(canvas.toJSON())
  });
}

let rect1 = new fabric.Rect({
  top: 100, left: 100, width: 50, height: 50, fill: 'red'
});

let initialObject = {
  'objects': [rect1.toJSON()]
};

states.push(initialObject);

var undoBtn = document.getElementById('undo');
var redoBtn = document.getElementById('redo');
var exportBtn = document.getElementById('export');

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

exportBtn.addEventListener('click', () => {
  let canvasElement = document.getElementById('canvas');
  try {
    var img = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
  } catch(e) {
    var img = canvas.toDataURL().split(',')[1];
  }
  alert(img);
});

