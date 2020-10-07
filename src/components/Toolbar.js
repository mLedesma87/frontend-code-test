import React from "react";
import { observer } from "mobx-react";
import { undoManager, useStore } from "../stores/MainStore"

function Toolbar() {
  
  const store = useStore();

  const selectedBoxCount = store.selectedBoxCount();
  const boxCount = store.boxCount();

  const handleAddClick = () => store.addBox()
  const handleRemoveClick = () => store.removeBox()
  const handleChangeColor = (event) => store.changeColor(event.target.value)
  const handleUndoClick = () => undoManager.canUndo && undoManager.undo()
  const handleRedoClick = () => undoManager.canRedo && undoManager.redo()
  const handleClearSelection = () => store.clearSelectedBoxes()

  return (
    <div className="toolbar">
      <div className="toolbar-input-wrapper">
        <button onClick={handleAddClick} disabled={selectedBoxCount > 0} className={'button add'} > + Add Box</button>
        <button onClick={handleRemoveClick} disabled={selectedBoxCount === 0} className='button remove' > - Remove Box</button>
        <div style={{display:'flex', flexDirection: 'row', width:'30%', justifyContent:'space-evenly'}}>
          <span>Change color: </span>
          <input type="color" onBlur={handleChangeColor} disabled={selectedBoxCount === 0} />
        </div>
      </div>
      <div className="toolbar-undo-wrapper">
        <div style={{display:'flex', width:'50%', justifyContent:'space-evenly'}}>
          <span style={{textDecoration:'underline', cursor:'pointer'}} className={selectedBoxCount === 0 ? 'span-disabled' : ''} onClick={handleClearSelection}> Clear selection </span>
          <span>{`${selectedBoxCount} of ${boxCount} selected`}</span>
        </div>
        <div style={{display:'flex'}}>
          <div onClick={handleUndoClick} className={`history-icon ${!undoManager.canUndo ? 'icon-disabled' : ''}`} ><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#EFEFF0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-corner-up-left"><polyline points="9 14 4 9 9 4"></polyline><path d="M20 20v-7a4 4 0 0 0-4-4H4"></path></svg></div>
          <div onClick={handleRedoClick} className={`history-icon ${!undoManager.canRedo ? 'icon-disabled' : ''}`} ><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#EFEFF0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-corner-up-right"><polyline points="15 14 20 9 15 4"></polyline><path d="M4 20v-7a4 4 0 0 1 4-4h12"></path></svg></div>
        </div>
      </div>
    </div>
  );
}

export default observer(Toolbar);
