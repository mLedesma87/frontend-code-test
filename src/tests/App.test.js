import React from "react";
import ReactDOM from "react-dom";
import App from "../components/App";
import MainStore from "../stores/MainStore";

test("Renders correctly the app", () => {
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

describe("MainStore", () => {
  it("creates new box", () => {
    const store = MainStore.create()
    store.addBox()
    store.addBox()
    expect(store.boxCount()).toBe(2)
  })

  it("makes a box selected", () => {
    const store = MainStore.create()
    store.addBox()
    store.boxes[0].toggleSelected()
    expect(store.boxes[0].selected).toBe(true)
    expect(store.selectedBoxCount()).toBe(1)
    store.boxes[0].toggleSelected()
    expect(store.boxes[0].selected).toBe(false)
    expect(store.selectedBoxCount()).toBe(0)
  })

  it("removes a selected box", () => {
    const store = MainStore.create({
      boxes: [{
        id:'1',
        selected: true
      }]
    })
    store.removeBox()
    expect(store.boxCount()).toBe(0)
    store.addBox()
    store.removeBox()
    expect(store.boxCount()).toBe(1)
  })

  it("clears selected boxes", () => {
    const store = MainStore.create({
      boxes: [{
        id:'1',
        selected: true
      },{
        id:'2',
        selected: true
      }]
    })
    store.clearSelectedBoxes()
    expect(store.selectedBoxCount()).toBe(0)
  })

  it("changes a selected box color", () => {
    const store = MainStore.create({
      boxes: [{
        id:'1',
        color:'#000',
        selected: true
      }]
    })
    store.changeColor('#fff')
    expect(store.boxes[0].color).toBe('#fff')
  })

})
