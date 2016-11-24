import { observable, autorun } from 'mobx';

var store = observable({
  name: ""
});

autorun(() => {
  console.log(store.name);
});

store.name = "Aki";
store.name = "Akiko";
