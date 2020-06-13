
import React, { useState, useRef, useEffect } from 'react' ;
import {useSpring, animated} from 'react-spring';
import CardData from './../../data/card/Card';
import Style from './../../css/Style.module.css';
import { useDispatch } from 'react-redux';

import {useDrag} from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import {Draggable} from 'react-draggable';


/** 
 *  Card Component, including front side and rear side 
*/
let defaultProps = {
    clickable: true,
    hoverable: true,
    card: undefined
}


export default function Card(props=defaultProps){

    const [isFaceDown, setisFaceDown] = useState(false)
    const [isHovered, setisHovered] = useState(false)
    const Card = CardData[props.card];
    const wrapperRef = useRef(null);
    const dispatch = useDispatch();


    const spring = useSpring({
        from: {},
        to: {
            transform:  "scale(1.4)",
            boxShadow: "0 0 0.5rem 0.3rem lightgrey", 
            zIndex: "100"
        },
        config: { mass: 4, tension: 500, friction: 10 },
    });



    const [{ isDragging, result }, drag, preview] = useDrag({
        item: { 
            type: 'Card',
            card: props.card,  //key of the cardData
            index: props.index ?? -1,
        },
        canDrag: props.draggable ?? false,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
            result: monitor.getDropResult(),
        }),
    });
    

    useEffect(() => {
        preview(getEmptyImage(), { captureDraggingState: true });
        
        if (result !==null && result !== undefined ){
            props.consume();
        }

    }, []);



    
    function flipCard(){
        const wrapper = wrapperRef.current;
        wrapper.classList.toggle(Style.isFlipped);
        setisFaceDown(!isFaceDown);
    }
    


    //element removed when dragging
    if (isDragging && isHovered ){
        if (isFaceDown){
            flipCard();
        }
        setisHovered(false);
    }
    const hiddenStyle = (!isDragging) ? {} : {
        opacity: "0",
    };



    return (
        <div 
            class={Style.card} 
            onMouseEnter={() => setisHovered(props.hoverable) } 
            onMouseLeave={() => setisHovered(false)}
            onClick={() => flipCard() }
            ref={(props.draggable) ? drag : null }
            style={hiddenStyle}
        >
            <div class={Style.cardInner} ref = {wrapperRef}  >
                <animated.div 
                class={[Style.frontCard].join(' ')} 
                style={(isHovered && props.hoverable && !isFaceDown) ? spring : {}} 
                >
                    <p>{Card.key}</p>
                    <p>---------</p>
                    <p>{Card.description}</p>
                </animated.div>
                
                <animated.div 
                class={[ Style.rearCard,].join(' ')} 
                style={{}} 
                >
                    rearCard
                </animated.div>
            </div>
        </div>
    );  
}

