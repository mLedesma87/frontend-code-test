import React, {useContext, createContext} from "react";
import { types } from "mobx-state-tree";
import uuid from "uuid/v4";
import BoxModel from "./models/Box";
import getRandomColor from "../utils/getRandomColor";
import { UndoManager } from "mst-middlewares";

const MainStore = types
  .model("MainStore", {
    boxes: types.array(BoxModel),
    history: types.optional(UndoManager, {})
  })
  .actions(self => {
    setUndoManager(self)
    return {
      addBox(){
        self.boxes.push({
          id: uuid(),
          color: getRandomColor(),
          left: 0,
          top: 0
        });
      },
      removeBox() {
        self.boxes.replace(self.boxes.filter((box) => !box.selected))
      },
      changeColor(color) {
        self.boxes.map(box => (
          box.selected && box.changeColor(color)
        ))
      },
      clearSelectedBoxes() {
        self.boxes.forEach(box => box.selected = false)
      }
    };
  })
  .views(self => ({
    boxCount : () => self.boxes.length,
    selectedBoxCount : () => self.boxes.filter(box => box.selected).length
  }));

  export let undoManager = {}
  export const setUndoManager = (targetStore) => {
      undoManager = targetStore.history
  }

  const StoreContext = createContext();
 
  export const StoreProvider = ({ children, store }) => {
    return (
      <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
    );
  };
  
  export const useStore = () => useContext(StoreContext);

export default MainStore;
