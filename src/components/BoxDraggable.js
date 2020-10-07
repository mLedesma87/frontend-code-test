import React, {useEffect, useRef} from "react";
import { observer } from "mobx-react";
import interact from 'interactjs'
import { useStore } from "../stores/MainStore"

function BoxDraggable(props) {
  
  const boxRef = useRef(null)
  const store = useStore()
  
  
  useEffect(() => {
    const boxDiv = boxRef.current
    let position = { x:0, y: 0 }
    
    interact(boxDiv)
    .on('tap', function (event) {
      props.box.toggleSelected()
      event.preventDefault()
    })
    .draggable({
      listeners: {
        start(){
          position = {x: props.box.left, y: props.box.top}
        },  
        move (event) {
          const selectedBoxes = document.getElementsByClassName("selected");
          
          if (selectedBoxes && selectedBoxes.length > 1 ) {
            for (let selectedBox of selectedBoxes) {
              const x = parseDataAxis(selectedBox)("x") + event.dx
              const y = parseDataAxis(selectedBox)("y") + event.dy

              translate(selectedBox)(x, y)
              updateAttributes(selectedBox)(x, y)
            }
          } else {
            position.x += event.dx
            position.y += event.dy
            translate(event.target)(position.x, position.y)
          }
        },
        end () {
          const selectedBoxes = document.getElementsByClassName("selected")
          if (selectedBoxes && selectedBoxes.length > 1 ) {
            for (let selectedBox of selectedBoxes) {
              store.boxes.forEach((box) => {
                if (box.id === selectedBox.id) 
                  box.setPosition({
                    x: parseFloat(selectedBox.getAttribute("data-x")),
                    y: parseFloat(selectedBox.getAttribute("data-y"))
                  })
              })
            }
          } else {
            props.box.setPosition(position)
          }
        }
      },
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: 'parent',
          endOnly: true
        })
      ]
    })
    
    const parseDataAxis = target => axis =>
      parseFloat(target.getAttribute(`data-${axis}`))
  
    const translate = target => (x, y) => {
      target.style.transform = "translate(" + x + "px, " + y + "px)"
    }
  
    const updateAttributes = target => (x, y) => {
      target.setAttribute("data-x", x)
      target.setAttribute("data-y", y)
    }

    return () => interact(boxDiv).unset()
  }, [props.box, store.boxes])
  
  return (
    <div
      ref={boxRef}
      id={props.id}
      data-x={props.left}
      data-y={props.top}
      className={`box ${props.box.selected ? 'selected' : ''}`}
      style={{
        backgroundColor: props.color,
        width: props.width,
        height: props.height,
        transform: `translate(${props.left}px, ${props.top}px)`,
        ...(props.box.selected && { borderLeft: `3px solid #e4e4e4`, borderStyle: 'inset', opacity:0.6  })
      }}
    >
      {props.box.selected ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-square"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg> : props.children}
    </div>
  );
}

export default observer(BoxDraggable);
