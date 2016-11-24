import { observable, autorun } from 'mobx';
import { fabric } from 'fabric';

let store = observable({
  canvasObject: {}
});

autorun(() => {
  if (store.canvasObject.objects) {
    console.log('top:', store.canvasObject.objects[0].top, ', left:', store.canvasObject.objects[0].left);
  }
});

let canvas = new fabric.Canvas('canvas', {
  width: 800, height: 600
});

canvas.on('object:added', () => {
  store.canvasObject = canvas.toObject();
});

canvas.on('mouse:up', () => {
  store.canvasObject = canvas.toObject();
});

let rect = new fabric.Rect({
  top: 100, left: 100, width: 50, height: 50, fill: 'red'
});

canvas.add(rect);
