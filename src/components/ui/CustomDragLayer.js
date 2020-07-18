import React from 'react'
import { useDragLayer } from 'react-dnd'
import { useSelector } from 'react-redux';
import Card from './../card/Card';
import Style from './../../css/Style.module.css';


/**
 * Style for the item when being dragged
 */
const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
}


/**
 * This function handles the style of the offset
 * @param {*} initialOffset 
 * @param {*} currentOffset 
 */
function getItemStyles(initialOffset, currentOffset) {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none',
    }
  }
  let { x, y } = currentOffset;
  const transform = `translate(${x}px, ${y}px)`
  return {
    transform,
    WebkitTransform: transform,
  }
}



const CustomDragLayer = (props) => {

    //Information about the object itself
    const {
    item,  //This contains the extra information
    isDragging,
    initialOffset,
    currentOffset,
    } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    isDragging: monitor.isDragging(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    }));

    if (!isDragging) {
        return null;
    }
    else { 
        return (
        <div style={layerStyles}>
            <div style={getItemStyles(initialOffset, currentOffset)}>     
              <Card clickable={false} hoverable={false} draggable={false} card={item.card} />
            </div>
        </div>
    );
    }
}

export default CustomDragLayer;




