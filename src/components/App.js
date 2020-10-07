import React from "react";

import MainStore from "../stores/MainStore";
import Canvas from "./Canvas";
import Toolbar from "./Toolbar";
import { observer } from "mobx-react";
import { undoManager, StoreProvider } from "../stores/MainStore";
import { onSnapshot } from "mobx-state-tree";

function App() {

  const savedData = localStorage.getItem('mainStore');
  let store = MainStore.create();

  if (savedData) {
    const savedDataJSON = JSON.parse(savedData)
    if (MainStore.is(savedDataJSON)) 
      store = MainStore.create(savedDataJSON)
  } else {
    undoManager.withoutUndo(() => store.addBox())
  }

  onSnapshot(store, snapshot => {
    localStorage.setItem('mainStore', JSON.stringify(snapshot));
  });

  return (
    <div className="app">
      <StoreProvider store={store}>
        <Toolbar />
        <Canvas />
      </StoreProvider>
    </div>
  );
}

export default observer(App);
